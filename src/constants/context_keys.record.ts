import { MailType } from './mail_type.enum';

export const contextKeys: Record<MailType, string[]> = {
  WELCOME: ['firstName', 'locale'],
};
