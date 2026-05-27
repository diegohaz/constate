import constate from "constate";
import { useState } from "react";

const translations = {
  en: {
    selectLabel: "Select language",
  },
  pt: {
    selectLabel: "Selecione o idioma",
  },
};

type Locale = keyof typeof translations;
type TranslationKey = keyof (typeof translations)[Locale];

function useI18n() {
  const [lang, setLang] = useState<Locale>("en");
  const locales = Object.keys(translations) as Locale[];
  return { lang, locales, setLang };
}

const [I18NProvider, useI18NContext] = constate(useI18n);

function useTranslation(key: TranslationKey) {
  const { lang } = useI18NContext();
  return translations[lang][key];
}

function Select(props: React.ComponentProps<"select">) {
  const { lang, locales, setLang } = useI18NContext();
  return (
    <select
      {...props}
      onChange={(e) => setLang(e.target.value as Locale)}
      value={lang}
    >
      {locales.map((locale) => (
        <option key={locale}>{locale}</option>
      ))}
    </select>
  );
}

function Label(props: React.ComponentProps<"label">) {
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
