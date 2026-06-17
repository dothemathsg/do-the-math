import { config } from "dotenv";
config({ path: ".env.local" });
import nodemailer from "nodemailer";

async function main() {
  console.log("GMAIL_USER:", process.env.GMAIL_USER);
  console.log("GMAIL_APP_PASSWORD set:", !!process.env.GMAIL_APP_PASSWORD);

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  try {
    await transporter.verify();
    console.log("SMTP connection verified OK");
  } catch (err) {
    console.error("SMTP verify failed:", err);
    return;
  }

  try {
    const info = await transporter.sendMail({
      from: `"Do The Math" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      subject: "Test notification — Do The Math",
      html: "<p>This is a test email from the Do The Math mailer.</p>",
    });
    console.log("Email sent:", info.messageId);
  } catch (err) {
    console.error("Send failed:", err);
  }
}

main();
