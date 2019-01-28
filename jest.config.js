module.exports = {
  collectCoverageFrom: ["src/**/*.{ts,tsx,js}", "!src/utils/useDevtools.ts"],
  coveragePathIgnorePatterns: ["/node_modules/", "<rootDir>/test/"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"]
};
