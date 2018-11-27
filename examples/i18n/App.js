import React from "react";
import { Provider, useContextState } from "constate";

const translations = {
  en: {
    selectLabel: "Select language"
  },
  pt: {
    selectLabel: "Selecione o idioma"
  }
};

function useI18n() {
  const [lang, setLang] = useContextState("lang", "en");
  const locales = Object.keys(translations);
  return { lang, locales, setLang };
}

function useTranslation(key) {
  const { lang } = useI18n();
  return translations[lang][key];
}

function Select(props) {
  const { lang, locales, setLang } = useI18n();
  return (
    <select {...props} onChange={e => setLang(e.target.value)} value={lang}>
      {locales.map(locale => (
        <option key={locale}>{locale}</option>
      ))}
    </select>
  );
}

function Label(props) {
  const label = useTranslation("selectLabel");
  return <label {...props}>{label}</label>;
}

function App() {
  return (
    <Provider devtools>
      <Label htmlFor="select" />
      <br />
      <Select id="select" />
    </Provider>
  );
}

export default App;
