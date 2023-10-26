using Newtonsoft.Json;
using Shared.Core.Utils;
using System;
using System.Collections.Generic;

namespace Shared.Core
{
    //For serial
    public class ResponseList<T>
    {
        public T[] Data { get; set; }
        public int TotalCount { get; set; }
        public int DataCount { get; set; }
        public int Status { get; set; }
        public string Message { get; set; }
    }

    public class ResponseObj<T>
    {
        public T Data { get; set; }
        public int TotalCount { get; set; }
        public int DataCount { get; set; }
        public int Status { get; set; }
        public string Message { get; set; }
    }
    public class InforError
    {
        public string ErrorMess { get; set; }
        public int ValidateType { get; set; }
        public string FieldName { get; set; }
    }
    public class Response<T> : Response
    {
        public T Data { get; set; }

        public int TotalCount { get; set; }

        public int DataCount { get; set; }

        public int TotalPage { get; set; }

        public int PageNumber { get; set; }

        public int PageSize { get; set; }
        public List<InforError> ValidateInfo { get; set; }

        public object SummaryData { get; set; }

        //public Response(int status, string message = null, T data = default(T))
        //        : base(status, message)
        //{
        //    Data = data;
        //    TotalCount = 0;
        //    DataCount = 0;
        //}
        //public Response(int status, string message = null, T data = default(T), int dataCount = 0, int totalCount = 0)
        //    : base(status, message)
        //{
        //    Data = data;
        //    TotalCount = totalCount;
        //    DataCount = dataCount;
        //}

        [JsonConstructor]
        public Response(int status, string message = null, T data = default(T), int dataCount = 0, int totalCount = 0, int totalPage = 0, int pageNumber = 0, int pageSize = Constant.DEFAULT_PAGE_SIZE, List<InforError> validateInfo = null,object summaryData = null)
            : base(status, message)
        {
            Data = data;
            TotalCount = totalCount;
            DataCount = dataCount;
            TotalPage = totalPage;
            PageNumber = pageNumber;
            PageSize = pageSize;
            ValidateInfo = validateInfo;
            SummaryData = summaryData;
        }

    }
    //public class Response1<T> : Response
    //{
    //    public T Data { get; set; }

    //    public Response1(int status, string message = null, T data = default(T))
    //        : base(status, message)
    //    {
    //        Data = data;
    //    }

    //}

    public class Response
    {
        public int Status { get; set; }

        public string Message { get; set; }

        public Response(int status, string message = null)
        {
            Status = status;
            Message = message;
        }
    }

}