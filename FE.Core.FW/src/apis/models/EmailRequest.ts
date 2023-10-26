/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type EmailRequest = {
  toAddress?: string | null;
  toEmail?: Array<string> | null;
  subject?: string | null;
  body?: string | null;
  htmlBody?: string | null;
  attachments?: Array<Blob> | null;
};

