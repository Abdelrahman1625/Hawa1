import nodemailer from "nodemailer";

interface EmailOptions {
  email: string;
  subject: string;
  template: string;
  data: Record<string, any>;
}

export const sendEmail = async (options: EmailOptions): Promise<void> => {
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: options.email,
    subject: options.subject,
    html: `<p>${options.template}</p>`, // Replace with actual template rendering logic
  };

  await transporter.sendMail(mailOptions);
};
