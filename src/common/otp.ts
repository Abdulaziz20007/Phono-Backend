import { v4 as uuidv4 } from 'uuid';
import nodemailer from 'nodemailer';

export function generateOtp(): object {
  const min = 100000;
  const max = 999999;

  const otp = Math.floor(min + Math.random() * (max - min + 1)).toString();
  const expire = new Date(Date.now() + 1000 * 60 * 5);
  const uuid = uuidv4();

  return {
    otp,
    expire,
    uuid,
  };
}

let TOKEN = '';

export async function sendOtp(phone: string, otp: string) {
  // const token = checkTokenExp(TOKEN);
  // if (!token) {
  //   const newToken = await loginEskiz();
  //   TOKEN = newToken;
  // }
  // const formData = new FormData();
  // formData.append('mobile_phone', phone);
  // formData.append('message', `Your verification code is: ${otp}`);
  // formData.append('from', '4546');

  // const response = await fetch('notify.eskiz.uz/api/message/sms/send', {
  //   method: 'POST',
  //   headers: {
  //     Authorization: `Bearer ${TOKEN}`,
  //   },
  //   body: formData,
  // });

  // return response.json();

  return console.log(otp);
}

async function loginEskiz() {
  const formData = new FormData();
  formData.append('email', process.env.ESKIZ_EMAIL!);
  formData.append('password', process.env.ESKIZ_PASSWORD!);

  const response = await fetch('notify.eskiz.uz/api/auth/login', {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();
  return data.data.token;
}

async function checkTokenExp(token: string) {
  if (!token) {
    return false;
  }
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp > Date.now() / 1000;
  } catch {
    return false;
  }
}

export async function sendEmail(email: string, uuid: string) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: email,
    subject: 'Email Verification',
    text: '',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h2 style="color: #2c3e50; text-align: center; margin-bottom: 20px;">Welcome to Our Platform!</h2>
        <p style="color: #34495e; text-align: center; margin-bottom: 30px;">Please verify your email address by clicking the button below</p>
        <div style="text-align: center;">
          <a href="${process.env.BASE_URL}/email/verify/${uuid}" 
             style="display: inline-block; background-color: #3498db; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; text-transform: uppercase; transition: background-color 0.3s ease;">
             Verify Email
          </a>
        </div>
        <p style="color: #7f8c8d; text-align: center; margin-top: 30px; font-size: 12px;">
          If you didn't request this verification, please ignore this email.
        </p>
      </div>
    `,
  });
}
