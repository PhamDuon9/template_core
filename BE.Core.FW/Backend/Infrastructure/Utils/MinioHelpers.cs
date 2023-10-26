using Minio;
using Serilog;

namespace Backend.Infrastructure.Utils
{
    public static class MinioHelpers
    {
        private static readonly string MinioEndpointUrl = Utils.GetConfig("Minio:Endpoint");
        private static readonly int MinioEndpointPort = Convert.ToInt32(Utils.GetConfig("Minio:Port"));
        private static readonly string MinioAccessKey = Utils.GetConfig("Minio:AccessKey");
        private static readonly string MinioSecretKey = Utils.GetConfig("Minio:SecretKey");
        private static readonly string bucketName = Utils.GetConfig("Minio:B2CBucket");
        private static readonly MinioClient minioClient = new MinioClient().WithEndpoint(MinioEndpointUrl, MinioEndpointPort).WithCredentials(MinioAccessKey, MinioSecretKey).Build();

        public static async Task<string> GetBase64Minio(string path)
        {
            #region minio
            string base64Res = string.Empty;
            MinioClient minio = new MinioClient().WithEndpoint(Utils.GetConfig("Minio:Endpoint"), int.Parse(Utils.GetConfig("Minio:Port"))).WithCredentials(Utils.GetConfig("Minio:AccessKey"), Utils.GetConfig("Minio:SecretKey")).Build();

            var bucketName = Backend.Infrastructure.Utils.Utils.GetConfig("Minio:B2CBucket");
            var objectName = path;

            StatObjectArgs statObjectArgs = new StatObjectArgs()
                           .WithBucket(bucketName)
                           .WithObject(objectName);
            await minio.StatObjectAsync(statObjectArgs);

            GetObjectArgs getObjectArgs = new GetObjectArgs()
                                              .WithBucket(bucketName)
                                              .WithObject(objectName)
                                              .WithCallbackStream((stream) =>
                                              {
                                                  byte[] bytes;
                                                  using var memoryStream = new MemoryStream();
                                                  stream.CopyTo(memoryStream);
                                                  bytes = memoryStream.ToArray();
                                                  string base64 = Convert.ToBase64String(bytes);
                                                  base64Res = base64;
                                              });
            await minio.GetObjectAsync(getObjectArgs);
            #endregion
            return base64Res;
        }

        public static async Task<Stream> GetFileFromMinIO(string filePath)
        {
            var memoryStream = new MemoryStream();
            var getObjectArgs = new GetObjectArgs()
                .WithBucket(bucketName)
                .WithObject(filePath)
                .WithCallbackStream(stream => stream.CopyTo(memoryStream));
            await minioClient.GetObjectAsync(getObjectArgs);
            return memoryStream;
        }

        public static async Task UploadFileToMinIO(Stream stream, string filePath)
        {
            var putObjectArg = new PutObjectArgs().WithBucket(bucketName).WithContentType(Utils.GetFileContentType(filePath)).WithStreamData(stream).WithObject(filePath);
            await minioClient.PutObjectAsync(putObjectArg);
        }

        public static async Task DeleteFileInMinIO(List<string> listFilePath)
        {
            var result = await minioClient.RemoveObjectsAsync(new RemoveObjectsArgs().WithBucket(bucketName).WithObjects(listFilePath));
            result.Subscribe(error => Log.Error("Error delete in MinIO: {Error}", error));
        }
    }
}
