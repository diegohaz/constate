module.exports = {
  collectCoverageFrom: ["src/**/*.{ts,tsx,js}", "!src/utils/useDevtools.ts"],
  coveragePathIgnorePatterns: ["/node_modules/", "<rootDir>/test/"],
  setupFilesAfterEnv: [
    "raf/polyfill",
    "@testing-library/react/cleanup-after-each"
  ]
};
