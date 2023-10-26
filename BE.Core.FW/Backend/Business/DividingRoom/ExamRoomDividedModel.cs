namespace Backend.Business.DividingRoom
{
    public class ExamRoomDividedModel
    {
        public Guid Id { get; set; }

        /// <summary>
        /// Địa điểm thi đã được chia phòng(liên kết với bảng DividingExamPlaces)
        /// </summary>
        public Guid DividingExamPlaceId { get; set; }

        /// <summary>
        /// Phòng thi(Liên kết với bảng ExamRoom)
        /// </summary>
        public Guid ExamRoomId { get; set; }

        /// <summary>
        /// Tên phòng thi
        /// </summary>
        public string? ExamRoomName { get; set; }

        /// <summary>
        /// Sức chứa thí sinh tối đa của phòng
        /// </summary>
        public int Capacity { get; set; }

        /// <summary>
        /// Số lượng thực tế được chia vào
        /// </summary>
        public int ActualQuantity { get; set; }

        /// <summary>
        /// Tên địa điểm thi
        /// </summary>
        public string? ExamPlaceName { get; set; }

        /// <summary>
        /// Tên khu vực thi
        /// </summary>
        public string? ExamAreaName { get; set; }

        /// <summary>
        /// Tên lịch thi
        /// </summary>
        public string? ExamScheduleTopikName { get; set; }

        /// <summary>
        /// Tên bài thi
        /// </summary>
        public string? ExamName { get; set; }

        public Guid ExamId { get; set; }

        /// <summary>
        /// Tên thí sinh tiếng Anh
        /// </summary>
        public string? CandidateName { get; set; }

        /// <summary>
        /// Tên thí sinh tiếng Hàn
        /// </summary>
        public string? CandidateKoreaName { get; set; }

        /// <summary>
        /// Email của thí sinh
        /// </summary>
        public string? CandidateEmail { get; set; }

        /// <summary>
        /// Số điện thoại thí sinh
        /// </summary>
        public string? CandidatePhone { get; set; }

        /// <summary>
        /// ngày sinh
        /// </summary>
        public DateTime? CandidateBirthday { get; set; } = default!;
        public string? CandidateBirthdayFormat { get; set; }
        public string? LanguageSendMail { get; set; }

        /// <summary>
        /// Số báo danh của thí sinh
        /// </summary>
        public string? CandidateNumber { get; set; } = default!;

        /// <summary>
        /// Id của profile
        /// </summary>
        public Guid UserProfileId { get; set; }

        /// <summary>
        /// Trạng thái đã gửi mail thông báo phòng thi và SBD(0: chưa gửi,1: đã gửi, 2: đang gửi)
        /// </summary>
        public int IsSendMail { get; set; }

        /// <summary>
        /// Giới tính: Nam (1) , Nữ (2)
        /// </summary>
        public int CandidateGender { get; set; }

        public string? CandidateImageStr { get; set; }

        public MemoryStream? CandidateImage { get; set; }
        public int? TT { get; set; }

        public uint? Order { get; set; }

        /// <summary>
        /// Cho phép thực hiện không(dùng để ẩn thao tác khi kỳ thi đã kết thúc rồi)
        /// </summary>
        public bool? IsDisable { get; set; }


    }
}
