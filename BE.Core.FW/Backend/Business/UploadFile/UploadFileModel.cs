using Microsoft.VisualBasic.FileIO;
using System.ComponentModel.DataAnnotations;

namespace Backend.Business.UploadFile
{
    public class UploadFileModel
    {
        public IFormFile? FileDetails { get; set; }
    }
}
