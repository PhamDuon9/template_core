using AutoMapper;
using Backend.Infrastructure.Common.Interfaces;
using Backend.Infrastructure.EntityFramework.Datatables;
using Backend.Infrastructure.EntityFramework.Repositories;
using Backend.Infrastructure.Utils;
using Backend.Model;
using IIG.Core.Framework.ICom.Infrastructure.Utils;
using Newtonsoft.Json;
using Serilog;
using Shared.Caching.Interface;
using System.Data;
using static Backend.Infrastructure.Utils.Constant;

namespace Backend.Business.Customer;

public class CustomerHandler : ICustomerHandler
{
    private readonly IMapper _mapper;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly ICached _cached;
    private readonly ICurrentUser _currentUser;

    public CustomerHandler(IMapper mapper, IHttpContextAccessor httpContextAccessor, ICached cached, ICurrentUser currentUser)
    {
        _mapper = mapper;
        _httpContextAccessor = httpContextAccessor;
        _cached = cached;
        _currentUser = currentUser;
    }

    public ResponseData Create(CustomerModel model)
    {
        try
        {
            using UnitOfWork unitOfWork = new(_httpContextAccessor);
            model.Id = Guid.NewGuid();
            var exist = unitOfWork.Repository<SysCustomer>().Get(g => g.DepartmentId == model.DepartmentId && (g.Code == model.Code || (!string.IsNullOrEmpty(model.Name) && g.Name.Trim().ToLower() == model.Name.Trim().ToLower()) || (!string.IsNullOrEmpty(model.TaxCode) && g.TaxCode.Trim().ToLower() == model.TaxCode.Trim().ToLower())));
            if (exist != null && exist.Count() > 0)
            {
                return new ResponseDataError(Code.ServerError, "Khách hàng đã tồn tại");
            }

            var mapperModel = _mapper.Map<SysCustomer>(model);
            mapperModel.LastModifiedByUserId = _currentUser.GetUserId();
            mapperModel.CreatedByUserId = _currentUser.GetUserId();
            unitOfWork.Repository<SysCustomer>().Insert(mapperModel);
            unitOfWork.Save();
            return new ResponseData(Code.Success, "");
        }
        catch (Exception exception)
        {
            Log.Error(exception, exception.Message);
            return new ResponseDataError(Code.ServerError, exception.Message);
        }
    }

    public ResponseData Delete(Guid id)
    {
        try
        {
            using var unitOfWork = new UnitOfWork(_httpContextAccessor);
            var iigDepartmentData = unitOfWork.Repository<SysCustomer>().GetById(id);
            if (iigDepartmentData == null)
            {
                return new ResponseDataError(Code.NotFound, "Id not found");
            }
            unitOfWork.Repository<SysCustomer>().Delete(iigDepartmentData);
            unitOfWork.Save();
            return new ResponseData(Code.Success, "Xóa thành công");
        }
        catch (Exception exception)
        {
            Log.Error(exception, exception.Message);
            return new ResponseDataError(Code.ServerError, exception.Message);
        }
    }

    public ResponseData Get(string filter)
    {
        try
        {
            int totalCount = 0;
            var filterModel = JsonConvert.DeserializeObject<CustomerFilterModel>(filter);
            if (filterModel == null)
                return new ResponseDataError(Code.BadRequest, "Filter invalid");
            using var unitOfWork = new UnitOfWork(_httpContextAccessor);
            var iigDepartmentData = unitOfWork.Repository<SysCustomer>().Get();
            if (!string.IsNullOrEmpty(filterModel.TextSearch))
                iigDepartmentData = iigDepartmentData.Where(x => x.Name.ToLower().Contains(filterModel.TextSearch.ToLower()));
            if (filterModel.DepartmentId.HasValue)
                iigDepartmentData = iigDepartmentData.Where(x => x.DepartmentId == filterModel.DepartmentId.Value);
            if (filterModel.DistrictId.HasValue)
                iigDepartmentData = iigDepartmentData.Where(x => x.DistrictId == filterModel.DistrictId.Value);
            if (filterModel.ProvinceId.HasValue)
                iigDepartmentData = iigDepartmentData.Where(x => x.ProvinceId == filterModel.ProvinceId.Value);
            totalCount = iigDepartmentData.Count();
            if (filterModel.Page.HasValue && filterModel.Size.HasValue)
            {
                iigDepartmentData = iigDepartmentData.OrderBy(g => g.CreatedOnDate).Skip((filterModel.Page.Value - 1) * filterModel.Size.Value).Take(filterModel.Size.Value);
                filterModel.pageNumber = filterModel.Page.Value;
                filterModel.pageSize = filterModel.Size.Value;
            }
            var result = new List<CustomerModel>();
            foreach (var item in iigDepartmentData)
            {
                var modelMapping = _mapper.Map<CustomerModel>(item);
                modelMapping.CustomerCategoryName = modelMapping.CustomerCategoryId.HasValue ? unitOfWork.Repository<SysCustomerCategory>().GetById(modelMapping.CustomerCategoryId)?.Name : null;
                modelMapping.CustomerTypeName = modelMapping.CustomerTypeId.HasValue ? unitOfWork.Repository<SysCustomerType>().GetById(modelMapping.CustomerTypeId)?.Name : null;
                modelMapping.DepartmentName = modelMapping.DepartmentId.HasValue ? unitOfWork.Repository<SysDepartment>().GetById(modelMapping.DepartmentId)?.Name : null;
                modelMapping.ProvinceName = modelMapping.ProvinceId.HasValue ? unitOfWork.Repository<SysProvince>().GetById(modelMapping.ProvinceId)?.Name : null;
                modelMapping.DistrictName = modelMapping.DistrictId.HasValue ? unitOfWork.Repository<SysDistrict>().GetById(modelMapping.DistrictId)?.Name : null;
                result.Add(modelMapping);
            }

            var pagination = new Pagination()
            {
                PageNumber = filterModel.pageNumber,
                PageSize = filterModel.pageSize,
                TotalCount = totalCount,
                TotalPage = (int)Math.Ceiling((decimal)totalCount / filterModel.pageSize)
            };
            return new PageableData<List<CustomerModel>>(result, pagination, Code.Success, "");
        }
        catch (Exception exception)
        {
            Log.Error(exception, exception.Message);
            return new ResponseDataError(Code.ServerError, exception.Message);
        }
    }

    public ResponseData GetById(Guid id)
    {
        try
        {
            using var unitOfWork = new UnitOfWork(_httpContextAccessor);
            var iigDepartmentData = unitOfWork.Repository<SysCustomer>().GetById(id);
            if (iigDepartmentData == null)
            {
                return new ResponseDataError(Code.NotFound, "Id not found");
            }
            var result = _mapper.Map<CustomerModel>(iigDepartmentData);
            result.CustomerCategoryName = result.CustomerCategoryId.HasValue ? unitOfWork.Repository<SysCustomerCategory>().GetById(result.CustomerCategoryId.Value)?.Name : string.Empty;
            result.CustomerTypeName = result.CustomerTypeId.HasValue ? unitOfWork.Repository<SysCustomerType>().GetById(result.CustomerTypeId.Value)?.Name : string.Empty;
            result.DepartmentName = result.DepartmentId.HasValue ? unitOfWork.Repository<SysDepartment>().GetById(result.DepartmentId.Value)?.Name : string.Empty;
            result.DistrictName = result.DistrictId.HasValue ? unitOfWork.Repository<SysDistrict>().GetById(result.DistrictId.Value)?.Name : string.Empty;
            result.ProvinceName = result.ProvinceId.HasValue ? unitOfWork.Repository<SysProvince>().GetById(result.ProvinceId.Value)?.Name : string.Empty;
            return new ResponseDataObject<CustomerModel>(result, Code.Success, "");
        }
        catch (Exception exception)
        {
            Log.Error(exception, exception.Message);
            return new ResponseDataError(Code.ServerError, exception.Message);
        }
    }

    public ResponseData GetFileTemplate()
    {
        try
        {
            // Tạo bảng dữ liệu chung ( Master ) 
            DataTable Master = new DataTable();
            Master.TableName = "Master";

            //Master.Columns.Add("TotalAfterTaxSupport", typeof(Decimal));//Tỷ lệ hỗ trợ sau thuế

            DataRow dr = null;
            dr = Master.NewRow();

            // Tạo bảng dữ liệu Chi tiết ( Details )
            DataTable detailProductCategories = new DataTable();
            DataTable detailProductType = new DataTable();
            using var unitOfWork = new UnitOfWork(_httpContextAccessor);
            var productCategoryEntitys = unitOfWork.Repository<SysProductCategory>().Get();
            var productTypeEntitys = unitOfWork.Repository<SysProductType>().Get();

            if (productCategoryEntitys != null && productCategoryEntitys.Count() > 0)
            {
                List<ProductCategoryModel> productCategoryModels = _mapper.Map<List<ProductCategoryModel>>(productCategoryEntitys);
                if (productCategoryModels != null && productCategoryModels.Count() > 0)
                {
                    detailProductCategories = Commonyy.ToDataTable<ProductCategoryModel>(productCategoryModels);
                    detailProductCategories.TableName = "ProductCategories";
                }

            }
            if (productTypeEntitys != null && productTypeEntitys.Count() > 0)
            {
                List<ProductTypeModel> productTypeModels = _mapper.Map<List<ProductTypeModel>>(productTypeEntitys);
                if (productTypeModels != null && productTypeModels.Count() > 0)
                {
                    detailProductType = Commonyy.ToDataTable<ProductTypeModel>(productTypeModels);
                    detailProductType.TableName = "ProductTypes";
                }
            }


            Master.Rows.Add(dr);
            // Tạo Dataset ghi dữ liệu Master + Details 
            var ds = new DataSet();
            ds.Tables.Add(detailProductCategories);
            ds.Tables.Add(detailProductType);
            ds.Tables.Add(Master);

            // Lấy tên file đầu vào và đầu ra 
            var fileTmp = $"Template_Import_Product.xlsx";

            var fileOutput = $"Template_Import_Product.xlsx";
            //var pathExport = Path.Combine(Environment.CurrentDirectory, @"OutputExcel\" + fileOutput);
            //var fileName = System.IO.Path.GetFileName(pathExport);
            ExcelFillData.FillReport(fileOutput, fileTmp, ds, new string[] { "{", "}" });

            var result = new FileModel() { Extention = ".xlsx" };
            var currentDirectory = Directory.GetCurrentDirectory();
            var filePath = "";
            result.Name = "Template_Import_Product";
            result.Description = "File import san pham";
            filePath = currentDirectory + Utils.GetConfig("ImportTemplateFilePath:Template_Import_Product");
            if (System.IO.File.Exists(filePath))
            {
                var bytes = System.IO.File.ReadAllBytes(filePath);
                result.Base64 = Convert.ToBase64String(bytes);
            }
            return new ResponseDataObject<FileModel>(result, Code.Success, "");
        }
        catch (Exception exception)
        {
            Log.Error(exception, exception.Message);
            return new ResponseDataError(Code.ServerError, exception.Message);
        }
    }

    public ResponseData Import(IFormFile file)
    {
        try
        {
            //xóa cache data
            _cached.FlushNameSpace($"{this.GetType().Name}");
            List<Dictionary<string, string>> errorDetails = new();
            Spire.Xls.Workbook workbook = new();
            workbook.LoadFromStream(file.OpenReadStream());
            Spire.Xls.Worksheet sheet = workbook.Worksheets[0];

            var dt = sheet.ExportDataTable();

            //if (dt.Columns[0].ColumnName != CustomerExcelColumnName.col0
            //    || dt.Columns[1].ColumnName != CustomerExcelColumnName.col1
            //    || dt.Columns[2].ColumnName != CustomerExcelColumnName.col2
            //    || dt.Columns[3].ColumnName != CustomerExcelColumnName.col3
            //    || dt.Columns[4].ColumnName != CustomerExcelColumnName.col4
            //    || dt.Columns[5].ColumnName != CustomerExcelColumnName.col5
            //    || dt.Columns[5].ColumnName != CustomerExcelColumnName.col6
            //    || dt.Columns[5].ColumnName != CustomerExcelColumnName.col7
            //    || dt.Columns[5].ColumnName != CustomerExcelColumnName.col8
            //    || dt.Columns[5].ColumnName != CustomerExcelColumnName.col9
            //    || dt.Columns[5].ColumnName != CustomerExcelColumnName.col10
            //    || dt.Columns[5].ColumnName != CustomerExcelColumnName.col11
            //    || dt.Columns[6].ColumnName != CustomerExcelColumnName.col12)
            //{
            //    Dictionary<string, string> error = new() { { "Format", "File không đúng định dạng" } };
            //    errorDetails.Add(error);
            //}

            using var unitOfWork = new UnitOfWork(_httpContextAccessor);

            foreach (DataRow item in dt.Rows)
            {
                var customerName = item[CustomerExcelColumnName.col2].ToString();
                if (string.IsNullOrEmpty(customerName))
                {
                    continue;
                }


                SysCustomer customer = new()
                {
                    Address = item[CustomerExcelColumnName.col4].ToString(),
                    Description = "Import from excel",
                    Id = Guid.NewGuid(),
                    Name = item[CustomerExcelColumnName.col2].ToString(),
                    TaxCode = item[CustomerExcelColumnName.col3].ToString(),
                    CreatedByUserId = new Guid(_httpContextAccessor.HttpContext.Request.Headers["IIG-User"]),
                    LastModifiedByUserId = new Guid(_httpContextAccessor.HttpContext.Request.Headers["IIG-User"]),
                    Representative = item[CustomerExcelColumnName.col7].ToString(),
                    Position = item[CustomerExcelColumnName.col8].ToString(),
                    Telephone = item[CustomerExcelColumnName.col9].ToString(),
                    Fax = item[CustomerExcelColumnName.col10].ToString(),
                    BankAccount = item[CustomerExcelColumnName.col11].ToString(),
                    BankBrand = item[CustomerExcelColumnName.col12].ToString(),
                };

                var customerCategoryCode = item[CustomerExcelColumnName.col0].ToString();
                if (!string.IsNullOrEmpty(customerCategoryCode))
                {
                    var customerCategory = unitOfWork.Repository<SysCustomerCategory>().Get(x => x.Code == customerCategoryCode)?.FirstOrDefault();
                    if (customerCategory != null)
                    {
                        customer.CustomerCategoryId = customerCategory.Id;
                    }

                }
                if (!string.IsNullOrEmpty(item[CustomerExcelColumnName.col13].ToString()))
                {
                    var customerTypeCode = item[CustomerExcelColumnName.col13].ToString();
                    var customerType = unitOfWork.Repository<SysCustomerType>().Get(x => x.Code == customerTypeCode)?.FirstOrDefault();
                    if (customerType != null)
                    {
                        customer.CustomerTypeId = customerType.Id;
                    }
                }
                if (!string.IsNullOrEmpty(item[CustomerExcelColumnName.col6].ToString()))
                {
                    var departmentCode = item[CustomerExcelColumnName.col6].ToString();
                    var department = unitOfWork.Repository<SysDepartment>().Get(x => x.Code == departmentCode)?.FirstOrDefault();
                    if (department != null)
                    {
                        customer.DepartmentId = department.Id;
                    }
                    else
                    {
                        Dictionary<string, string> error = new() { { "Cảnh báo", $"{departmentCode} không tồn tại" } };
                        errorDetails.Add(error);
                    }
                }
                if (!string.IsNullOrEmpty(item[CustomerExcelColumnName.col14].ToString()))
                {
                    var provinceName = item[CustomerExcelColumnName.col14].ToString();
                    SysProvince province = null;

                    //kiểm tra điều kiện = tuyệt đối trước
                    province = unitOfWork.Repository<SysProvince>().Get(x => x.Name.ToLower() == provinceName.ToLower())?.FirstOrDefault();
                    if (province == null)// kiểm tra điều kiện chứa text theo toán tử like
                    {
                        province = unitOfWork.Repository<SysProvince>().Get(x => x.Name.ToLower().Contains(provinceName.ToLower()))?.FirstOrDefault();
                    }
                    if (province != null)
                    {
                        customer.ProvinceId = province.Id;
                    }
                }
                if (!string.IsNullOrEmpty(item[CustomerExcelColumnName.col15].ToString()))
                {
                    var districtName = item[CustomerExcelColumnName.col15].ToString();
                    SysDistrict district = null;

                    //kiểm tra điều kiện = tuyệt đối trước
                    district = unitOfWork.Repository<SysDistrict>().Get(x => x.Name.ToLower() == districtName.ToLower())?.FirstOrDefault();
                    if (district == null)// kiểm tra điều kiện chứa text theo toán tử like
                    {
                        district = unitOfWork.Repository<SysDistrict>().Get(x => x.Name.ToLower().Contains(districtName.ToLower()))?.FirstOrDefault();
                    }
                    if (district != null)
                    {
                        customer.DistrictId = district.Id;
                    }
                }

                var customerCode = item[CustomerExcelColumnName.col1].ToString();

                //nếu cột mã có điền thì lấy theo mã điền còn không tự động sinh mã
                if (!string.IsNullOrEmpty(customerCode))
                {
                    var customerExist = unitOfWork.Repository<SysCustomer>().Get(x => x.Code == customerCode)?.FirstOrDefault();
                    if (customerExist != null)
                    {
                        customerExist.Name = customer.Name?.Trim();
                        customerExist.CustomerCategoryId = customer.CustomerCategoryId;
                        customerExist.DepartmentId = customer.DepartmentId;
                        customerExist.ProvinceId = customer.ProvinceId;
                        customerExist.DistrictId = customer.DistrictId;
                        customerExist.Address = customer.Address?.Trim();
                        customerExist.TaxCode = customer.TaxCode?.Trim();
                        customerExist.CustomerTypeId = customer.CustomerTypeId;
                        customerExist.BankAccount = customer.BankAccount?.Trim();
                        customerExist.BankBrand = customer.BankBrand?.Trim();
                        customerExist.Fax = customer.Fax?.Trim();
                        customerExist.Position = customer.Position?.Trim();
                        customerExist.Representative = customer.Representative?.Trim();
                        customerExist.Telephone = customer.Telephone?.Trim();
                        unitOfWork.Repository<SysCustomer>().Update(customerExist);
                    }
                    else
                    {
                        customer.Code = customerCode?.Trim();
                        unitOfWork.Repository<SysCustomer>().Insert(customer);
                    }
                }
                else
                {
                    customer.Code = $"KH-{DateTime.Now.ToString("yyyyMMddHHmmss")}";
                    unitOfWork.Repository<SysCustomer>().Insert(customer);
                }

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

    public ResponseData Update(Guid id, CustomerModel model)
    {
        try
        {
            using var unitOfWork = new UnitOfWork(_httpContextAccessor);
            var exist = unitOfWork.Repository<SysCustomer>().Get(g => g.Id != id && g.DepartmentId == model.DepartmentId && (g.Code == model.Code || (!string.IsNullOrEmpty(model.Name) && g.Name.Trim().ToLower() == model.Name.Trim().ToLower()) || (!string.IsNullOrEmpty(model.TaxCode) && g.TaxCode.Trim().ToLower() == model.TaxCode.Trim().ToLower())));
            if (exist != null && exist.Count() > 0)
            {
                return new ResponseDataError(Code.ServerError, "Khách hàng đã tồn tại");
            }
            var existData = unitOfWork.Repository<SysCustomer>().GetById(id);
            if (existData != null)
            {
                existData.Code = model.Code.Trim();
                existData.Description = model.Description?.Trim();
                existData.Name = model.Name.Trim();
                existData.CustomerCategoryId = model.CustomerCategoryId;
                existData.CustomerTypeId = model.CustomerTypeId;
                existData.DepartmentId = model.DepartmentId;
                existData.DistrictId = model.DistrictId;
                existData.ProvinceId = model.ProvinceId;
                existData.Address = model.Address?.Trim();
                existData.TaxCode = model.TaxCode?.Trim();
                existData.LastModifiedByUserId = _currentUser.GetUserId();
                existData.LastModifiedOnDate = DateTime.Now;
                existData.Representative = model.Representative;
                existData.Position = model.Position?.Trim();
                existData.Telephone = model.Telephone?.Trim();
                existData.Fax = model.Fax?.Trim();
                existData.BankAccount = model.BankAccount?.Trim();
                existData.BankBrand = model.BankBrand?.Trim();
                unitOfWork.Repository<SysCustomer>().Update(existData);
                unitOfWork.Save();
                return new ResponseData(Code.Success, "Success");
            }
            return new ResponseDataError(Code.NotFound, "Not found");
        }
        catch (Exception exception)
        {
            Log.Error(exception, exception.Message);
            return new ResponseDataError(Code.ServerError, exception.Message);
        }
    }
}