using System.ComponentModel.DataAnnotations;
using static Backend.Infrastructure.Utils.Constant;

namespace Backend.Model
{
    /// <summary>
    /// Tiêu chí lựa chọn để chia phòng và sinh số báo danh
    /// </summary>
    public class SelectionCriterialModel
    {

        /// <summary>
        /// Sắp xếp danh sách theo tiêu chí nào(1: theo tên thí sinh || 2: theo ngày sinh của thí sinh || 3: theo ngày đăng ký của thí sinh)
        /// </summary>
        public int TypeOrdering { get; set; }

        /// <summary>
        /// Lịch thi(liên kết với bảng ExamScheduleTopiks)
        /// </summary>
        public Guid ExamScheduleTopikId { get; set; }

        /// <summary>
        /// Kỳ thi(liên kết với bảng ExamPeriod)
        /// </summary>
        public Guid ExamPeriodId { get; set; }

        /// <summary>
        /// Khu vực thi(liên kết với bảng SysArea)
        /// </summary>
        public Guid ExamAreaId { get; set; }

        /// <summary>
        /// Địa điểm thi(liên kết với bảng SysHeadQuarter)
        /// </summary>
        public Guid ExamPlaceId { get; set; }

        /// <summary>
        /// Trạng thái gửi mail
        /// </summary>
        public int IsSendMail { get; set; }
    }
}
