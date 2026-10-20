/** FNV-1a offset basis and prime: a tiny, well-known string hash with good spread for short keys. */
const FNV_OFFSET_BASIS = 2166136261;
const FNV_PRIME = 16777619;

/** Deterministic, non-cryptographic 32-bit hash used for sample data and readable references. */
export function hashText(text: string): number {
  let hash = FNV_OFFSET_BASIS;

  for (const character of text) {
    hash ^= character.codePointAt(0) ?? 0;
    hash = Math.imul(hash, FNV_PRIME);
  }

  const unsignedHash = hash >>> 0;

  return unsignedHash;
}
