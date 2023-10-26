using DocumentFormat.OpenXml.Bibliography;
using DocumentFormat.OpenXml.Drawing.Charts;
using DocumentFormat.OpenXml.Drawing.Diagrams;
using DocumentFormat.OpenXml.Office2016.Drawing.ChartDrawing;
using DocumentFormat.OpenXml.Office2019.Presentation;
using DocumentFormat.OpenXml.Spreadsheet;
using Microsoft.AspNetCore.Identity;
//using Microsoft.Office.Core;
using Minio.DataModel.Replication;
using static Backend.Infrastructure.Middleware.CustomAuthenticationHandler;
using static Backend.Infrastructure.Utils.Constant;
using System.ComponentModel;

namespace Backend.Infrastructure.Utils
{
    public class Constant
    {
        public enum Action
        {
            Create,
            Details,
            Edit,
            Delete,
            List,
        }

        /// <summary>
        /// Kiểu dữ liệu tiêu chí sắp xếp
        /// </summary>
        public enum TypeOrdering
        {
            /// <summary>
            /// không sắp xếp
            /// </summary>
            NoSort,

            /// <summary>
            /// tên tăng dần
            /// </summary>
            Name_Ascing,//

            /// <summary>
            /// tên giảm dần
            /// </summary>
            Name_Descing,//

            /// <summary>
            /// ngày sinh tăng dần
            /// </summary>
            Birthday_Ascing,//

            /// <summary>
            /// ngày sinh giảm dần
            /// </summary>
            Birthday_Descing,//

            /// <summary>
            /// ngày đăng ký tăng dần
            /// </summary>
            RegistrationDate_Ascing,//

            /// <summary>
            /// ngày đăng ký giảm dần
            /// </summary>
            RegistrationDate_Descing,//
        }

        public enum TypeExamFee
        {
            ServiceAlong = 1,
            ExamPrice = 2,
        }

        public enum StatusExamShedule
        {
            Open = 0,
            Close = 1,
        }
        public struct ProductExcelColumnName
        {
            public const string col0 = "Mã nhóm sản phẩm";
            public const string col1 = "Mã sản phẩm";
            public const string col2 = "Tên sản phẩm";
            public const string col3 = "Đơn giá";
            public const string col4 = "Thuế VAT";
            public const string col5 = "Ghi chú";
            public const string col6 = "Mã loại sản phẩm";
        }

        public struct ProvinceExcelColumnName
        {
            public const string col0 = "Code";
            public const string col1 = "Name";
        }

        public struct DistrictExcelColumnName
        {
            public const string col0 = "Code";
            public const string col1 = "Name";
            public const string col2 = "ParentCode";
        }

        public struct CustomerExcelColumnName
        {
            public const string col0 = "Mã nhóm khách hàng";
            public const string col1 = "Mã khách hàng";
            public const string col2 = "Tên khách hàng";
            public const string col3 = "Mã số thuế";
            public const string col4 = "Địa chỉ";
            public const string col5 = "SĐT-Fax";
            public const string col6 = "Mã phòng ban quản lý";
            public const string col7 = "Người đại diện";
            public const string col8 = "Chức vụ";
            public const string col9 = "Điện thoại";
            public const string col10 = "Fax";
            public const string col11 = "Số tài khoản ngân hàng";
            public const string col12 = "Chi nhánh ngân hàng";
            public const string col13 = "Mã loại hình KH";
            public const string col14 = "Thành phố";
            public const string col15 = "Quận huyện";
        }

        public struct ActionPermission
        {
            public const int View = 1;
            public const int Create = 2;
            public const int Edit = 4;
            public const int Delete = 8;
        }

        public struct CodeExam
        {
            public const string TopikI = "7";
            public const string TopikII = "8";
            public const string TOEFL_ITP = "6";
            public const string TOEIC_SPW = "4";
            public const string IT = "3";
            public const string TOEIC = "2";
        }

        public struct CandidateInValid
        {
            public const string SBD = "SBD";
        }

        public enum CanDownFile
        {
            CanDown = 1,
            CanNotDown = 2,
            FileNotExits = 3,
            IdNotfound = 4,
        }

        public struct TypeIDCard
        {
            public const string CMND = "1";
            public const string CCCD = "2";
            public const string Passport = "3";
            public const string DinhDanh = "4";
        }
        public struct TypeCheckCandown
        {
            public const int AllData = 1;
            public const int ImageCard = 2;
            public const int ImageAvatar = 3;
            public const int StatusOfApplicants = 4;
            public const int ModelExamRoom = 5;
        }

        public enum StatusPaid
        {
            UnPaid = 1,
            Paid = 2,
            PaymentOverdue = 3,
            NonPayment = 4,
            Refund
        }

        public enum StatusProfile
        {
            Receive = 1,
            Approved,
            UnApproved,
        }

        public enum StatusBlacklist
        {
            WaitingApprove = 1,
            Blacklist,
            ExpiredBlacklist,
        }

        public enum StatusSendMail
        {
            All,
            Sent,
            Unsent,
        }

        public struct Metadata
        {
            public const string LastName = "LastName";
            public const string IsStudent = "IsStudent";
            public const string DistrictContact = "DistrictContact";
            public const string HasOtherIdCard = "HasOtherIdCard";
            public const string TypeIdCard = "TypeIdCard";
            public const string FirstName = "FirstName";
            public const string WardContact = "WardContact";
            public const string CityContact = "CityContact";
            public const string VietnameseName = "VietnameseName";
            public const string DateOfIssueOfIDCard = "DateOfIssueOfIDCard";
            public const string IdCardNumber = "IdCardNumber";
            public const string Gender = "Gender";
            public const string Job = "Job";
            public const string HouseNumber = "HouseNumber";
            public const string IDCardFront = "IDCardFront";
            public const string StudentCardImage = "StudentCardImage";
            public const string IDCardBack = "IDCardBack";
            public const string OldCardIDNumber = "OldCardIDNumber";
            public const string KoreaName = "KoreaName";
            public const string PlaceProvideIdCard = "PlaceProvideIdCard";
            public const string BirthDay = "BirthDay";
            public const string Email = "Email";
            public const string Phone = "Phone";
            public const string OptionJob = "OptionJob";
            public const string Passport = "Passport";
            public const string CCCD = "CCCD";
            public const string CMND = "CMND";
            public const string Country = "Country";
            public const string Language = "Language";
            public const string Image3x4 = "Image3x4";
            public const string SchoolCertificate = "SchoolCertificate";
            public const string BirthCertificate = "BirthCertificate";
            public const string IsKorean = "isKorean";
            public const string IsDisabilities = "IsDisabilities";
            public const string WardWork = "WardWork";
            public const string DistrictWork = "DistrictWork";
            public const string CityWork = "CityWork";
            public const string WorkAddress = "WorkAddress";
            public const string OldCardID = "OldCardID";
            public const string AllowUsePersonalData = "AllowUsePersonalData";
            public const string School = "School";
            public const string Class = "Class";
            public const string StudentCode = "StudentCode";
            public const string ParentPhone = "ParentPhone";
        }
        public static readonly Dictionary<string, string> responseCodeDescription = new()
        {
            { "00", "Giao dịch thành công" },
            { "05", "Giao dịch không thành công do: Tài khoản không đủ số dư để thực hiện giao dịch" },
            { "06", "Giao dịch không thành công do: Nhập sai mật khẩu xác thực giao dịch (OTP)" },
            { "07", "Trừ tiền thành công. Giao dịch bị nghi ngờ (liên quan tới lừa đảo, giao dịch bất thường) " },
            { "09", "Giao dịch không thành công do: Thẻ/Tài khoản chưa đăng ký dịch vụ InternetBanking" },
            { "10", "Giao dịch không thành công do: Khách hàng xác thực thông tin thẻ/tài khoản không đúng quá 3 lần" },
            { "11", "Giao dịch không thành công do: Đã hết hạn chờ thanh toán" },
            { "12", "Giao dịch không thành công do: Thẻ/Tài khoản bị khóa" },
            { "13", "Giao dịch không thành công do: Nhập sai mật khẩu xác thực giao dịch (OTP)" },
            { "24", "Giao dịch không thành công do: Khách hàng hủy giao dịch" },
            { "51", "Giao dịch không thành công do: Tài khoản không đủ số dư để thực hiện giao dịch" },
            { "65", "Giao dịch không thành công do: Tài khoản  đã vượt quá hạn mức giao dịch trong ngày" },
            { "75", "Ngân hàng thanh toán đang bảo trì" },
            { "79", "Giao dịch không thành công do: Nhập sai mật khẩu thanh toán quá số lần quy định" },
            { "99", "Các lỗi khác" }
        };

        public static readonly Dictionary<string, string> transactionStatusDescription = new()
        {
            { "00", "Giao dịch thành công" },
            { "01", "Giao dịch chưa hoàn tất" },
            { "02", "Giao dịch bị lỗi" },
            { "04", "Giao dịch đảo (Khách hàng đã bị trừ tiền tại Ngân hàng nhưng GD chưa thành công ở VNPAY)" },
            { "05", "VNPAY đang xử lý giao dịch này (GD hoàn tiền)" },
            { "06", "VNPAY đã gửi yêu cầu hoàn tiền sang Ngân hàng (GD hoàn tiền)" },
            { "07", "Giao dịch bị nghi ngờ gian lận" },
            { "09", "GD Hoàn trả bị từ chối" },
            { "10", "Đã giao hàng" },
            { "20", "Giao dịch đã được thanh quyết toán cho merchant" }
        };

        public const string SQL_COLLATION_CASE_SENSITIVE = "SQL_Latin1_General_CP1_CS_AS";

        public enum StockApproveType
        {
            Proposal = 1,
            Receipt = 2
        }

        public enum BlacklistTopikStatus
        {
            NotBegin = 1,
            Inprogress = 2,
            Finish = 3
        }
        public enum RegionNumber
        {
            MienBac = 1,
            MienTrung = 2,
            MienNam = 3
        }

        public enum PaymentPortalType
        {
            Vnpay = 1
        }

        public enum ExamTypeFromAsc
        {
            English = 1,
            IT
        }
    }
}
