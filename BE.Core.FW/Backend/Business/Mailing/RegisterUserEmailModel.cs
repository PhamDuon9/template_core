namespace Backend.Business.Mailing
{
    public class RegisterUserEmailModel
    {
        public string UserName { get; set; } = default!;
        public string ToEmail { get; set; } = default!;
        public List<IFormFile>? Attachments { get; set; }
        public Guid Id { get; set; }
        public string? LanguageSendMail { get; set; }
    }

    public class EmailGenerateTemplateModel
    {
        public Guid? SysExamRoomDivided { get; set; }
        public Guid? ExamRoomId { get; set; }
        public Guid? ExamPlaceId { get; set; }
        public Guid? ExamAreaId { get; set; }
        public Guid? ExamId { get; set; }
        public string LanguageSendMail { get; set; }
        public string TitleFullNameVietnamese { get; set; } = default!;
        public string TitleFullNameKorea { get; set; } = default!;
        public string TitleBirthday { get; set; } = default!;
        public string TitleCandidateNumber { get; set; } = default!;
        public string TitleExamName { get; set; } = default!;
        public string TitleAreaName { get; set; } = default!;
        public string TitlePlaceName { get; set; } = default!;
        public string TitleAddressPlaceName { get; set; } = default!;
        public string TitleCandidateRoom { get; set; } = default!;
        public string TitleExamDate { get; set; } = default!;
        public string TitleTimeEndsToEnterExamRoom { get; set; } = default!;
        public string TitleExamTime { get; set; } = default!;

        /// <summary>
        /// Tên tiếng việt
        /// </summary>
        public string FullNameVietnamese { get; set; } = default!;

        /// <summary>
        /// Tên tiếng hàn
        /// </summary>
        public string FullNameKorea { get; set; } = default!;

        /// <summary>
        /// ngày sinh
        /// </summary>
        public string Birthday { get; set; } = default!;

        /// <summary>
        /// số báo danh
        /// </summary>
        public string CandidateNumber { get; set; } = default!;

        /// <summary>
        /// tên bài thi
        /// </summary>
        public string ExamName { get; set; } = default!;

        /// <summary>
        /// tên khu vực thi
        /// </summary>
        public string AreaName { get; set; } = default!;

        /// <summary>
        /// tên địa điểm thi
        /// </summary>
        public string PlaceName { get; set; } = default!;

        /// <summary>
        /// địa chỉ của địa điểm thi
        /// </summary>
        public string AddressPlaceName { get; set; } = default!;

        /// <summary>
        /// phòng thi
        /// </summary>
        public string CandidateRoom { get; set; } = default!;

        /// <summary>
        /// ngày thi
        /// </summary>
        public string ExamDate { get; set; } = default!;

        /// <summary>
        /// thời gian kết thúc vào phòng thi
        /// </summary>
        public string TimeEndsToEnterExamRoom { get; set; } = default!;

        /// <summary>
        /// thời gian thi
        /// </summary>
        public string ExamTime { get; set; } = default!;
        public string UrlImage { get; set; }
        public string ToEmail { get; set; } = default!;
        public List<IFormFile>? Attachments { get; set; }
        public string TitleMailSBD { get; set; }
        public string GreetingMailSBD { get; set; }
        public string TextLinkMailSBD { get; set; }
        public string ContentMailSBD1 { get; set; }
        public string ContentMailSBD2 { get; set; }
        public string ContentMailSBD3 { get; set; }
        public string ContentMailSBD4 { get; set; }
        public string ContentMailSBD5 { get; set; }
        public string ContentMailSBD6 { get; set; }
        public string ContentMailSBD7 { get; set; }
        public string ContentMailSBD8 { get; set; }
        public string ContentMailSBD9 { get; set; }
        public string ContentMailSBD10 { get; set; }
        public string ContentMailSBD11 { get; set; }
        public string ContentMailSBD12 { get; set; }
    }

    public class EmailRequest
    {
        public string ToAddress { get; set; } = string.Empty;
        public List<string>? ToEmail { get; set; }
        public string? Subject { get; set; }
        public string? Body { get; set; }

        public string? HTMLBody { get; set; }
        public List<IFormFile>? Attachments { get; set; }
    }

    public class EmailSettings
    {
        public string Mail { get; set; }
        public string DisplayName { get; set; }
        public string Password { get; set; }
        public string Host { get; set; }
        public int Port { get; set; }
    }


    public class EmailTestDateWrongModel
    {
        public string FullNameKorea { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string Birthday { get; set; } = string.Empty;
        public string PlaceTest { get; set; } = string.Empty;
        public string AreaTest { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string DateTimePaid { get; set; } = string.Empty;
        public string Trans { get; set; } = string.Empty;
    }


    public class EmailTestApModel
    {
        public string FullName { get; set; } = string.Empty;
        public string Birthday { get; set; } = string.Empty;
        public string TestInfo { get; set; } = string.Empty;
        public string DateTimePaid { get; set; } = string.Empty;
        public string Trans { get; set; } = string.Empty;
    }

    public class EmailConfirmITModel
    {
        public string ExamName { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string Birthday { get; set; } = string.Empty;
        public string TestInfo { get; set; } = string.Empty;
        public string DateTimePaid { get; set; } = string.Empty;
        public string Trans { get; set; } = string.Empty;
    }
}
