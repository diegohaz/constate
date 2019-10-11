import React, { useState } from "react";
import createContextHook from "constate";

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

// Only re-evaluate useI18n return value when lang changes
const useI18NContext = createContextHook(useI18n, value => [value.lang]);

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
    <useI18NContext.Provider>
      <Label htmlFor="select" />
      <br />
      <Select id="select" />
    </useI18NContext.Provider>
  );
}

export default App;
