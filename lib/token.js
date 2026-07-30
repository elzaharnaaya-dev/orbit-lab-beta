import { SignJWT, jwtVerify } from 'jose';

function key() {
  const secret = process.env.DOWNLOAD_SIGNING_SECRET;
  if (!secret) throw new Error('DOWNLOAD_SIGNING_SECRET is missing');
  return new TextEncoder().encode(secret);
}

export async function createDownloadToken(payload, expiresIn = '7d') {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(key());
}

export async function verifyDownloadToken(token) {
  const { payload } = await jwtVerify(token, key());
  return payload;
}
