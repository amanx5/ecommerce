import crypto from "node:crypto";

const HASHING_DELIMITER = ":";

function createHash(pass: string, salt: string) {
  return crypto.scryptSync(pass, salt, 64).toString("hex");
}

export function hashPassword(inputPassword: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = createHash(inputPassword, salt);

  return [salt, hash].join(HASHING_DELIMITER);
}

export function verifyPassword(
  inputPassword: string,
  hashedPassword: string,
): boolean {
  const [salt, hash] = hashedPassword.split(HASHING_DELIMITER);

  if (!salt || !hash) {
    throw new Error("Stored password hash is invalid.");
  }

  const verifyHash = createHash(inputPassword, salt);

  return crypto.timingSafeEqual(
    Buffer.from(hash, "hex"),
    Buffer.from(verifyHash, "hex"),
  );
}
