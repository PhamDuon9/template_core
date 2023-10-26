using Backend.Infrastructure.Utils;

namespace Backend.Business.UploadFile
{
    public interface IUploadFileHandler
    {
        public Task<ResponseData> PostFileAsync(UploadFileModel fileData);
    }
}
