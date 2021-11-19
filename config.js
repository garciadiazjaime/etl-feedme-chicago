const convict = require('convict');

// Define a schema
const config = convict({
  env: {
    doc: 'The applicaton environment.',
    format: ['production', 'development', 'test'],
    default: 'development',
    env: 'NODE_ENV',
  },
  port: {
    doc: 'The applicaton port environment.',
    default: '3030',
    env: 'PORT',
  },
  instagram: {
    username: {
      env: 'INSTAGRAM_USERNAME',
      default: '',
    },
    password: {
      default: '',
      env: 'INSTAGRAM_USER_PASSWORD',
    },
    hashtags: {
      default: '',
      env: 'INSTAGRAM_HASHTAGS',
    },
  },
  api: {
    url: {
      doc: 'API URL',
      format: String,
      default: 'http://127.0.0.1:3030',
      env: 'API_URL',
    },
  },
});

// Perform validation
config.validate({ allowed: 'strict' });

module.exports = config;
