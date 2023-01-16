import * as jwt from 'jsonwebtoken';
export function generateAuthToken(user) {
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
  return token;
}
