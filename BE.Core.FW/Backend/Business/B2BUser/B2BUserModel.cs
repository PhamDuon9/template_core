
namespace Backend.Business.B2BUser
{
    public class B2BUserModel
    {
        public Guid Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string Fullname { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public DateTime DOB { get; set; }
        public string Phone { get; set; } = string.Empty;
        public List<B2BUserMetadataModel> Metadata { get; set; } = new List<B2BUserMetadataModel>();
    }

    public class B2BUserMetadataModel
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public Guid MetadataId { get; set; }
        public string MetadataCode { get; set; } = string.Empty;
        public string MetadataName { get; set; } = string.Empty;
        public string Value { get; set; } = string.Empty;
    }
}
