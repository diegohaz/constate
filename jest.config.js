const { defaults } = require("jest-config");

module.exports = {
  snapshotSerializers: ["enzyme-to-json/serializer", "jest-serializer-html"],
  coveragePathIgnorePatterns: ["/node_modules/", "<rootDir>/test/"],
  setupFiles: ["<rootDir>/test/testSetup.js"],
  moduleFileExtensions: [...defaults.moduleFileExtensions, "ts", "tsx"],
  transform: {
    // (.js, .ts, .jsx, .tsx) files
    "\\.(j|t)sx?$": "babel-jest"
  }
};
