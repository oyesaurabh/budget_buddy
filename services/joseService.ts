import { jwtVerify, SignJWT } from "jose";

class JoseService {
  private jwtSecret: Uint8Array;
  constructor() {
    // Initialize JWT secret
    this.jwtSecret = new TextEncoder().encode(
      process.env.JWT_SECRET || "your_jwt_secret"
    );
  }
  async verify(sessionToken: string) {
    const { payload } = await jwtVerify(sessionToken, this.jwtSecret);
    return payload;
  }
  async sign(payload: any) {
    return await new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("1d")
      .setIssuedAt()
      .sign(this.jwtSecret);
  }
}
const joseService = new JoseService();
export default joseService;
