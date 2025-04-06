import dotenv from "dotenv";
import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";

dotenv.config();

const { MAILERSENDER_API_KEY, MAILERSENDER_SENDER, TEMPLATE_ID } = process.env;

const mailerSend = new MailerSend({
  apiKey: MAILERSENDER_API_KEY,
});

const sentFrom = new Sender(MAILERSENDER_SENDER, "Vroom");

export const sendEmail = async (email, name) => {
  const recipients = [new Recipient(email, name)];
  const personalization = [
    {
      email: email,
      data: {
        name: name,
      },
    },
  ];
  const emailParams = new EmailParams()
    .setFrom(sentFrom)
    .setTo(recipients)
    .setReplyTo(sentFrom)
    .setTemplateId(TEMPLATE_ID)
    .setPersonalization(personalization);

  await mailerSend.email.send(emailParams);
};
