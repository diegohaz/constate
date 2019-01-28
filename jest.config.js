module.exports = {
  collectCoverageFrom: ["src/**/*.{ts,tsx,js}", "!src/utils/useDevtools.ts"],
  coveragePathIgnorePatterns: ["/node_modules/", "<rootDir>/test/"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  moduleFileExtensions: ["js", "jsx", "ts", "tsx"],
  testMatch: ["**/?(*.)+(spec|test).(j|t)s?(x)"],
  transform: {
    "\\.(j|t)sx?$": "babel-jest"
  }
};
