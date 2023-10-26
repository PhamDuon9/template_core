using System.ComponentModel.DataAnnotations;
namespace Backend.Infrastructure.EntityFramework.Datatables
{
    /// <summary>
    /// Địa điểm thi đã được chia phòng
    /// </summary>
    public class SysDividingExamPlace : BaseTable<SysDividingExamPlace>
    {
        public Guid Id { get; set; }

        /// <summary>
        /// Kỳ thi(liên kết với bảng ExamScheduleTopiks)
        /// </summary>
        public Guid ExamScheduleTopikId { get; set; }
        public string ExamScheduleTopikName { get; set; }

        /// <summary>
        /// Khu vực thi(liên kết với bảng SysArea)
        /// </summary>
        public Guid ExamAreaId { get; set; }
        public string ExamAreaName { get; set; }

        /// <summary>
        /// Địa điểm thi(liên kết với bảng SysHeadQuarter)
        /// </summary>
        public Guid ExamPlaceId { get; set; }
        public string ExamPlaceName { get; set; }

        /// <summary>
        /// Lưu sức chứa thí sinh lớn nhất của địa điểm thi
        /// </summary>
        public int Capacity { get; set; }

        /// <summary>
        /// Trạng thái đã gửi mail thông báo phòng thi & SBD: (0: chưa gửi, 1 : đã gửi, 2:đang gửi)
        /// </summary>
        public int IsSendMail { get; set; }

        /// <summary>
        /// Sắp xếp danh sách theo tiêu chí nào(1: theo tên thí sinh tăng hay giảm || 2: theo ngày sinh của thí sinh tăng hay giảm || 3: theo ngày đăng ký của thí sinh tăng hay giảm)
        /// </summary>
        public int? TypeOrdering { get; set; }
    }
}
