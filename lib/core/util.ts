export function getCrypto() {
  // Native crypto from window (Browser)
  if (typeof window !== 'undefined' && window.crypto) {
    return window.crypto;
  }

  // Native crypto in web worker (Browser)
  if (typeof self !== 'undefined' && self.crypto) {
    return self.crypto;
  }
  return null;
}

/**
 * Cryptographically secure pseudorandom number generator
 *
 * As Math.random() is cryptographically not safe to use
 */
export function cryptoSecureRandomInt() {
  const crypto = getCrypto();
  if (crypto) {
    // Use getRandomValues method (Browser)
    if (typeof crypto.getRandomValues === 'function') {
      try {
        return crypto.getRandomValues(new Uint32Array(1))[0];
      } catch (err) {}
    }
  }

  throw new Error(
    'Native crypto module could not be used to get secure random number.'
  );
}
