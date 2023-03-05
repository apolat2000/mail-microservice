import { PipeTransform, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { contextKeys } from '../constants/context_keys.record';
import { MailSendDto } from '../dto/mail.dto.send';

@Injectable()
export class ContextIntegrityPipe implements PipeTransform {
  transform(value: MailSendDto) {
    const { context, type } = value;
    const contextKeysOfThisType = contextKeys[type];
    for (const key of Object.keys(context)) {
      if (!contextKeysOfThisType.includes(key)) {
        delete context[key];
      }
    }
    for (const key of contextKeysOfThisType) {
      if (!Object.keys(context).includes(key)) {
        throw new RpcException(`Key ${key} is missing in subject payload`);
      }
    }
    return value;
  }
}
