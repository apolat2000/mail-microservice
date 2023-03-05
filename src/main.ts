import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { MailModule } from './mail.module';

async function bootstrap(): Promise<void> {
  const appContext = await NestFactory.createApplicationContext(MailModule);
  const configService = appContext.get<ConfigService>(ConfigService);
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    MailModule,
    {
      transport: Transport.REDIS,
      options: {
        port: configService.get<number>('REDIS.PORT'),
        host: configService.get<string>('REDIS.HOST'),
      },
    },
  );
  await app.listen();
}
bootstrap();
