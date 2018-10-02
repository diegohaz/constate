module.exports = {
  coveragePathIgnorePatterns: ["/node_modules/", "<rootDir>/test/"],
  setupFiles: ["<rootDir>/test/testSetup.ts"],
  moduleFileExtensions: ["js", "jsx", "ts", "tsx"],
  testMatch: ["**/?(*.)+(spec|test).(j|t)s?(x)"],
  transform: {
    "\\.(j|t)sx?$": "babel-jest"
  }
};
