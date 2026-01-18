export function getCurrentLang() {
  const lang = location.pathname.split('/')[1];
  return ['ua', 'en'].includes(lang) ? lang : 'ua';
}
