const { defaults } = require("jest-config");

module.exports = {
  snapshotSerializers: ["enzyme-to-json/serializer", "jest-serializer-html"],
  coveragePathIgnorePatterns: ["/node_modules/", "<rootDir>/test/"],
  setupFiles: ["<rootDir>/test/testSetup.ts"],
  moduleFileExtensions: [...defaults.moduleFileExtensions, "ts", "tsx"],
  testMatch: ["**/?(*.)+(spec|test).(j|t)s?(x)"],
  transform: {
    // (.js, .ts, .jsx, .tsx) files
    "\\.(j|t)sx?$": "babel-jest"
  }
};
