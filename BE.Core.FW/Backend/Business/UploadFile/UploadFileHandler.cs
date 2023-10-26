using AutoMapper;
using Backend.Infrastructure.EntityFramework.Datatables;
using Backend.Infrastructure.EntityFramework.Repositories;
using Backend.Infrastructure.Utils;
using ExcelDataReader;
using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualBasic.FileIO;
using Serilog;
using System;
using System.ComponentModel.DataAnnotations;
using System.Linq;

namespace Backend.Business.UploadFile
{
    public class UploadFileHandler : IUploadFileHandler
    {
        private readonly IMapper _mapper;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private IWebHostEnvironment _hostingEnvironment;

        public UploadFileHandler(IMapper mapper, IHttpContextAccessor httpContextAccessor, IWebHostEnvironment hostingEnvironment)
        {
            _mapper = mapper;
            _httpContextAccessor = httpContextAccessor;
            _hostingEnvironment = hostingEnvironment;
        }

        public async Task<ResponseData> PostFileAsync(UploadFileModel fileData)
        {
            try
            {
                string res = string.Empty;
                var currentDirectory = _hostingEnvironment.WebRootPath;
                string uploads = Path.Combine(currentDirectory, "FileUploaded");
                if (!Directory.Exists(uploads))
                {
                    Directory.CreateDirectory(uploads);
                }
                var file = fileData.FileDetails;
                if (file != null)
                {
                    string filePath = Path.Combine(uploads, file.FileName);
                    string htmlFilePath = Path.Combine(_hostingEnvironment.WebRootPath, "FileUploaded", file.FileName);

                    using (Stream fileStream = new FileStream(filePath, FileMode.Create))
                    {
                        await file.CopyToAsync(fileStream);
                        res = file.FileName;
                        return new ResponseData(Code.Success, res);
                    }
                }
                return new ResponseDataError(Code.ServerError, "Lỗi import file");
            }
            catch (Exception ex)
            {
                return new ResponseDataError(Code.ServerError, ex.Message);
            }
        }
    }
}
