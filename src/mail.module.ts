import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailController } from './mail.controller';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { configuration } from './configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `${process.cwd()}/${process.env.NODE_ENV || 'dev'}.env`,
      load: [configuration],
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('MAILGUN.HOST'),
          port: configService.get<string>('MAILGUN.PORT'),
          secure: configService.get<string>('MAILGUN.NODE_ENV') === 'prod',
          auth: {
            user: configService.get<string>('MAILGUN.USER'),
            pass: configService.get<string>('MAILGUN.PASS'),
          },
        },
        template: {
          dir: process.cwd() + '/src/templates/',
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [MailController],
  providers: [MailService],
})
export class MailModule {}
