using Newtonsoft.Json;
using System;

namespace Shared.Core.Utils
{
    public class Constant
    {
        public const string USER_SESSION = "Session";
        public const string PASSWORD_DEFAULT = "123456@Ab";
        public static JsonSerializerSettings SETTING = new JsonSerializerSettings
        {
            NullValueHandling = NullValueHandling.Ignore,
            MissingMemberHandling = MissingMemberHandling.Ignore
        };

        public const int STATUS_OK = 1;
        public const int STATUS_NOTOK = 0;

        public const int STATUS_ACTIVE = 1;
        public const int STATUS_DEACTIVE = 0;

        public const int SUCCESS = 1;
        public const int ERROR = -1;
        public const int NODATA = 0;
        public const int DATA_IS_EXIST = 2;
        public const bool BOOL_SUCCESS = true;
        public const bool BOOL_ERROR = false;

        public const int StatusModifiedEnable = 1;
        public const int StatusModifiedDisable = 0;
        public const int StatusLock = 0;
        public const int StatusUnLock = 1;
        public const int StatusEnable = 1;
        public const int StatusDisable = 0;
        public const int StatusCommentEnable = 1;
        public const int StatusCommentDisable = 0;

        public const int DEFAULT_PAGE_SIZE = 20;

        public class HttpServiceUrl
        {
            public const string BASE_HTTP_SERVICE_URL = "BaseHttpServiceUrl";
            public const string THONG_TIN_NHAN_SU_HTTP_SERVICE_URL = "ThongTinNhanSuHttpServiceUrl";
            public const string QUAN_TRI_DANH_MUC_HTTP_SERVICE_URL = "QuanTriDanhMucHttpServiceUrl";
            public const string REPORT_HTTP_SERVICE_URL = "ReportHttpServiceUrl";
            public const string ATTENDANCE_HTTP_SERVICE_URL = "AttendanceHttpServiceUrl";
            public const string LEAVE_MANAGEMENT_HTTP_SERVICE_URL = "LeaveManagementHttpServiceUrl";
            public const string TRAINING_HTTP_SERVICE_URL = "TrainingHttpServiceUrl";
        }

        public class DateTimeFormat
        {
            public const string DDMMYYYY = "dd/MM/yyyy";
        }

        public class RequestHeader
        {
            public const string AUTHORIZATION = "Authorization";
            public const string BEARER = "Bearer ";
            public const string OPERATING_SYSTEM = "operating-system";
            public const string GEO_LOCATION = "geo-location";
            public const string USER_AGENT = "User-Agent";
        }

        public class ConnectionString
        {
            public const string SYSTEM_CONNECTION_STRING = "Databases:MSSQL:ConnectionStrings:SystemConnectionString";
        }

        public class ExcelFileFormat
        {
            public const string XLS = ".xls";
            public const string XLSX = ".xlsx";
        }

        public class Licenses
        {
            public const int CMND = 1;
            public const int VISA = 2;
            public const int HOCHIEU = 3;
            public const int GPLD = 4;
            public const int CCHN = 5;
        }

        public class HttpStatusCode
        {
            public const int UN_AUTHORIZED = 401;
            public const int BAD_REQUEST = 400;
            public const int SUCCESS = 200;
            public const int CREATED = 201;
            public const int FORBIDDEN = 403;
            public const int NOTFOUND = 404;
            public const int METHODNOTALLOWED = 405;
            public const int CONFLICT = 409;
            public const int SERVERERROR = 500;
        }

        public class OrderBy
        {
            public const string DESCENDING = "DESC";
            public const string ASCENDING = "ASC";
        }

        public class LogAction
        {
            public const string LOGIN = "Login";
            public const string LOGOUT = "Logout";
            public const string ADD = "Add";
            public const string UPDATE = "Update";
            public const string DELETE = "Delete";
            public const string SEARCH = "Search";
            public const string IMPORT = "Import";
            public const string EXPORT = "Export";
        }

        public class ErrorCode
        {
            #region: Mã lỗi
            /// <summary>
            /// Thành công
            /// </summary>
            public const int SUCCESS_CODE = 1;
            /// <summary>
            /// Không tìm thấy bản ghi
            /// </summary>
            public const int NOTFOUND_CODE = 0;
            /// <summary>
            /// Bản ghi đang được sử dụng, không xóa được
            /// </summary>
            public const int NOTDEL_CASE_1_CODE = 1002;
            /// <summary>
            /// Bản ghi chứa bản ghi con, không xóa được
            /// </summary>
            public const int NOTDEL_CASE_2_CODE = 1003;
            /// <summary>
            /// Lỗi hệ thống
            /// </summary>
            public const int ERRORSYSTEM_CODE = 1004;

            /// <summary>
            /// Dữ liệu bị trùng mã
            /// </summary>
            public const int DUPPLICATE_CODE = 1006;

            /// <summary>
            /// Dữ liệu bị trùng tên
            /// </summary>
            public const int DUPPLICATE_NAME = 1007;

            /// <summary>
            /// Email đã tồn tại
            /// </summary>
            public const int DUPPLICATE_EMAIL = 1008;

            /// <summary>
            /// Thất bại
            /// </summary>
            public const int FAIL_CODE = -1;

            /// <summary>
            /// Delete thất bại, bản ghi đã được sử dụng
            /// </summary>
            public const int DELETE_FAIL_CODE = -2;
            /// <summary>
            /// Ngày bắt đầu công tác mới phải lớn hơn ngày hết hạn của quá trình công tác cũ
            /// </summary>
            public const int FAIL_CODE_HISTORY = 2;

            #endregion

            #region: Message lỗi
            /// <summary>
            /// Thành công
            /// </summary>
            public const string SUCCESS_MESS = "Thành công";
            /// <summary>
            /// Không tìm thấy bản ghi
            /// </summary>
            public const string NOTFOUND_MESS = "Không tìm thấy bản ghi";
            /// <summary>
            /// Bản ghi đang được sử dụng, không xóa được
            /// </summary>
            public const string NOTDEL_CASE_1_MESS = "Bản ghi đang được sử dụng, không xóa được";
            /// <summary>
            /// Bản ghi chứa bản ghi con, không xóa được
            /// </summary>
            public const string NOTDEL_CASE_2_MESS = "Bản ghi chứa bản ghi con, không xóa được";
            /// <summary>
            /// Lỗi hệ thống
            /// </summary>
            public const string ERRORSYSTEM_MESS = "Lỗi hệ thống";
            /// <summary>
            /// Dữ liệu bị trùng tên
            /// </summary>
            public const string DUPPLICATENAME_MESS = "Dữ liệu bị trùng tên";

            /// <summary>
            /// Mã {0} đã tồn tại trên hệ thống
            /// </summary>
            public const string DUPPLICATE_CODE_MESS = "Mã {0} đã tồn tại trên hệ thống";

            /// <summary>
            /// Thất bại
            /// </summary>
            public const string FAIL_MESS = "Thất bại";
            /// <summary>
            /// Ngày bắt đầu công tác mới phải lớn hơn ngày hết hạn của quá trình công tác cũ
            /// </summary>
            public const string FAIL_MESS_HISTORY = "Ngày bắt đầu công tác mới phải lớn hơn ngày hết hạn của quá trình công tác cũ";

            /// <summary>
            /// Quá trình lương
            /// </summary>
            public const string DUPLICATE_STAFF_SALARY = "Quá trình lương trước đó đang là nâng lương trước hạn";

            /// <summary>
            /// Custom error message
            /// </summary>
            public const string CUSTOM_ERROR_MESSAGE = "{0}";
            #endregion
        }

        #region Trạng thái bản ghi
        public class StatusRecord
        {
            public const int ACTIVE = 1;
            public const int INACTIVE = 0;
            public const int DELETED = -1;
        }
        #endregion

        #region Trạng thái của quá trình công tác(History)
        public class HistoryStatusConstant
        {
            public const string THU_VIEC = "Thử việc";
            public const string DAO_TAO_TAP_NGHE = "Đào tạo và Tập nghề";
            public const string CHINH_THUC = "Chính thức";
            public const string DIEU_DONG = "Điều động tăng cường";

            public const int NUM_THU_VIEC = 1;
            public const int NUM_DAO_TAO_TAP_NGHE = 2;
            public const int NUM_CHINH_THUC = 3;
            public const int NUM_DIEU_DONG = 4;
        }
        #endregion

        #region Dapper

        public class TableInfo
        {
            public class Title
            {
                public const string TABLE_NAME = "Title";
                public const string FIELD_NAME = "TitleName";
            }

            public class Category
            {
                public const string TABLE_NAME = "Category";
                public const string FIELD_NAME = "CategoryName";
            }

            public class JobTitle
            {
                public const string TABLE_NAME = "JobTitle";
                public const string FIELD_NAME = "JobTitleName";
            }

            public class Staff
            {
                public const string TABLE_NAME = "Staff";
                public const string FIELD_NAME = "StaffName";
                public const string FIELD_NAME_SEARCH = "FullName";
            }

            public class WorkGroup
            {
                public const string TABLE_NAME = "WorkGroup";
                public const string FIELD_NAME = "WorkGroupName";
            }

            public class Qualification
            {
                public const string TABLE_NAME = "Qualification";
                public const string FIELD_NAME = "QualificationName";
            }

            public class Degree
            {
                public const string TABLE_NAME = "Degree";
                public const string FIELD_NAME = "DegreeName";
            }

            public class AcademicRank
            {
                public const string TABLE_NAME = "AcademicRank";
                public const string FIELD_NAME = "AcademicRankName";
            }

            public class StaffGroup
            {
                public const string TABLE_NAME = "StaffGroup";
                public const string FIELD_NAME = "StaffGroupName";
            }

            public class Position
            {
                public const string TABLE_NAME = "Position";
                public const string FIELD_NAME = "PositionName";
            }

            public class UniformItem
            {
                public const string TABLE_NAME = "UniformItem";
                public const string FIELD_NAME = "UniformItemName";
            }

            public class Currency
            {
                public const string TABLE_NAME = "Currency";
                public const string FIELD_NAME = "CurrencyName";
            }

            public class NhomNgachLuong
            {
                public const string TABLE_NAME = "NhomNgachLuong";
                public const string FIELD_NAME = "TenNhomNgachLuong";
            }

            public class NgachLuong
            {
                public const string TABLE_NAME = "NgachLuong";
                public const string FIELD_NAME = "NhomNgachLuongID";
            }

            public class BacLuong
            {
                public const string TABLE_NAME = "BacLuong";
                public const string FIELD_NAME = "NgachLuongID";
                public const string FIELD_NAME_HSL = "HeSoLuong";
            }

            public class History
            {
                public const string TABLE_NAME = "History";
            }
            public class StaffSalary
            {
                public const string TABLE_NAME = "StaffSalary";
            }
            public class ChucVuChinhQuyen
            {
                public const string TABLE_NAME = "ChucVuChinhQuyen";
                public const string FIELD_NAME = "ChucVuChinhQuyenID";
            }
            public class ChucVuKiemNhiem
            {
                public const string TABLE_NAME = "ChucVuKiemNhiem";
                public const string FIELD_NAME = "ChucVuKiemNhiemID";
            }
        }

        #endregion

        #region File Type

        public class FileType
        {
            public const int THONG_TIN_CHUNG = 0;
            public const int QUA_TRINH_CONG_TAC = 1;//quá trình công tác
            public const int QUA_TRINH_LUONG = 2;//quá trình lương
            public const int BANG_CAP_CHUNG_CHI = 3;//bằng cấp chứng chỉ
            public const int HOP_DONG_LAO_DONG = 4;//hợp đồng lao động
            public const int AVATAR_IMG = 30;
            public const int GIA_DINH = 5;//thông tin gia đình
            public const int THONG_TIN_DANG = 6;//Thông tin đảng
            public const int THONG_TIN_QUAN_NGU = 7;//Thông tin quân ngũ
            public const int KY_LUAT = 8;//Kỷ luật
            public const int QUYET_DINH = 9;//Quyết định
            public const int QUAN_LY_SUC_KHOE = 10;//Quản lý sức khỏe
            public const int KHEN_THUONG = 11;//Quản lý khen thưởng
            public const int TRANG_BI_BAO_HO = 31;//Trang bị bảo hộ
            public const int DONG_PHUC_NHAN_VIEN = 32;//Đồng phục nhân viên
            public const int HO_SO = 12;//Đồng phục nhân viên
            public const int VALID_DOCUMENTS = 13;//Chứng minh nhân dân || Visa || hộ chiếu || giấy phép lao động || chứng chỉ hành nghề
            public const int QUAN_LY_DAO_TAO = 14;//File của QUẢN LÝ ĐÀO TẠO
        }

        #endregion

        #region Import Excel

        public class StaffTab
        {
            public const string TAB_THONG_TIN_CHUNG = "ThongTinChung";
            public const string TAB_BANG_CAP_CHUNG_CHI = "BangCapChungChi";
            public const string TAB_QUAN_HE_GIA_DINH = "QuanHeGiaDinh";
            public const string TAB_HOP_DONG_LAO_DONG = "HopDongLaoDong";
            public const string TAB_KHEN_THUONG = "KhenThuong";
            public const string TAB_KY_LUAT = "KyLuat";
            public const string TAB_QUA_TRINH_CONG_TAC = "QuaTrinhCongTac";
            public const string TAB_QUA_TRINH_LUONG = "QuaTrinhLuong";
            public const string TAB_QUYET_DINH = "QuyetDinh";
            public const string TAB_SUC_KHOE = "SucKhoe";
            public const string TAB_THONG_TIN_DANG = "ThongTinDang";
            public const string TAB_THONG_TIN_KHAC = "ThongTinKhac";
        }

        #endregion

        public class GioiTinh
        {
            public const string NU = "Nữ";
            public const string NAM = "Nam";
            public const string KHAC = "Khác";

            public const int NUM_NU = 0;
            public const int NUM_NAM = 1;
            public const int NUM_KHAC = 2;
        }

        public class TinhTrangHonNhan
        {
            public const string CHUA_XAC_DINH = "Chưa xác định";
            public const string DOC_THAN = "Độc thân";
            public const string DA_KET_HON = "Đã kết hôn";
            public const string VO_CHONG_CUNG_CO_QUAN = "Vợ/Chồng cùng bệnh viện";

            public const int NUM_CHUA_XAC_DINH = 0;
            public const int NUM_DOC_THAN = 1;
            public const int NUM_DA_KET_HON = 2;
            public const int NUM_VO_CHONG_CUNG_CO_QUAN = 3;
        }

        public class LyDoNghiViec
        {
            public const string NGHI_HUU = "Nghỉ hưu";
            public const string TU_VONG = "Tử vong";
            public const string THOI_VIEC = "Thôi việc";

            public const int NUM_NGHI_HUU = 0;
            public const int NUM_TU_VONG = 1;
            public const int NUM_THOI_VIEC = 2;
        }

        public class TrinhDoVanHoa
        {
            public const string TRINH_DO_9_9 = "9/9";
            public const string TRINH_DO_10_10 = "10/10";
            public const string TRINH_DO_12_12 = "12/12";

            public const int NUM_TRINH_DO_9_9 = 0;
            public const int NUM_TRINH_DO_10_10 = 1;
            public const int NUM_TRINH_DO_12_12 = 2;
        }

        public class DoiTuongLaoDong
        {
            public const string VIEN_CHUC = "Viên chức";
            public const string HOP_DONG_68 = "Hợp đồng 68";
            public const string HOP_DONG_KHONG_XAC_DINH_THOI_HAN = "Hợp đồng không xác định thời hạn";
            public const string HOP_DONG_NGAN_HAN = "Hợp đồng ngắn hạn";
            public const string HOP_DONG_THU_VIEC = "Hợp đồng thử việc";
            public const string HOP_DONG_CHUYEN_GIA = "Hợp đồng chuyên gia";
            public const string HOP_DONG_THOI_VU = "Hợp đồng thời vụ";
            public const string HOP_DONG_KHAC = "Hợp đồng khác";

            public const int NUM_VIEN_CHUC = 0;
            public const int NUM_HOP_DONG_68 = 1;
            public const int NUM_HOP_DONG_KHONG_XAC_DINH_THOI_HAN = 2;
            public const int NUM_HOP_DONG_NGAN_HAN = 3;
            public const int NUM_HOP_DONG_THU_VIEC = 4;
            public const int NUM_HOP_DONG_CHUYEN_GIA = 5;
            public const int NUM_HOP_DONG_THOI_VU = 6;
            public const int NUM_HOP_DONG_KHAC = 7;
        }

        public class HinhThucLuong
        {
            public const string LUONG_THEO_THOI_GIAN = "Lương theo thời gian";
            public const string LUONG_THEO_SAN_PHAM = "Lương theo sản phẩm";
            public const string LUONG_KHOAN = "Lương khoán";

            public const int NUM_LUONG_THEO_THOI_GIAN = 0;
            public const int NUM_LUONG_THEO_SAN_PHAM = 1;
            public const int NUM_LUONG_KHOAN = 2;
        }

        public class TrangThaiQuaTrinhCongTac
        {
            public const string THU_VIEC = "Thử việc";
            public const string DAO_TAO_VA_TAP_NGHE = "Đào tạo và tập nghề";
            public const string CHINH_THUC = "Chính thức";
            public const string DIEU_DONG_TANG_CUONG = "Điều động tăng cường";

            public const int NUM_THU_VIEC = 1;
            public const int NUM_DAO_TAO_VA_TAP_NGHE = 2;
            public const int NUM_CHINH_THUC = 3;
            public const int NUM_DIEU_DONG_TANG_CUONG = 4;
        }

        public class LyLuanChinhTri_ThongTinDang
        {
            public const string SO_CAP = "Sơ cấp";
            public const string TRUNG_CAP = "Trung cấp";
            public const string CAO_CAP = "Cao cấp";
            public const string CU_NHAN = "Cử nhân";
        }

        public class LoaiQuaTrinhCongTac
        {
            public const bool QTCT_TRUOC_KHI_VAO_DON_VI = false;
            public const bool QTCT_TAI_DON_VI = true;
        }

        public class LoaiKhenThuong
        {
            public const string KHEN_THUONG_CA_NHAN = "Khen thưởng cá nhân";
            public const string KHEN_THUONG_TAP_THE = "Khen thưởng tập thể";

            public const int NUM_KHEN_THUONG_CA_NHAN = 1;
            public const int NUM_KHEN_THUONG_TAP_THE = 2;
        }

        public class NhomMau
        {
            public const string A = "A";
            public const string B = "B";
            public const string O = "O";
            public const string AB = "AB";
        }

        public class XepLoaiSucKhoe
        {
            public const string LOAI_1 = "Loại 1";
            public const string LOAI_2 = "Loại 2";
            public const string LOAI_3 = "Loại 3";
            public const string LOAI_4 = "Loại 4";
            public const string LOAI_5 = "Loại 5";

            public const int NUM_LOAI_1 = 1;
            public const int NUM_LOAI_2 = 2;
            public const int NUM_LOAI_3 = 3;
            public const int NUM_LOAI_4 = 4;
            public const int NUM_LOAI_5 = 5;
        }

        public class HangThuongBinh
        {
            public const string HANG_1_4 = "Hạng 1/4";
            public const string HANG_2_4 = "Hạng 2/4";
            public const string HANG_3_4 = "Hạng 3/4";
            public const string HANG_4_4 = "Hạng 4/4";

            public const int NUM_HANG_1_4 = 1;
            public const int NUM_HANG_2_4 = 2;
            public const int NUM_HANG_3_4 = 3;
            public const int NUM_HANG_4_4 = 4;
        }

        public class GiaDinhChinhSach
        {
            public const string CON_THUONG_BINH = "Con thương binh";
            public const string CON_LIET_SI = "Con liệt sĩ";
            public const string NGUOI_NHIEM_CHAT_DOC_DA_CAM = "Người nhiễm chất độc da cam Dioxin";

            public const int NUM_CON_THUONG_BINH = 1;
            public const int NUM_CON_LIET_SI = 2;
            public const int NUM_NGUOI_NHIEM_CHAT_DOC_DA_CAM = 3;
        }

        public class LoaiNangLuong
        {
            public const string NANG_LUONG_THUONG_XUYEN = "Nâng lương thường xuyên";
            public const string NANG_LUONG_TRUOC_THOI_HAN = "Nâng lương trước hạn";
            public const string KEO_DAI_THOI_HAN_NANG_LUONG = "Kéo dài thời hạn nâng lương";

            public const int NUM_NANG_LUONG_THUONG_XUYEN = 1;
            public const int NUM_NANG_LUONG_TRUOC_THOI_HAN = 2;
            public const int NUM_KEO_DAI_THOI_HAN_NANG_LUONG = 3;
        }
        public class NangLuongTruocThoiHan
        {
            public const string MONTH_4 = "4 tháng";
            public const string MONTH_6 = "6 tháng";
            public const string MONTH_8 = "8 tháng";
            public const string MONTH_12 = "12 tháng";

            public const int NUM_MONTH_4 = 4;
            public const int NUM_MONTH_6 = 6;
            public const int NUM_MONTH_8 = 8;
            public const int NUM_MONTH_12 = 12;
        }

        public class Role
        {
            #region Danh sách role trên HRM
            public const string HSNV_MANAGER = "HSNV";//Hồ sơ nhân viên
            public const string HSNV_QTCT_MANAGER = "HSNV_QTCT";//Quá trình công tác
            public const string HSNV_QTL_MANAGER = "HSNV_QTL";//Quá trình lương
            public const string HSNV_BCCC_MANAGER = "HSNV_BCCC";//Bắng cấp chứng chỉ
            public const string HSNV_HDLD_MANAGER = "HSNV_HDLD";//Hợp đồng lao động
            public const string HSNV_GD_MANAGER = "HSNV_GD";//Gia đình
            public const string HSNV_SK_MANAGER = "HSNV_SK";//Sức khỏe
            public const string HSNV_TTD_MANAGER = "HSNV_TTD";//Thông tin đảng
            public const string HSNV_QD_MANAGER = "HSNV_QD";//Quyết định
            public const string HSNV_KT_MANAGER = "HSNV_KT";//Khen thưởng
            public const string HSNV_KL_MANAGER = "HSNV_KL";//Kỷ luật
            public const string HSNV_HS_MANAGER = "HSNV_HS";//Hố sơ
            public const string HSNV_GTCTH_MANAGER = "HSNV_GTCTH";//Giấy tờ có thời hạn
            public const string HSNV_DG_MANAGER = "HSNV_DG";//Đánh giá

            public const string SK_MANAGER = "SK";//Sức khỏe
            public const string QD_MANAGER = "QD";//Quyết định
            public const string KT_MANAGER = "KT";//Khen thưởng
            public const string KL_MANAGER = "KL"; //Kỷ luật
            public const string TBBHLD_MANAGER = "TBBHLD"; //Trang bị bảo hộ lao động
            public const string DPNV_MANAGER = "DPNV"; //Đồng phục nhân viên
            public const string TIME_KEEPING = "TIME_KEEPING"; //Đồng phục nhân viên
            #endregion
        }

        public class Right
        {
            public const string CREATE = "CREATE";
            public const string UPDATE = "UPDATE";
            public const string UPDATE_TTC = "UPDATE_TTC";
            public const string UPDATE_TTCV = "UPDATE_TTCV";
            public const string UPDATE_TTLH = "UPDATE_TTLH";
            public const string UPDATE_TTK = "UPDATE_TTK";
            public const string VIEW_TTC = "VIEW_TTC";
            public const string VIEW_TTCV = "VIEW_TTCV";
            public const string VIEW_TTK = "VIEW_TTK";
            public const string VIEW_TTLH = "VIEW_TTLH";

            public const string DELETE = "DELETE";
            public const string VIEW = "VIEW";
            public const string IMPORT = "IMPORT";
            public const string EXPORT = "EXPORT";
            public const string CONFIRM = "CONFIRM";
        }

        public class LeaveGroup
        {
            public const int NGHI_THEO_GIO = 1;
            public const int NGHI_THEO_NGAY = 2;
        }
        public class LeaveType
        {
            public const int NGHI_NUA_CA_DAU = 1;
            public const int NGHI_NUA_CA_SAU = 2;
        }
    }
}
