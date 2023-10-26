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

namespace Backend.Business.Branch;

public class ProductHandler : IProductHandler
{
    private readonly IMapper _mapper;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly ICached _cached;
    private readonly ICurrentUser _currentUser;

    public ProductHandler(IMapper mapper, IHttpContextAccessor httpContextAccessor, ICached cached, ICurrentUser currentUser)
    {
        _mapper = mapper;
        _httpContextAccessor = httpContextAccessor;
        _cached = cached;
        _currentUser = currentUser;
    }

    public ResponseData Create(ProductModel model)
    {
        try
        {
            using UnitOfWork unitOfWork = new(_httpContextAccessor);
            model.Id = Guid.NewGuid();

            unitOfWork.Repository<SysProduct>().Insert(_mapper.Map<SysProduct>(model));
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
            var iigDepartmentData = unitOfWork.Repository<SysProduct>().GetById(id);
            if (iigDepartmentData == null)
            {
                return new ResponseDataError(Code.NotFound, "Id not found");
            }
            unitOfWork.Repository<SysProduct>().Delete(iigDepartmentData);
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
            int pageNumber = 0;
            int pageSize = 20;
            int totalCount = 0;
            var filterModel = JsonConvert.DeserializeObject<ProductFilterModel>(filter);
            if (filterModel == null)
                return new ResponseDataError(Code.BadRequest, "Filter invalid");
            using var unitOfWork = new UnitOfWork(_httpContextAccessor);
            var iigDepartmentData = unitOfWork.Repository<SysProduct>().Get();
            if (!string.IsNullOrEmpty(filterModel.TextSearch))
                iigDepartmentData = iigDepartmentData.Where(x => x.Name.ToLower().Contains(filterModel.TextSearch.ToLower()));
            if (filterModel.ProductCategoryId.HasValue)
                iigDepartmentData = iigDepartmentData.Where(x => x.ProductCategoryId == filterModel.ProductCategoryId.Value);
            if (filterModel.ProductTypeId.HasValue)
                iigDepartmentData = iigDepartmentData.Where(x => x.ProductTypeId == filterModel.ProductTypeId.Value);
            totalCount = iigDepartmentData.Count();
            if (filterModel.Page.HasValue && filterModel.Size.HasValue)
            {
                iigDepartmentData = iigDepartmentData.OrderBy(g => g.CreatedOnDate).Skip((filterModel.Page.Value - 1) * filterModel.Size.Value).Take(filterModel.Size.Value);
                pageNumber = filterModel.Page.Value;
                pageSize = filterModel.Size.Value;
            }
            var result = new List<ProductModel>();
            foreach (var item in iigDepartmentData)
            {
                var modelMapping = _mapper.Map<ProductModel>(item);
                modelMapping.ProductCategoryName = modelMapping.ProductCategoryId.HasValue ? unitOfWork.Repository<SysProductCategory>().GetById(modelMapping.ProductCategoryId)?.Name : null;
                modelMapping.ProductTypeName = modelMapping.ProductTypeId.HasValue ? unitOfWork.Repository<SysProductType>().GetById(modelMapping.ProductTypeId)?.Name : null;
                result.Add(modelMapping);
            }

            var pagination = new Pagination()
            {
                PageNumber = pageNumber,
                PageSize = pageSize,
                TotalCount = totalCount,
                TotalPage = (int)Math.Ceiling((decimal)totalCount / pageSize)
            };
            return new PageableData<List<ProductModel>>(result, pagination, Code.Success, "");
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
            var iigDepartmentData = unitOfWork.Repository<SysProduct>().GetById(id);
            if (iigDepartmentData == null)
            {
                return new ResponseDataError(Code.NotFound, "Id not found");
            }
            var result = _mapper.Map<ProductModel>(iigDepartmentData);
            return new ResponseDataObject<ProductModel>(result, Code.Success, "");
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

            if (dt.Columns[0].ColumnName != ProductExcelColumnName.col2
                || dt.Columns[1].ColumnName != ProductExcelColumnName.col1
                || dt.Columns[2].ColumnName != ProductExcelColumnName.col0
                || dt.Columns[3].ColumnName != ProductExcelColumnName.col6
                || dt.Columns[4].ColumnName != ProductExcelColumnName.col3
                || dt.Columns[5].ColumnName != ProductExcelColumnName.col4
                || dt.Columns[6].ColumnName != ProductExcelColumnName.col5)
            {
                Dictionary<string, string> error = new() { { "Format", "File không đúng định dạng" } };
                errorDetails.Add(error);
            }

            using var unitOfWork = new UnitOfWork(_httpContextAccessor);

            foreach (DataRow item in dt.Rows)
            {
                var productName = item[ProductExcelColumnName.col2].ToString();
                if (string.IsNullOrEmpty(productName))
                {
                    continue;
                }
                Int32.TryParse(item[ProductExcelColumnName.col3].ToString()?.Replace(@",", @""), out int price);
                float.TryParse(item[ProductExcelColumnName.col4].ToString(), out float tax);
                SysProduct product = new()
                {
                    Code = item[ProductExcelColumnName.col1].ToString(),
                    Description = item[ProductExcelColumnName.col5].ToString(),
                    Id = Guid.NewGuid(),
                    Name = item[ProductExcelColumnName.col2].ToString(),
                    Price = price,
                    Tax = tax,
                    CreatedByUserId = _currentUser.GetUserId(),
                    LastModifiedByUserId = _currentUser.GetUserId()
                };

                var productCategoryCode = item[ProductExcelColumnName.col0].ToString();
                if (!string.IsNullOrEmpty(productCategoryCode))
                {
                    var productCategory = unitOfWork.Repository<SysProductCategory>().Get(x => x.Code == productCategoryCode)?.FirstOrDefault();
                    if (productCategory != null)
                    {
                        product.ProductCategoryId = productCategory.Id;
                    }

                }

                var productTypeCode = item[ProductExcelColumnName.col6].ToString();
                if (!string.IsNullOrEmpty(productTypeCode))
                {
                    var productType = unitOfWork.Repository<SysProductType>().Get(x => x.Code == productTypeCode)?.FirstOrDefault();
                    if (productType != null)
                    {
                        product.ProductTypeId = productType.Id;
                    }

                }

                var productCode = item[ProductExcelColumnName.col1].ToString();
                //nếu cột mã có điền thì lấy theo mã điền còn không tự động sinh mã
                if (!string.IsNullOrEmpty(productCode))
                {
                    var productExist = unitOfWork.Repository<SysProduct>().Get(x => x.Code == productCode)?.FirstOrDefault();
                    if (productExist != null)
                    {
                        productExist.Name = product.Name;
                        productExist.Description = product.Description;
                        productExist.ProductCategoryId = product.ProductCategoryId;
                        productExist.ProductTypeId = product.ProductTypeId;
                        productExist.Price = product.Price;
                        productExist.Tax = product.Tax;

                        unitOfWork.Repository<SysProduct>().Update(productExist);
                    }
                    else
                    {
                        product.Code = productCode;
                        unitOfWork.Repository<SysProduct>().Insert(product);
                    }
                }
                else
                {
                    product.Code = $"SP-{DateTime.Now.ToString("yyyyMMddHHmmss")}";
                    unitOfWork.Repository<SysProduct>().Insert(product);
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

    public ResponseData Update(Guid id, ProductModel model)
    {
        try
        {
            using var unitOfWork = new UnitOfWork(_httpContextAccessor);
            var iigDepartmentData = unitOfWork.Repository<SysProduct>().GetById(id);
            if (iigDepartmentData == null)
            {
                return new ResponseDataError(Code.NotFound, "Id not found");
            }
            if (!string.IsNullOrEmpty(model.Code))
                iigDepartmentData.Code = model.Code;
            if (!string.IsNullOrEmpty(model.Name))
                iigDepartmentData.Name = model.Name;

            if (model.ProductCategoryId.HasValue)
                iigDepartmentData.ProductCategoryId = model.ProductCategoryId.Value;

            if (model.ProductTypeId.HasValue)
                iigDepartmentData.ProductTypeId = model.ProductTypeId.Value;

            iigDepartmentData.Description = model.Description;
            unitOfWork.Repository<SysProduct>().Update(iigDepartmentData);

            unitOfWork.Save();
            return new ResponseData(Code.Success, "");
        }
        catch (Exception exception)
        {
            Log.Error(exception, exception.Message);
            return new ResponseDataError(Code.ServerError, exception.Message);
        }
    }
}