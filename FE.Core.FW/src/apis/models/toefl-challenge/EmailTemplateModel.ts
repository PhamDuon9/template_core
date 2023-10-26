/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { EmailTemplateType } from "./EmailTemplateType";

export type EmailTemplateModel = {
  id?: string;
  emailTemplateType?: EmailTemplateType;
  subject?: string | null;
  body?: string | null;
};

