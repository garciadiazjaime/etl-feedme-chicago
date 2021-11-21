const sgMail = require('@sendgrid/mail');

const config = require('../../config');

sgMail.setApiKey(config.get('sendgrid'));

const params = {
  to: 'info@mintitmedia.com',
  from: 'info@mintitmedia.com',
  subject: 'etl-feedme',
  text: '',
  html: '',
};

function sendEmail(msg) {
  return sgMail.send({
    ...params,
    text: msg,
    html: msg,
  });
}

module.exports = sendEmail;
