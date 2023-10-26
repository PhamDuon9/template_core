using System.ComponentModel.DataAnnotations;

namespace Backend.Model
{
    public class UserInfoModel
    {
        public string? UserName { get; set; }
        public string? FullName { get; set; }
        public string? KoreanName { get; set; }
        public string? FullNameKorea { get; set; }
        public string? CCCD { get; set; }
        public string? IDNumber { get; set; }
        public string? TypeIdCard { get; set; }
        public string? IsKorean { get; set; }
        public string? Country { get; set; }
        public DateTime? DOB { get; set; }
        public string? DOBString { get; set; }
        public string? Sex { get; set; }
        public string? CMND { get; set; }
        public string? Passport { get; set; }
        public DateTime? DateOfCCCD { get; set; }
        public string? DateOfCCCDString { get; set; }
        public string? PlaceOfCCCD { get; set; }
        public string? OtherPapers { get; set; }
        public string? SDT { get; set; }
        public string? Email { get; set; }
        public string? Job { get; set; }
        public string? OptionJob { get; set; }
        public bool? IsHSSV { get; set; }
        public Guid? WorkAddressCityId { get; set; }
        public Guid? WorkAddressDistrictId { get; set; }
        public Guid? WorkAddressWardsId { get; set; }
        public string? WorkAddress { get; set; }
        public Guid? ContactAddressCityId { get; set; }
        public string? ContactAddressCityName { get; set; }
        public Guid? ContactAddressDistrictId { get; set; }
        public string? ContactAddressDistrictName { get; set; }
        public Guid? ContactAddressWardsId { get; set; }
        public string? ContactAddressWardsName { get; set; }
        public string? ContactAddress { get; set; }
        public string? FrontImgCCCD { get; set; }
        public IFormFile? FrontImgCCCDFile { get; set; }
        public IFormFile? BackImgCCCDFile { get; set; }
        public string? BackImgCCCD { get; set; }
        public IFormFile? IMG3X4File { get; set; }
        public string? IMG3X4 { get; set; }
        public string? StudentCardImage { get; set; }
        public IFormFile? StudentCardImageFile { get; set; }
        public string? SchoolCertificate { get; set; }
        public IFormFile? BirthCertificateFile { get; set; }
        public string? BirthCertificate { get; set; }
        public bool IsStudent { get; set; }
        public bool IsDisabilities { get; set; } = false;
        public string? CountryCode { get; set; }
        public string? LanguageCode { get; set; }
        public string? LanguageName { get; set; }

    }

    public class UserInfoITModel
    {
        public Guid Id { get; set; }
        public Guid CandidateRegisterId { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string FullNameOrigin { get; set; } = string.Empty;
        public string UserName { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public DateTime Birthday { get; set; }
        public string Sex { get; set; } = string.Empty;
        public string TypeIdCard { get; set; } = string.Empty;
        public string IDNumber { get; set; } = string.Empty;
        public string Job { get; set; } = string.Empty;
        public DateTime? DateOfCCCD { get; set; }
        public string? PlaceOfCCCD { get; set; }
        public string Email { get; set; } = string.Empty;
        public Guid ContactAddressCityId { get; set; }
        public Guid ContactAddressDistrictId { get; set; }
        public Guid ContactAddressWardId { get; set; }
        public string ContactAddress { get; set; } = string.Empty;
        public string Language { get; set; } = string.Empty;
        public string IDCardFront { get; set; } = string.Empty;
        public string IDCardBack { get; set; } = string.Empty;
        public string? StudentCardImage { get; set; }
        public string? BirthCertificate { get; set; }
        public string? SchoolCertificate { get; set; }
        public string Image3x4 { get; set; } = string.Empty;
        public Guid WorkAddressDistrictId { get; set; }
        public Guid WorkAddressWardsId { get; set; }
        public Guid WorkAddressCityId { get; set; }
        public string WorkAddress { get; set; } = string.Empty;
        public string? OldCardIDNumber { get; set; }
        public bool OldCardID { get; set; }
        public bool IsStudent { get; set; }
        public bool AllowUsePersonalData { get; set; }
        public string StudentCode { get; set; } = string.Empty;
    }

    public class B2CUserModel
    {
        public Guid Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string Fullname { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public List<B2CUserProfileModel> Profiles { get; set; } = new List<B2CUserProfileModel>();
    }

    public class B2CUserProfileModel
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public string Code { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public bool IsCurrentProfile { get; set; }
        public List<B2CUserProfileMetadataModel> Metadata { get; set; } = new List<B2CUserProfileMetadataModel>();
    }

    public class B2CUserProfileMetadataModel
    {
        public Guid Id { get; set; }
        public Guid UserProfileId { get; set; }
        public Guid MetadataId { get; set; }
        public string MetadataCode { get; set; } = string.Empty;
        public string MetadataName { get; set; } = string.Empty;
        public string Value { get; set; } = string.Empty;
        public int DataType { get; set; } // 0 - text; 1 - file
        public string TextValue { get; set; } = string.Empty;
        public IFormFile? FileValue { get; set; }
    }
}
