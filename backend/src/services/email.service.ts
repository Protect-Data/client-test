import { Resend } from "resend";
import fs from "fs";
import nodemailer from "nodemailer";

interface SmtpObject {
  host: string;
  port: number;
  user: string;
  pass: string;
}

const smtpEmail = ({ host, port, user, pass }: SmtpObject) => {
  try {
    const transporter = nodemailer.createTransport({
      host,
      secure: false,
      tls: {
        rejectUnauthorized: false
      },
      port,
      auth: {
        user,
        pass
      }
    });
    return transporter;
  } catch (error) {
    throw new Error("failed to connect smtp server");
  }
};

export const forgotPassMail = async ({
  client,
  name,
  email,
  code
}: {
  client?: string | undefined;
  name: string;
  email: string;
  code: string;
}) => {
  try {
    if (!email) {
      throw new Error("Email is not valid");
    }
    const file = fs.readFileSync("./src/emails/forgotPass.html", {
      encoding: "utf8"
    });

    const PROTECT_DATA_CLIENT = client ? client : "chatguru";

    let html = file;
    const vars = [
      {
        var: "{{name}}",
        value: name
      },
      {
        var: "{{code}}",
        value: code
      },
      {
        var: "{{link}}",
        value: `https://${PROTECT_DATA_CLIENT}.protectdata.app/auth/redefine-password?email=${email}&code=${code}`
      }
    ];

    for (let v of vars) {
      html = html.replace(new RegExp(v.var, "g"), v.value);
    }

    // SEND SMTP MAIL
    const transporter = await smtpEmail({
      host: "smtp-mail.outlook.com",
      port: 587,
      user: "enviosprotecdata@outlook.com",
      pass: "b$DsB4EdfH=H'a6"
    });
    const sent = await transporter.sendMail({
      from: "Protect Data <enviosprotecdata@outlook.com>",
      to: email,
      subject: "Redefinição de Senha",
      html: html
    });
    console.log(`Mail sent to ${email}`, sent);

    return { ...sent };
  } catch (error) {
    console.log("sendWelcomeMailError", error);
    throw new Error("Failed to send mail");
  }
};
