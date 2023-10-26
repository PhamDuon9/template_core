namespace Backend.Infrastructure.Utils
{
    public class ResponseData
    {
        public Code Code { get; set; } = Code.Success;
        public string Message { get; set; } = "Thành công";

        public ResponseData()
        {
        }

        public ResponseData(Code code, string message)
        {
            Code = code;
            Message = message;
        }
    }

    public class ResponseDataObject<T> : ResponseData
    {
        public T? Data { get; set; }
        public ResponseDataObject() : base() { }
        public ResponseDataObject(Code code, string message) : base(code, message) { }
        public ResponseDataObject(T data)
        {
            Data = data;
        }

        public ResponseDataObject(T data, Code code, string message) : base(code, message)
        {
            Data = data;
        }
    }

    public class ResponseDataError : ResponseData
    {
        public List<Dictionary<string, string>>? ErrorDetail { get; set; }

        public ResponseDataError(Code code, string message, List<Dictionary<string, string>>? errorDetail = null) : base(code, message)
        {
            ErrorDetail = errorDetail;
        }
    }

    public class Pagination
    {
        public int PageSize { get; set; } = 20;
        public int PageNumber { get; set; } = 1;
        public int TotalCount { get; set; }
        public int TotalPage { get; set; }
        
        public Pagination() { }
        public Pagination(int pageNumber, int pageSize, int totalCount, int totalPage)
        {
            PageNumber = pageNumber;
            PageSize = pageSize;
            TotalCount = totalCount;
            TotalPage = totalPage;
        }
    }
    
    public class PageableData<T> : ResponseDataObject<T>
    {

        public int PageSize { get; set; } = 20;
        public int PageNumber { get; set; } = 1;
        public int TotalCount { get; set; }
        public int TotalPage { get; set; }

        public PageableData() : base() { }
        public PageableData(Code code, string message) : base(code, message) { }
        public PageableData(T data, Code code, string message) : base(code, message)
        {
            Data = data;
        }
        public PageableData(T data, Pagination pagination, Code code, string message) : base(data, code, message)
        {
            PageNumber = pagination.PageNumber;
            PageSize = pagination.PageSize;
            TotalCount = pagination.TotalCount;
            TotalPage = pagination.TotalPage;
        }

    }

    public enum Code
    {
        Success = 200,
        BadRequest = 400,
        Forbidden = 403,
        NotFound = 404,
        MethodNotAllowed = 405,
        ServerError = 500
    }
}
