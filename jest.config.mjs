export default {
  preset: 'jest-puppeteer',
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
    '#(.*)': '<rootDir>/node_modules/$1',
  },
  testTimeout: 60000
};
