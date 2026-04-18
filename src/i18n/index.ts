import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Localization from "expo-localization";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./resources/en/common.json";
import tr from "./resources/tr/common.json";

const resources = {
  en: { translation: en },
  tr: { translation: tr },
};

const LANGUAGE_KEY = "user-language";

// cihaz dili
const getDeviceLanguage = () => {
  const locale = Localization.getLocales()[0]?.languageCode;
  return locale === "tr" ? "tr" : "en";
};

// storage dili
const getStoredLanguage = async () => {
  const lang = await AsyncStorage.getItem(LANGUAGE_KEY);
  return lang || getDeviceLanguage();
};

// 🔥 async init fonksiyonu
export const initI18n = async () => {
  const lang = await getStoredLanguage();

  await i18n.use(initReactI18next).init({
    resources,
    lng: lang,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });
};

export default i18n;
