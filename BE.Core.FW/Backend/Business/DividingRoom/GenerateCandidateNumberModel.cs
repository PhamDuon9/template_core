namespace Backend.Business.DividingRoom
{
    public class GenerateCandidateNumberModel
    {
        /// <summary>
        /// Key
        /// </summary>
        public Guid Id { get; set; }

        /// <summary>
        /// Id của profile
        /// </summary>
        public Guid UserProfileId { get; set; }

        /// <summary>
        /// Tên thí sinh
        /// </summary>
        public string CandidateName { get; set; } = default!;

        /// <summary>
        /// Email của thí sinh
        /// </summary>
        public string CandidateEmail { get; set; } = default!;

        /// <summary>
        /// Số điện thoại thí sinh
        /// </summary>
        public string CandidatePhone { get; set; } = default!;

        /// <summary>
        /// ngày sinh
        /// </summary>
        public DateTime? CandidateBirthday { get; set; } = default!;

        /// <summary>
        /// Số báo danh của thí sinh
        /// </summary>
        public string CandidateNumber { get; set; } = default!;

        /// <summary>
        /// phòng thi
        /// </summary>
        public string ExamRoomId { get; set; } = default!;
    }
}
