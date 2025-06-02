import bcryptjs from 'bcryptjs';

export const hashPassword = async (value: string, saltRounds: number = 10) =>
  await bcryptjs.hash(value, saltRounds);

export const comparePassword = async (value: string, hashedPassword: string) =>
  await bcryptjs.compare(value, hashedPassword);
