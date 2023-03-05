import * as Joi from 'joi';
import { MailType } from '../constants/mail_type.enum';

export const mailSendDtoSchema = Joi.object({
  attachments: Joi.array().items(
    Joi.object({
      cid: Joi.string().required(),
      content: Joi.string().required(),
      encoding: Joi.string().required(),
      filename: Joi.string().required(),
    }),
  ),
  context: Joi.object().required(),
  locale: Joi.string(),
  recipients: Joi.array().items(Joi.string().email().required()),
  type: Joi.string()
    .valid(...Object.values(MailType))
    .required(),
});
