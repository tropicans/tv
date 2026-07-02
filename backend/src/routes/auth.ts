import { Router, Request, Response, NextFunction } from "express";
import crypto from "crypto";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "setneg-corporate-tv-secret-key-123456";

export function signToken(payload: any): string {
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", JWT_SECRET)
    .update(`${header}.${data}`)
    .digest("base64url");
  return `${header}.${data}.${signature}`;
}

export function verifyToken(token: string): any {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const [header, data, signature] = parts;
    const expectedSignature = crypto
      .createHmac("sha256", JWT_SECRET)
      .update(`${header}.${data}`)
      .digest("base64url");
    if (signature !== expectedSignature) return null;
    
    const payload = JSON.parse(Buffer.from(data, "base64url").toString("utf8"));
    if (payload.exp && Date.now() > payload.exp) {
      return null;
    }
    return payload;
  } catch (e) {
    return null;
  }
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ status: "error", message: "Unauthorized: Missing token" });
    return;
  }
  const token = authHeader.split(" ")[1];
  if (!token) {
    res.status(401).json({ status: "error", message: "Unauthorized: Missing token payload" });
    return;
  }
  const payload = verifyToken(token);
  if (!payload) {
    res.status(401).json({ status: "error", message: "Unauthorized: Invalid or expired token" });
    return;
  }
  (req as any).user = payload;
  next();
}

// 0. Public Auth Config
router.get("/config", (req: Request, res: Response) => {
  res.json({
    googleClientId: process.env.GOOGLE_CLIENT_ID || null
  });
});

// 1. Passwordless Admin Email Login
router.post("/login", async (req: Request, res: Response) => {
  const { email } = req.body;
  
  const adminEmails = (process.env.ADMIN_GOOGLE_EMAIL || "admin@example.com")
    .split(",")
    .map(e => e.toLowerCase().trim())
    .filter(Boolean);
  
  if (!email) {
    res.status(400).json({ status: "error", message: "Email wajib diisi" });
    return;
  }

  const cleanEmail = email.toLowerCase().trim();
  if (adminEmails.includes(cleanEmail)) {
    const token = signToken({
      email: cleanEmail,
      exp: Date.now() + 24 * 60 * 60 * 1000 // 24 Hours
    });
    res.json({ status: "success", token });
  } else {
    res.status(401).json({ status: "error", message: "Email tidak terdaftar sebagai Admin" });
  }
});

// 2. Google OAuth ID Token Verification Login
router.post("/google-login", async (req: Request, res: Response) => {
  const { idToken } = req.body;
  const adminEmails = (process.env.ADMIN_GOOGLE_EMAIL || "admin@example.com")
    .split(",")
    .map(e => e.toLowerCase().trim())
    .filter(Boolean);

  if (!idToken) {
    res.status(400).json({ status: "error", message: "ID Token Google wajib disertakan" });
    return;
  }

  try {
    // Call Google's token verification API
    const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`);
    if (!response.ok) {
      res.status(401).json({ status: "error", message: "Token Google tidak valid" });
      return;
    }

    const payload = await response.json();
    const googleEmail = (payload.email || "").toLowerCase().trim();
    const isEmailVerified = payload.email_verified === "true" || payload.email_verified === true;

    if (!isEmailVerified) {
      res.status(401).json({ status: "error", message: "Email Google belum terverifikasi" });
      return;
    }

    if (adminEmails.includes(googleEmail)) {
      const token = signToken({
        email: googleEmail,
        exp: Date.now() + 24 * 60 * 60 * 1000 // 24 Hours
      });
      res.json({ status: "success", token });
    } else {
      res.status(401).json({ status: "error", message: `Email ${googleEmail} tidak terdaftar sebagai Admin` });
    }
  } catch (error: any) {
    console.error("[Auth] Google verification failed:", error);
    res.status(500).json({ status: "error", message: "Gagal memverifikasi token Google" });
  }
});

// 3. Get Current User Status
router.get("/me", async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ status: "error", message: "Unauthorized" });
    return;
  }
  const token = authHeader.split(" ")[1];
  if (!token) {
    res.status(401).json({ status: "error", message: "Unauthorized" });
    return;
  }
  const payload = verifyToken(token);
  if (!payload) {
    res.status(401).json({ status: "error", message: "Session expired" });
    return;
  }

  res.json({
    status: "success",
    email: payload.email,
    googleClientId: process.env.GOOGLE_CLIENT_ID || null
  });
});

export default router;
