const Promise = require('bluebird');
const helper = require('sendgrid').mail;
const sg = require('sendgrid')(process.env.SENDGRID_API_KEY);

function createBasicMail(member, subject) {
  const sender = new helper.Email('jtroelsgaard@gmail.com', 'Friends of Metal Magic');
  const receiver = new helper.Email(member.email, member.name);
  const content = new helper.Content('text/html', 'placeholder');

  return new helper.Mail(sender, subject, receiver, content);  
}

function createMailPromise(mail) {
  const request = sg.emptyRequest({
    method: 'POST',
    path: '/v3/mail/send',
    body: mail.toJSON()
  });

  const sgPromise = Promise.promisify(sg.API, {context: sg});

  return sgPromise(request);  
}

function sendNewMemberMail(member) {
  const subject = 'Velkommen til Friends of Metal Magic';
  const mail = createBasicMail(member, subject);
  
  const personalization = mail.personalizations[0];
  personalization.addSubstitution(new helper.Substitution('-name-', member.name));
  personalization.addSubstitution(new helper.Substitution('-email-', member.email));
  personalization.addSubstitution(new helper.Substitution('-address-', member.address));
  personalization.addSubstitution(new helper.Substitution('-city-', member.city));
  personalization.addSubstitution(new helper.Substitution('-zip-', member.zip));
  personalization.addSubstitution(new helper.Substitution('-country-', member.country.label));
  mail.setTemplateId('87bd7cfe-1e30-4a85-85a7-3d5ac7a30873');

  return createMailPromise(mail);
}

function sendMembershipConfirmationMail(member) {
  const danish = member.country.value === 'DK'
  const subject = danish ? 'Dit medlemskab er nu bekræftet' : 'Your membership is now confirmed';
  const mail = createBasicMail(member, subject);
  const templateId = danish ? '441d695e-d145-40c5-82f8-1e00975f6ec1' : '4d2fe39e-82d7-427c-b1d8-3df0fe20c434';
  mail.setTemplateId(templateId);

  return createMailPromise(mail);
}

function sendExistingMembersMail(member) {
  const danish = member.country.value === 'DK';
  const subject = danish ? 'Tak for din støtte!' : 'Thank you for your support!';
  const mail = createBasicMail(member, subject);

  const personalization = mail.personalizations[0];
  personalization.addSubstitution(new helper.Substitution('-id-', member.id.toString()));
  personalization.addSubstitution(new helper.Substitution('-lang-', danish ? 'da' : 'en'));
  const templateId = danish ? '2349bf55-bd85-43a3-8ffc-3e689ac18b5c' : '1fc0762e-1a50-4bd9-8ee0-a61a9348c51e';
  mail.setTemplateId(templateId);

  return createMailPromise(mail).then(result => {
    return {result: result, member: member};
  });
}

module.exports = {
  sendNewMemberMail,
  sendMembershipConfirmationMail,
  sendExistingMembersMail
};
