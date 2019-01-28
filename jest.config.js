module.exports = {
  collectCoverageFrom: ["src/**/*.{ts,tsx,js}", "!src/utils/useDevtools.ts"],
  coveragePathIgnorePatterns: ["/node_modules/", "<rootDir>/test/"],
  setupFilesAfterEnv: [
    "raf/polyfill",
    "react-testing-library/cleanup-after-each"
  ]
};
