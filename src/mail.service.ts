import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { readFile } from 'fs/promises';
import { compile } from 'handlebars';
import * as path from 'path';
import { MailType } from './constants/mail_type.enum';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  i18nResolver = async (
    type: MailType,
    locale: string,
    target: 'subject' | 'content',
  ): Promise<string> => {
    try {
      let dictRaw;
      try {
        dictRaw = await readFile(
          path.join(
            process.cwd(),
            `/src/templates/${type}/dict/${locale}.json`,
          ),
          'utf8',
        );
      } catch {
        dictRaw = await readFile(
          path.join(process.cwd(), `/src/${type}/dict/en.json`),
          'utf8',
        );
      }
      if (!dictRaw) return null;
      const dict = JSON.parse(dictRaw);
      if (target === 'subject') return dict['subject'];
      const templateFile = await readFile(
        path.join(process.cwd(), `/src/templates/${type}/content.hbs`),
        'utf8',
      );
      const template = compile(templateFile);
      return template(dict['content']);
    } catch {
      return null;
    }
  };

  contextResolver = async (
    input: string,
    type: MailType,
    context: Record<string, string>,
  ) => {
    if (!context['locale']) context['locale'] = 'en';
    try {
      return compile(input)(context);
    } catch {
      return null;
    }
  };

  async sendMail(
    recipients: string[],
    type: MailType,
    subjectText: string,
    contentText: string,
    attachments: {
      filename: string;
      content: string;
      cid: string;
      encoding: string;
    }[],
  ): Promise<[boolean, Error]> {
    try {
      await this.mailerService.sendMail({
        to: recipients,
        from: `postmaster@${process.env.MAILGUN_DOMAIN}`,
        subject: subjectText,
        html: contentText,
        attachments,
      });
      return [true, null];
    } catch (error) {
      return [false, error];
    }
  }
}
