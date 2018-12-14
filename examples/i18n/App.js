import React, { useState, useContext } from "react";
import createContainer from "constate";

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
const I18n = createContainer(useI18n, value => [value.lang]);

function useTranslation(key) {
  const { lang } = useContext(I18n.Context);
  return translations[lang][key];
}

function Select(props) {
  const { lang, locales, setLang } = useContext(I18n.Context);
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
    <I18n.Provider>
      <Label htmlFor="select" />
      <br />
      <Select id="select" />
    </I18n.Provider>
  );
}

export default App;
