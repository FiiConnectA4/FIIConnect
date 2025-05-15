module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  moduleFileExtensions: ['js', 'jsx', 'json', 'node'],
  testPathIgnorePatterns: ['/node_modules/', '/build/'],
  transform: {
    '^.+\\.jsx?$': 'babel-jest', // Transformă fișierele JS/JSX folosind Babel
  },
  transformIgnorePatterns: [
    '/node_modules/', // Ignoră transformarea fișierelor din node_modules
  ],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy', // Ignoră fișierele CSS
  },
};