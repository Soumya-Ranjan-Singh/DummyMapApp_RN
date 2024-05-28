module.exports = {
  preset: 'react-native',
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  moduleFileExtensions: ['js', 'jsx', 'json', 'node'],
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|js?)$',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  setupFiles: ['<rootDir>/node_modules/react-native/jest/setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|react-native-maps)/)',
  ],
};
