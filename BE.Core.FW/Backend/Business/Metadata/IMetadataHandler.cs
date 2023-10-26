using Backend.Infrastructure.Utils;

namespace Backend.Business.Metadata
{
    public interface IMetadataHandler
    {
        ResponseData Get();
        ResponseData GetById(Guid id);
        ResponseData Create(MetadataModel model);
        ResponseData Update(Guid id, MetadataModel model);
        ResponseData Delete(Guid id);
    }
}
