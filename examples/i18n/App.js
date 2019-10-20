import React, { useState } from "react";
import constate from "constate";

const translations = {
  en: {
    selectLabel: "Select language"
  },
  pt: {
    selectLabel: "Selecione o idioma"
  }
};

function useI18n() {
  const [lang, setLang] = useState("en");
  const locales = Object.keys(translations);
  return { lang, locales, setLang };
}

const [I18NProvider, useI18NContext] = constate(useI18n);

function useTranslation(key) {
  const { lang } = useI18NContext();
  return translations[lang][key];
}

function Select(props) {
  const { lang, locales, setLang } = useI18NContext();
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
    <I18NProvider>
      <Label htmlFor="select" />
      <br />
      <Select id="select" />
    </I18NProvider>
  );
}

export default App;
