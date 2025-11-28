// src/app/utils/jwt.ts

export function decodeJwt(token: string): any {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid JWT format');
    }
    // JWT payload is base64url encoded, not base64
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    // Pad with '=' if necessary
    const padded = base64.padEnd(base64.length + (4 - base64.length % 4) % 4, '=');
    const decoded = atob(padded);
    return JSON.parse(decoded);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return {};
  }
}
