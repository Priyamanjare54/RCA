if (!process.env.JWT_SECRET) {
  console.warn('⚠️  WARNING: JWT_SECRET not set in .env — using insecure fallback');
}

/** @type {string} JWT signing secret */
export const JWT_SECRET = process.env.JWT_SECRET || 'rca_super_secret_key_2024';

/** @type {string} JWT token expiration duration */
export const JWT_EXPIRY = '24h';
