namespace Backend.Business.DividingRoom
{
    public class DividingExamPlaceModel
    {
        public Guid Id { get; set; }

        /// <summary>
        /// Kỳ thi(liên kết với bảng ExamScheduleTopiks)
        /// </summary>
        public Guid ExamScheduleTopikId { get; set; }

        public string ExamScheduleTopikName { get; set; } = default!;

        /// <summary>
        /// Khu vực thi(liên kết với bảng SysArea)
        /// </summary>
        public Guid ExamAreaId { get; set; }

        public string ExamAreaName { get; set; } = default!;

        /// <summary>
        /// Địa điểm thi(liên kết với bảng SysHeadQuarter)
        /// </summary>
        public Guid ExamPlaceId { get; set; }

        public string ExamPlaceName { get; set; } = default!;

        /// <summary>
        /// Lưu sức chứa thí sinh lớn nhất của địa điểm thi
        /// </summary>
        public int Capacity { get; set; }

        /// <summary>
        /// Số lượng đã đăng ký vào
        /// </summary>
        public int ActualQuantity { get; set; }

        /// <summary>
        /// Trạng thái đã gửi mail thông báo phòng thi & SBD chưa(0:chưa gửi,1: đã gửi, 2: chưa gửi)
        /// </summary>
        public int IsSendMail { get; set; }

        public DateTime CreatedOnDate { get; set; }

        /// <summary>
        /// Ngôn ngữ thí sinh chọn để đăng ký TOPIK - dùng để gửi mail thông báo SBD về đúng ngôn ngữ thí sinh đã đăng ký
        /// </summary>
        public string LanguageSendMail { get; set; }


        /// <summary>
        /// Cho phép thực hiện không(dùng để ẩn thao tác khi kỳ thi đã kết thúc rồi)
        /// </summary>
        public bool IsDisable { get; set; }

        /// <summary>
        /// Sắp xếp danh sách theo tiêu chí nào(1: theo tên thí sinh tăng hay giảm || 2: theo ngày sinh của thí sinh tăng hay giảm || 3: theo ngày đăng ký của thí sinh tăng hay giảm)
        /// </summary>
        public int? TypeOrdering { get; set; }
    }
}
