import { RpcException } from '@nestjs/microservices';
import { TestingModule, Test } from '@nestjs/testing';
import { MailType } from './constants/mail_type.enum';
import { MailController } from './mail.controller';
import { MailService } from './mail.service';

// mock MailType
jest.mock('./constants/mail_type.enum', () => ({
  MailType: {
    TEST_0: 'TEST_0',
    TEST_1: 'TEST_1',
    TEST_2: 'TEST_2',
    TEST_3: 'TEST_3',
  },
}));

// mock contextKeys
jest.mock('./constants/context_keys.record', () => ({
  contextKeys: {
    TEST_1: ['payload'],
    TEST_2: ['payload'],
    TEST_3: ['payload'],
  },
}));

describe('MailController', () => {
  let controller: MailController;

  const mockMailService = {
    i18nResolver: jest.fn().mockImplementation(() => Promise.resolve('')),
    contextResolver: jest.fn(),
    sendMail: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [MailController],
      providers: [MailService],
    })
      .overrideProvider(MailService)
      .useValue(mockMailService)
      .compile();

    controller = module.get<MailController>(MailController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('throws an error if there is no template for MailType', async () => {
    const type = 'TEST_0' as MailType;
    expect(
      controller.sendMail({
        type,
        recipients: ['example@mail.com'],
        context: {},
        attachments: [],
      }),
    ).rejects.toThrow(
      new RpcException(`No content found for type ${type} and locale en`),
    );
  });

  it('throws an error if there is no content.hbs', async () => {
    const type = 'TEST_1' as MailType;
    expect(
      controller.sendMail({
        type,
        recipients: ['example@mail.com'],
        context: {
          payload: 'potato',
        },
        attachments: [],
      }),
    ).rejects.toThrow(
      new RpcException(`No content found for type ${type} and locale en`),
    );
  });

  it('throws an error if there is no dict for MailType', async () => {
    const type = 'TEST_2' as MailType;
    expect(
      controller.sendMail({
        type,
        recipients: ['example@mail.com'],
        context: {
          payload: 'potato',
        },
        attachments: [],
      }),
    ).rejects.toThrow(
      new RpcException(`No content found for type ${type} and locale en`),
    );
  });

  it('throws an error if there is no key "subject" in dict', async () => {
    const type = 'TEST_3' as MailType;
    expect(
      controller.sendMail({
        type,
        recipients: ['example@mail.com'],
        context: {
          payload: 'potato',
        },
        attachments: [],
      }),
    ).rejects.toThrow(
      new RpcException(`No subject found for type ${type} and locale en`),
    );
  });
});
