// jest.setup.ts

import "@testing-library/jest-native/extend-expect";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      language: "tr",
      changeLanguage: jest.fn(),
    },
  }),
}));
