module.exports = {
  preset: 'ts-jest',
  setupFiles: ['dotenv/config'],
  testEnvironment: 'node',
  testRegex: ['tests/.*?\\.test\\.tsx?$'],
}
