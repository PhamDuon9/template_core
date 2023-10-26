using System.IO;
using System;
using System.Text;
using RazorEngineCore;
using Backend.Infrastructure.Utils;
using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;
using Microsoft.Extensions.Options;
using Backend.Business.User;
using Backend.Infrastructure.EntityFramework.Repositories;
using Serilog;
using System.Security.AccessControl;
using Backend.Infrastructure.EntityFramework.Datatables;
using Shared.Caching.Interface;

namespace Backend.Business.Mailing
{
    public class EmailTemplateHandler : IEmailTemplateHandler
    {
        private readonly EmailSettings _emailSettings;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly ICached _cached;

        public EmailTemplateHandler(IOptions<EmailSettings> mailSettings, IHttpContextAccessor httpContextAccessor, ICached cached)
        {
            _emailSettings = mailSettings.Value;
            _httpContextAccessor = httpContextAccessor;
            _cached = cached;
        }
        public string GenerateEmailTemplate<T>(string templateName, T mailTemplateModel)
        {
            try
            {
                string template = "";
                string keyCache = $"Template-{templateName}";
                var checkKeyExist = _cached.CheckKeyExist(keyCache);
                if (checkKeyExist)
                {
                    template = _cached.Get<string>(keyCache);
                }
                else
                {
                    template = GetTemplate(templateName);
                    _cached.Add(keyCache, template, 30);
                }

                IRazorEngine razorEngine = new RazorEngine();
                IRazorEngineCompiledTemplate modifiedTemplate = razorEngine.Compile(template);

                return modifiedTemplate.Run(mailTemplateModel);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        private string GetTemplate(string templateName)
        {
            string baseDirectory = AppDomain.CurrentDomain.BaseDirectory;
            string tmplFolder = Path.Combine(baseDirectory, "EmailTemplates");
            string filePath = Path.Combine(tmplFolder, $"{templateName}.cshtml");

            using var fs = new FileStream(filePath, FileMode.Open, FileAccess.Read, FileShare.ReadWrite);
            using var sr = new StreamReader(fs, Encoding.Default);
            string mailText = sr.ReadToEnd();
            sr.Close();

            return mailText;
        }

        public ResponseData SendEmail(EmailRequest request)
        {
            try
            {
                var email = new MimeMessage
                {
                    Sender = MailboxAddress.Parse(_emailSettings.Mail)
                };
                foreach (var item in request.ToEmail)
                {
                    email.To.Add(MailboxAddress.Parse(item));
                }
                email.Subject = request.Subject;
                var builder = new BodyBuilder();
                if (request.Attachments != null)
                {
                    byte[] fileBytes;
                    foreach (var file in request.Attachments)
                    {
                        if (file.Length > 0)
                        {
                            using (var ms = new MemoryStream())
                            {
                                file.CopyTo(ms);
                                fileBytes = ms.ToArray();
                            }
                            string contentType = GetMimeType(file.FileName);
                            builder.Attachments.Add(file.FileName, fileBytes, MimeKit.ContentType.Parse(contentType));
                        }
                    }
                }
                builder.HtmlBody = request.Body;
                email.Body = builder.ToMessageBody();
                using var smtp = new SmtpClient();
                smtp.Connect(_emailSettings.Host, _emailSettings.Port, SecureSocketOptions.StartTls);
                smtp.Authenticate(_emailSettings.Mail, _emailSettings.Password);
                var result = smtp.Send(email);
                smtp.Disconnect(true);

                return new ResponseData() { Code = Code.Success, Message = result };
            }
            catch (Exception e)
            {
                return new ResponseData() { Code = Code.ServerError, Message = e.Message };
            }
        }

        /// <summary>
        /// lấy về tên content type của file
        /// </summary>
        /// <param name="fileName">Tên của file</param>
        /// <returns></returns>
        private string GetMimeType(string fileName)
        {
            string mimeType = "application/unknown";
            string ext = System.IO.Path.GetExtension(fileName).ToLower();
            Microsoft.Win32.RegistryKey regKey = Microsoft.Win32.Registry.ClassesRoot.OpenSubKey(ext);
            if (regKey != null && regKey.GetValue("Content Type") != null)
                mimeType = regKey.GetValue("Content Type").ToString();
            return mimeType;
        }
        public async Task<ResponseData> SendEmailAsync(EmailRequest request)
        {
            try
            {
                var email = new MimeMessage
                {
                    Sender = MailboxAddress.Parse(_emailSettings.Mail)
                };
                foreach (var item in request.ToEmail)
                {
                    email.To.Add(MailboxAddress.Parse(item));
                }
                email.Subject = request.Subject;
                var builder = new BodyBuilder();
                if (request.Attachments != null)
                {
                    byte[] fileBytes;
                    foreach (var file in request.Attachments)
                    {
                        if (file.Length > 0)
                        {
                            using (var ms = new MemoryStream())
                            {
                                file.CopyTo(ms);
                                fileBytes = ms.ToArray();
                            }
                            string contentType = GetMimeType(file.FileName);
                            builder.Attachments.Add(file.FileName, fileBytes, MimeKit.ContentType.Parse(contentType));
                        }
                    }
                }
                builder.HtmlBody = request.Body;
                email.Body = builder.ToMessageBody();
                using var smtp = new SmtpClient();
                smtp.Connect(_emailSettings.Host, _emailSettings.Port, SecureSocketOptions.StartTls);
                smtp.Authenticate(_emailSettings.Mail, _emailSettings.Password);
                var result = await smtp.SendAsync(email);
                smtp.Disconnect(true);

                return new ResponseData() { Code = Code.Success, Message = result };
            }
            catch (Exception e)
            {
                return new ResponseData() { Code = Code.ServerError, Message = e.Message };
            }
        }

        public async Task<ResponseData> SendOneZetaEmail(EmailRequest model)
        {
            try
            {
                var client = new HttpClient();
                using var unitOfWork = new UnitOfWork(_httpContextAccessor);
                var request = new HttpRequestMessage(HttpMethod.Post, Utils.GetConfig("ZetaMail:SendOne"));
                var content = new MultipartFormDataContent();
                content.Add(new StringContent(model.Subject != null ? model.Subject : "IIGVietnam"), "Subject");
                content.Add(new StringContent(Utils.GetConfig("ZetaMail:FromName")), "FromName");
                content.Add(new StringContent(Utils.GetConfig("ZetaMail:FromAddress")), "ReplyTo");
                content.Add(new StringContent(Utils.GetConfig("ZetaMail:FromAddress")), "FromAddress");
                content.Add(new StringContent(model.HTMLBody != null ? model.HTMLBody : string.Empty), "HTMLBody");
                content.Add(new StringContent(model.Body != null ? model.Body : string.Empty), "TextBody");
                content.Add(new StringContent(model.ToAddress), "ToAddress");
                content.Add(new StringContent(Utils.GetConfig("ZetaMail:Token")), "token");
                content.Add(new StringContent("1"), "queue");
                request.Content = content;

                var response = await client.SendAsync(request);
                if (response.IsSuccessStatusCode && response.StatusCode == System.Net.HttpStatusCode.OK)
                {
                    string result1 = await response.Content.ReadAsStringAsync();
                    unitOfWork.Repository<SysEmailHistory>().InsertOrUpdate(new SysEmailHistory()
                    {
                        Body = model.HTMLBody,
                        Id = Guid.NewGuid(),
                        IsSend = true,
                        Note = result1 ?? response?.ToString() ?? null,
                        Subject = model.Subject,
                        ToEmail = model.ToAddress
                    });
                    unitOfWork.Save();
                    return new ResponseData(Code.Success, "Gửi thành công tới địa chỉ email " + model.ToAddress);
                }
                string result = await response.Content.ReadAsStringAsync();
                unitOfWork.Repository<SysEmailHistory>().InsertOrUpdate(new SysEmailHistory()
                {
                    Body = model.HTMLBody,
                    Id = Guid.NewGuid(),
                    IsSend = false,
                    Note = result ?? response?.ToString() ?? null,
                    Subject = model.Subject,
                    ToEmail = model.ToAddress
                });
                unitOfWork.Save();
                return new ResponseDataError(Code.ServerError, result);
            }
            catch (Exception exception)
            {
                using var unitOfWork = new UnitOfWork(_httpContextAccessor);
                unitOfWork.Repository<SysEmailHistory>().InsertOrUpdate(new SysEmailHistory()
                {
                    Body = model.HTMLBody,
                    Id = Guid.NewGuid(),
                    IsSend = false,
                    Note = exception.Message,
                    Subject = model.Subject,
                    ToEmail = model.ToAddress
                });
                unitOfWork.Save();
                Log.Error(exception, exception.Message);
                return new ResponseDataError(Code.ServerError, exception.Message);
            }
        }
    }
}
