import { existsSync, readdirSync } from 'fs';
import { join } from 'path';
import { Locale } from './constants/locale.enum';
import { MailType } from './constants/mail_type.enum';

describe('templates directory', () => {
  let templateFolders = readdirSync(join(__dirname, 'templates'));
  templateFolders = templateFolders.filter(
    (folder) => !folder.startsWith('TEST_'),
  );
  const mailTypes = Object.values(MailType);
  const locales = Object.values(Locale);

  it('should exist', () => {
    expect(existsSync(join(__dirname, 'templates'))).toBeTruthy();
  });

  // Bijection between mail types and folder names under templates
  it('Mail types include template folders', () => {
    for (const folder of templateFolders) {
      expect(mailTypes.includes(folder as MailType)).toBeTruthy();
    }
  });
  it('Template folders include mail types', () => {
    for (const mailType of mailTypes) {
      expect(templateFolders.includes(mailType)).toBeTruthy();
    }
  });
  it('Template folders all have the expected structure', () => {
    /*
     * - dict
     *  \_ [locale in locales].json
     * - content.hbs
     */
    for (const folder of templateFolders) {
      expect(
        existsSync(join(__dirname, 'templates', folder, 'content.hbs')),
      ).toBeTruthy();
      expect(
        existsSync(join(__dirname, 'templates', folder, 'dict')),
      ).toBeTruthy();
      const dictFiles = readdirSync(
        join(__dirname, 'templates', folder, 'dict'),
      );
      for (const dictFile of dictFiles) {
        expect(dictFile.endsWith('.json')).toBeTruthy();
        const locale = dictFile.split('.')[0] as Locale;
        expect(locales.includes(locale)).toBeTruthy();
      }
      for (const locale of locales) {
        expect(dictFiles.includes(`${locale}.json`)).toBeTruthy();
      }
    }
  });
  it('All .json files under template/ have the correct structure', () => {
    for (const folder of templateFolders) {
      const dictFiles = readdirSync(
        join(__dirname, 'templates', folder, 'dict'),
      );
      for (const dictFile of dictFiles) {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const dict = require(join(
          __dirname,
          'templates',
          folder,
          'dict',
          dictFile,
        ));
        expect(dict).toHaveProperty('subject');
        expect(dict).toHaveProperty('content');
        expect(typeof dict.subject).toBe('string');
        expect(typeof dict.content).toBe('object');
        // Expect it to have no other property
        expect(Object.keys(dict).length).toBe(2);
      }
    }
  });
});
