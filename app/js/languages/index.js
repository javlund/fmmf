import T from 'i18n-react';
import danishTexts from './danish';
import englishTexts from './english';

export default (lang) => {
  let language = lang === 'en' ? englishTexts : danishTexts;
  T.setTexts(language);
};
