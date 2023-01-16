import * as bcrypt from 'bcryptjs';

export function socialRegisterValidation(data) {
  const requiredKeys = ['providerId', 'providerName', 'username', 'email', 'avatar'];
  const inputs = Object.keys(data);
  let match = false;
  requiredKeys.forEach(key => {
    if (inputs.some(input => key == input)) {
      match = true;
    } else {
      match = false;
    }
  });
  return match;
}

export async function comparePasswords(hashPassword: string, password: string): Promise<Boolean> {
  return await bcrypt.compareSync(hashPassword, password);
}
