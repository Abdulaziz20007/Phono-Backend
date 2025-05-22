import { v4 as uuidv4 } from 'uuid';

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
  const token = checkTokenExp(TOKEN);
  if (!token) {
    const newToken = await loginEskiz();
    TOKEN = newToken;
  }
  const formData = new FormData();
  formData.append('mobile_phone', phone);
  formData.append('message', `Your verification code is: ${otp}`);
  formData.append('from', '4546');

  const response = await fetch('notify.eskiz.uz/api/message/sms/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
    body: formData,
  });

  return response.json();
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
