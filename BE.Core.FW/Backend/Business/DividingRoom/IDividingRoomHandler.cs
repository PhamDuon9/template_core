using Backend.Infrastructure.Utils;
using Backend.Model;

namespace Backend.Business.DividingRoom
{
    public interface IDividingRoomHandler
    {

        /// <summary>
        /// Chia phòng thi và sinh số báo danh cho danh sách thi sinh
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        Task<ResponseData> DivideExamRoom(SelectionCriterialModel model, string? accessToken);

        /// <summary>
        /// Quản lý địa điểm đã được chia phòng
        /// </summary>
        /// <param name="model"></param>
        /// <param name="accessToken"></param>
        /// <returns></returns>
        Task<ResponseData> ManagementPlaceDividedExamRoom(SelectionCriterialModel model, string? accessToken, int pageIndex = 1, int pageSize = 10);

        /// <summary>
        /// Quản lý phòng thi theo địa điểm thi
        /// </summary>
        /// <param name="examPlaceId"></param>
        /// <returns></returns>
        Task<ResponseData> ManagementDividedExamRoom(Guid DividingExamPlaceId, Guid examPlaceId, int pageIndex = 1, int pageSize = 10, string? accessToken = "");

        /// <summary>
        /// Quản lý thí sinh theo kỳ thi và phòng thi
        /// </summary>
        /// <param name="DividingExamPlaceId"></param>
        /// <returns></returns>
        Task<ResponseData> ManagementDividedCandidate(Guid DividingExamPlaceId, Guid examRoomId, string? candidateName = "", string? candidatePhone = "", string? candidateEmail = "", int pageNumber = 1, int pageSize = 10, string? accessToken = "");

        /// <summary>
        /// Xuất file danh sách thí sinh
        /// </summary>
        /// <param name="DividingExamPlaceId"></param>
        /// <param name="examRoomId"></param>
        /// <param name="candidateName"></param>
        /// <param name="candidatePhone"></param>
        /// <param name="candidateEmail"></param>
        /// <returns></returns>
        Task<ResponseDataObject<List<ExamRoomDividedModel>>> ExportExcelManagementDividedCandidate(Guid DividingExamPlaceId, Guid examRoomId, string? candidateName = "", string? candidatePhone = "", string? candidateEmail = "", string? accessToken = "");

        /// <summary>
        /// Thực hiện xóa danh sách phòng thi và địa điểm thi
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        Task<ResponseData> DeleteManagementPlaceDividedExamRoom(Guid id, string? accessToken);


        /// <summary>
        /// Thực hiện check kỳ thi khi chọn địa điểm thi
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        Task<ResponseData> CheckExamScheduleTopik(SelectionCriterialModel model);

        /// <summary>
        /// Gửi email thông báo SBD và phòng thi cho cả địa điểm thi
        /// </summary>
        /// <param name="dividingExamPlaceId"></param>
        /// <returns></returns>
        Task<ResponseData> SendMailCandidates(Guid dividingExamPlaceId, string accessToken);

        /// <summary>
        /// Gửi email thông báo SBD và phòng thi cho 1 thí sinh
        /// </summary>
        /// <param name="examRoomDividedId"></param>
        /// <returns></returns>
        Task<ResponseData> SendMailCandidate(Guid examRoomDividedId, string accessToken);

        /// <summary>
        /// Tiến hành cập nhật số báo danh và chuyển phòng thi
        /// </summary>
        /// <param name="examRoomDividedId"></param>
        /// <param name="model"></param>
        /// <returns></returns>
        Task<ResponseData> UpdateCandidateNumberAndMoveCandidateRoom(Guid examRoomDividedId, ExamRoomDividedModel model, string? accessToken = "");

        /// <summary>
        /// Tiến hành lấy phòng thi trong địa điểm thi mà còn trống thí sinh
        /// </summary>
        /// <param name="ExamPlaceId"></param>
        /// <returns></returns>
        Task<ResponseData> CheckSlotRoom(Guid dividingExamPlaceId, string? accessToken = "");

        /// <summary>
        /// Tìm kiếm thí sinh
        /// </summary>
        /// <param name="DividingExamPlaceId"></param>
        /// <returns></returns>
        Task<ResponseData> SearchCandidate(Guid? ExamPeriodId, Guid? ExamScheduleTopikId, string? candidateName = "", string? candidatePhone = "", string? candidateEmail = "", int pageNumber = 1, int pageSize = 10, string? accessToken = "");

        /// <summary>
        /// Gửi email test thông báo SBD cho danh sách liên hệ tự tạo
        /// </summary>
        /// <param name="ids"></param>
        /// <returns></returns>
        Task<ResponseData> SendMailTestCandidates(Guid examRoomDividedId, IEnumerable<Guid> emails, string? accessToken = "");

    }
}
