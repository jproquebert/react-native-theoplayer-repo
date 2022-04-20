import languages from '../../res/languages.json';
interface LanguageMap {
  [key: string]: Language;
}
const languageMap: LanguageMap = languages;

export class Language {
  name: string;
  nativeName: string;

  constructor(name: string, nativeName: string) {
    this.name = name;
    this.nativeName = nativeName;
  }

  static fromCode(code: string): Language | null {
    return code in languageMap ? languageMap[code] : null;
  }
}
