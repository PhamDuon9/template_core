using Backend.Infrastructure.EntityFramework.Datatables;
using Backend.Infrastructure.EntityFramework.Repositories;
using Backend.Infrastructure.Utils;
using Backend.Model;
using Serilog;
using Shared.Caching.Interface;
using Shared.Core.Utils;
using Spire.Xls;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using static Backend.Infrastructure.Utils.Constant;

namespace Backend.Business.AdministrativeDivision
{
    public class AdministrativeDivisionHandler : IAdministrativeDivisionHandler
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly ICached _cached;

        public AdministrativeDivisionHandler(IHttpContextAccessor httpContextAccessor, ICached cached)
        {
            _httpContextAccessor = httpContextAccessor;
            _cached = cached;
        }

        public ResponseData GetDistrict(Guid provinceId)
        {
            string keyCache = $"{this.GetType().Name}:{System.Reflection.MethodBase.GetCurrentMethod().Name}:{provinceId}";
            try
            {
                var checkKeyExist = _cached.CheckKeyExist(keyCache);
                if (checkKeyExist)
                {
                    var dataFromRedis = _cached.Get<List<DistrictModel>>(keyCache);
                    if (dataFromRedis != null && dataFromRedis.Count() > 0)
                    {
                        return new ResponseDataObject<List<DistrictModel>>(dataFromRedis, Code.Success, "Success From Redis");
                    }
                }
                using var unitOfWork = new UnitOfWork(_httpContextAccessor);
                var districtData = unitOfWork.Repository<SysDistrict>().Get(x => x.ProvinceId == provinceId).OrderBy(x => x.Code);
                var result = new List<DistrictModel>();
                foreach (var item in districtData)
                {
                    result.Add(new DistrictModel()
                    {
                        Code = item.Code,
                        Id = item.Id,
                        Name = item.Name
                    });
                }
                _cached.Add(keyCache, result, 10080);
                return new ResponseDataObject<List<DistrictModel>>(result, Code.Success, "");
            }
            catch (Exception e)
            {
                Log.Error(e, e.Message);
                return new ResponseDataError(Code.ServerError, e.Message);
            }
        }

        public ResponseData GetProvinceId(Guid provinceId)
        {
            string keyCache = $"{this.GetType().Name}:{System.Reflection.MethodBase.GetCurrentMethod().Name}:{provinceId}";
            try
            {
                var checkKeyExist = _cached.CheckKeyExist(keyCache);
                if (checkKeyExist)
                {
                    var dataFromRedis = _cached.Get<ProvinceModel>(keyCache);
                    if (dataFromRedis != null)
                    {
                        return new ResponseDataObject<ProvinceModel>(dataFromRedis, Code.Success, "Success From Redis");
                    }
                }
                using var unitOfWork = new UnitOfWork(_httpContextAccessor);
                var provinceData = unitOfWork.Repository<SysProvince>().Get(x => x.Id == provinceId).FirstOrDefault();
                var result = new ProvinceModel()
                {
                    Id = provinceId,
                    Area = provinceData.Area,
                    Code = provinceData.Code,
                    Name = provinceData.Name,
                };
                _cached.Add(keyCache, result, 10080);
                return new ResponseDataObject<ProvinceModel>(result, Code.Success, "");
            }
            catch (Exception e)
            {
                Log.Error(e, e.Message);
                return new ResponseDataError(Code.ServerError, e.Message);
            }
        }

        public ResponseData GetProvince(bool isGetAllDistrict)
        {
            string keyCache = $"{this.GetType().Name}:{System.Reflection.MethodBase.GetCurrentMethod().Name}:{Utilities.MD5Hash(isGetAllDistrict.ToString())}";
            try
            {
                var checkKeyExist = _cached.CheckKeyExist(keyCache);
                if (checkKeyExist)
                {
                    var dataFromRedis = _cached.Get<List<ProvinceModel>>(keyCache);
                    if (dataFromRedis != null && dataFromRedis.Count() > 0)
                    {
                        return new ResponseDataObject<List<ProvinceModel>>(dataFromRedis, Code.Success, "Success From Redis");
                    }
                }
                using var unitOfWork = new UnitOfWork(_httpContextAccessor);
                var provinceData = unitOfWork.Repository<SysProvince>().Get().OrderBy(x => x.Code);
                var districtData = unitOfWork.Repository<SysDistrict>().Get();
                var result = new List<ProvinceModel>();

                foreach (var province in provinceData)
                {
                    var temp = new ProvinceModel()
                    {
                        Area = province.Area,
                        Code = province.Code,
                        Districts = new List<DistrictModel>(),
                        Id = province.Id,
                        Name = province.Name
                    };

                    if (isGetAllDistrict)
                    {
                        var tempData = districtData.Where(x => x.ProvinceId == temp.Id).OrderBy(x => x.Code);
                        foreach (var district in tempData)
                        {
                            temp.Districts.Add(new DistrictModel()
                            {
                                Id = district.Id,
                                Code = district.Code,
                                Name = district.Name
                            });
                        }
                    }

                    result.Add(temp);
                }
                _cached.Add(keyCache, result, 10080);
                return new ResponseDataObject<List<ProvinceModel>>(result, Code.Success, "");
            }
            catch (Exception e)
            {
                Log.Error(e, e.Message);
                return new ResponseDataError(Code.ServerError, e.Message);
            }
        }

        public ResponseData ImportDistrict(IFormFile file)
        {
            try
            {
                string keyCache = $"{this.GetType().Name}";
                _cached.FlushNameSpace(keyCache);
                List<Dictionary<string, string>> errorDetails = new();
                using var unitOfWork = new UnitOfWork(_httpContextAccessor);
                Workbook workbook = new();
                workbook.LoadFromStream(file.OpenReadStream());
                Worksheet sheet = workbook.Worksheets[0];

                var dt = sheet.ExportDataTable();

                if (dt.Columns[0].ColumnName != DistrictExcelColumnName.col0 || dt.Columns[1].ColumnName != DistrictExcelColumnName.col1 || dt.Columns[2].ColumnName != DistrictExcelColumnName.col2)
                {
                    Dictionary<string, string> error = new() { { "Format", "File không đúng định dạng" } };
                    errorDetails.Add(error);
                }

                var existData = unitOfWork.Repository<SysDistrict>().Get();
                foreach (var item in existData)
                {
                    unitOfWork.Repository<SysDistrict>().Delete(item);
                }

                var provinceData = unitOfWork.Repository<SysProvince>().Get();
                foreach (DataRow item in dt.Rows)
                {
                    var code = item[DistrictExcelColumnName.col2].ToString();
                    var province = provinceData.FirstOrDefault(x => x.Code == code);

                    SysDistrict district = new()
                    {
                        Id = Guid.NewGuid(),
                        Code = item[DistrictExcelColumnName.col0].ToString(),
                        Name = item[DistrictExcelColumnName.col1].ToString(),
                    };

                    if (province != null)
                        district.ProvinceId = province.Id;

                    unitOfWork.Repository<SysDistrict>().Insert(district);
                }
                if (errorDetails.Count != 0)
                    return new ResponseDataError(Code.BadRequest, "", errorDetails);
                else
                {
                    unitOfWork.Save();
                    return new ResponseData(Code.Success, "Success");
                }
            }
            catch (Exception e)
            {
                Log.Error(e, e.Message);
                return new ResponseDataError(Code.ServerError, e.Message);
            }
        }

        public ResponseData ImportProvince(IFormFile file)
        {
            try
            {
                string keyCache = $"{this.GetType().Name}";
                _cached.FlushNameSpace(keyCache);

                List<Dictionary<string, string>> errorDetails = new();
                using var unitOfWork = new UnitOfWork(_httpContextAccessor);
                Workbook workbook = new();
                workbook.LoadFromStream(file.OpenReadStream());
                Worksheet sheet = workbook.Worksheets[0];

                var dt = sheet.ExportDataTable();

                if (dt.Columns[0].ColumnName != ProvinceExcelColumnName.col0 || dt.Columns[1].ColumnName != ProvinceExcelColumnName.col1)
                {
                    Dictionary<string, string> error = new() { { "Format", "File không đúng định dạng" } };
                    errorDetails.Add(error);
                }

                var existData = unitOfWork.Repository<SysProvince>().Get();
                foreach (var item in existData)
                {
                    unitOfWork.Repository<SysProvince>().Delete(item);
                }

                foreach (DataRow item in dt.Rows)
                {
                    SysProvince province = new()
                    {
                        Id = Guid.NewGuid(),
                        Code = item[ProvinceExcelColumnName.col0].ToString(),
                        Name = item[ProvinceExcelColumnName.col1].ToString(),
                    };

                    unitOfWork.Repository<SysProvince>().Insert(province);
                }

                if (errorDetails.Count != 0)
                    return new ResponseDataError(Code.BadRequest, "", errorDetails);
                else
                {
                    unitOfWork.Save();
                    return new ResponseData(Code.Success, "Success");
                }
            }
            catch (Exception e)
            {
                Log.Error(e, e.Message);
                return new ResponseDataError(Code.ServerError, e.Message);
            }
        }
    }
}
