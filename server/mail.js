const Promise = require('bluebird');
const helper = require('sendgrid').mail;
const sg = require('sendgrid')(process.env.SENDGRID_API_KEY);

function sendNewMemberMail(member) {
  const sender = new helper.Email('jtroelsgaard@gmail.com', 'Friends of Metal Magic');
  const receiver = new helper.Email(member.email, member.name);
  const subject = 'Velkommen til Friends of Metal Magic';
  const content = new helper.Content('text/html', 'placeholder');
  const mail = new helper.Mail(sender, subject, receiver, content);
  
  const personalization = mail.personalizations[0];
  personalization.addSubstitution(new helper.Substitution('-name-', member.name));
  personalization.addSubstitution(new helper.Substitution('-email-', member.email));
  personalization.addSubstitution(new helper.Substitution('-address-', member.address));
  personalization.addSubstitution(new helper.Substitution('-city-', member.city));
  personalization.addSubstitution(new helper.Substitution('-zip-', member.zip));
  personalization.addSubstitution(new helper.Substitution('-country-', member.country));
  mail.setTemplateId('87bd7cfe-1e30-4a85-85a7-3d5ac7a30873');

  const request = sg.emptyRequest({
    method: 'POST',
    path: '/v3/mail/send',
    body: mail.toJSON()
  });

  const sgPromise = Promise.promisify(sg.API, {context: sg});

  return sgPromise(request);
}

module.exports = {
  sendNewMemberMail
};
