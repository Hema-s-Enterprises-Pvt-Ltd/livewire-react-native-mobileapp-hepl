
import { Buffer } from 'buffer';

function base64UrlToBase64(base64Url) {
    return base64Url.replace(/-/g, '+').replace(/_/g, '/');
  }

  function decodeBase64(base64String) {
      return Buffer.from(base64String, 'base64').toString('utf-8');
  }

  export function parseJwt(token) {
      const parts = token.split('.');
      if (parts.length !== 3) {
          throw new Error('Invalid JWT token');
      }

      const [headerBase64, payloadBase64] = parts;
      const header = JSON.parse(decodeBase64(base64UrlToBase64(headerBase64)));
      const payload = JSON.parse(decodeBase64(base64UrlToBase64(payloadBase64)));

      return { header, payload };
  }