import jwt from 'jsonwebtoken';

export function generateToken(secretKey, tokenPayload) {
  if (!secretKey || !tokenPayload) throw new Error('secretKey and tokenPayload required');
  return jwt.sign(tokenPayload, secretKey);
}

export async function verifyJwtToken(secretKey, bearerToken) {
  if (!secretKey) throw new Error('secretKey param required');
  if (!bearerToken) throw new Error('No token provided.');

  const token = bearerToken.split(' ')[1];
  const decodedToken = await jwt.verify(token, secretKey);

  return { decodedToken, token };
}
