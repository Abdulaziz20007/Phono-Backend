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
