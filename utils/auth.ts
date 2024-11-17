// Function to generate a random hash using Web Crypto API
export const randomHash = async () => {
  const array = new Uint8Array(128);
  crypto.getRandomValues(array);
  return btoa(String.fromCharCode(...array));
};

// Function to hash a password using Web Crypto API
export const hashPassword = async (salt: string, password: string) => {
  const SECRET = process.env.SALT_SECRET_KEY ?? "defaultvalue";

  const encoder = new TextEncoder();
  /*
    salt makes the hash unique per user, and the SECRET provides an additional layer of security 
    by ensuring that only the server can generate or verify the password hashes correctly
    */
  const data = encoder.encode([salt, password].join("/"));
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, data);
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
};
