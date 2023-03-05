import { MailType } from 'src/constants/mail_type.enum';

export interface MailSendDto {
  attachments: {
    cid: string;
    content: string;
    encoding: string;
    filename: string;
  }[];
  context: Record<string, string>;
  locale?: string;
  recipients: string[];
  type: MailType;
}
