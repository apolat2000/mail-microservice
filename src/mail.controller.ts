import { Controller, UsePipes } from '@nestjs/common';
import { MessagePattern, RpcException } from '@nestjs/microservices';
import { MailService } from './mail.service';
import { JoiValidationPipe } from './pipes/mail.pipe.joi';
import { mailSendDtoSchema } from './schemas/mail.schema.send';
import { MailSendDto } from './dto/mail.dto.send';
import { ContextIntegrityPipe } from './pipes/mail.pipe.ctx_integrity';

@Controller()
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @MessagePattern({ role: 'mail', cmd: 'is-alive' })
  getHello() {
    return true;
  }

  @MessagePattern({ role: 'mail', cmd: 'send' })
  @UsePipes(new ContextIntegrityPipe())
  @UsePipes(new JoiValidationPipe(mailSendDtoSchema))
  async sendMail({
    type,
    recipients,
    context,
    locale = 'en',
    attachments,
  }: MailSendDto): Promise<boolean> {
    const contentI18nResolved = await this.mailService.i18nResolver(
      type,
      locale,
      'content',
    );
    if (!contentI18nResolved) {
      throw new RpcException(
        `No content found for type ${type} and locale ${locale}`,
      );
    }

    const content = await this.mailService.contextResolver(
      contentI18nResolved,
      type,
      context,
    );
    if (!content) {
      throw new RpcException(
        `Context didn't resolve for type ${type} and locale ${locale}`,
      );
    }

    const subjectI18nResolved = await this.mailService.i18nResolver(
      type,
      locale,
      'subject',
    );
    if (!subjectI18nResolved) {
      throw new RpcException(
        `No subject found for type ${type} and locale ${locale}`,
      );
    }
    const subject = await this.mailService.contextResolver(
      subjectI18nResolved,
      type,
      context,
    );

    if (!subject) {
      throw new RpcException(
        `Context didn't resolve for type ${type} and locale ${locale}`,
      );
    }

    const [success, error] = await this.mailService.sendMail(
      recipients,
      type,
      subject,
      content,
      attachments.map((a) => ({ ...a, encoding: 'base64' })),
    );
    if (!success) throw new RpcException(error);

    return true;
  }
}
