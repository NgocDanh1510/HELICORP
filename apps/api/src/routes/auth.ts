import { Router } from "express";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { User, type UserDocument } from "../models/User";
import { RefreshToken } from "../models/RefreshToken";
import { authMiddleware, type AuthenticatedRequest } from "../middlewares/auth";

const router = Router();

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters")
});

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required")
});

const tokenSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token is required")
});

function generateAccessToken(user: any): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is missing");
  }
  return jwt.sign(
    { userId: user._id, email: user.email },
    secret,
    { expiresIn: (process.env.ACCESS_TOKEN_EXPIRE || "15m") as any }
  );
}

async function generateAndSaveRefreshToken(userId: string): Promise<string> {
  const token = crypto.randomBytes(40).toString("hex");
  const days = Number(process.env.REFRESH_TOKEN_EXPIRE_DAYS || 7);
  const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);

  await RefreshToken.create({
    token,
    userId,
    expiresAt
  });

  return token;
}

// @route   POST /api/auth/register
// @desc    Register a new user
router.post("/register", async (req, res, next) => {
  try {
    const data = registerSchema.parse(req.body);

    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      res.status(400).json({ message: "Email has already been registered." });
      return;
    }

    const user = await User.create({
      name: data.name,
      email: data.email,
      password: data.password
    });

    const accessToken = generateAccessToken(user);
    const refreshToken = await generateAndSaveRefreshToken(user._id.toString());

    res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      },
      accessToken,
      refreshToken
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/auth/login
// @desc    Login user & get tokens
router.post("/login", async (req, res, next) => {
  try {
    const data = loginSchema.parse(req.body);

    const user = await User.findOne({ email: data.email }) as UserDocument | null;
    if (!user) {
      res.status(400).json({ message: "Invalid email or password" });
      return;
    }

    const isMatch = await user.comparePassword(data.password);
    if (!isMatch) {
      res.status(400).json({ message: "Invalid email or password" });
      return;
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = await generateAndSaveRefreshToken(user._id.toString());

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      },
      accessToken,
      refreshToken
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/auth/refresh
// @desc    Get new access token using refresh token
router.post("/refresh", async (req, res, next) => {
  try {
    const data = tokenSchema.parse(req.body);

    const dbToken = await RefreshToken.findOne({ token: data.refreshToken });
    if (!dbToken) {
      res.status(401).json({ message: "Invalid refresh token", code: "INVALID_REFRESH_TOKEN" });
      return;
    }

    if (new Date() > dbToken.expiresAt) {
      await RefreshToken.deleteOne({ _id: dbToken._id });
      res.status(401).json({ message: "Refresh token expired", code: "REFRESH_TOKEN_EXPIRED" });
      return;
    }

    const user = await User.findById(dbToken.userId);
    if (!user) {
      res.status(401).json({ message: "User not found", code: "USER_NOT_FOUND" });
      return;
    }

    const accessToken = generateAccessToken(user);

    // Keep using the same refresh token (no rotation as requested)
    res.json({
      accessToken,
      refreshToken: data.refreshToken
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/auth/logout
// @desc    Logout user & revoke refresh token
router.post("/logout", async (req, res, next) => {
  try {
    const data = tokenSchema.parse(req.body);

    await RefreshToken.deleteOne({ token: data.refreshToken });

    res.json({ status: "ok", message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/auth/me
// @desc    Get logged in user details
router.get("/me", authMiddleware as any, async (req: AuthenticatedRequest, res, next) => {
  try {
    const user = await User.findById(req.user?.id).select("-password");
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/auth/favorites
// @desc    Get populated list of user's favorite products
router.get("/favorites", authMiddleware as any, async (req: AuthenticatedRequest, res, next) => {
  try {
    const user = await User.findById(req.user?.id).populate("favoriteProducts");
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.json({ favorites: user.favoriteProducts || [] });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/auth/favorites
// @desc    Toggle favorite product status
router.post("/favorites", authMiddleware as any, async (req: AuthenticatedRequest, res, next) => {
  try {
    const { productId } = z.object({ productId: z.string() }).parse(req.body);
    const user = await User.findById(req.user?.id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    if (!user.favoriteProducts) {
      user.favoriteProducts = [] as any;
    }

    const index = user.favoriteProducts.indexOf(productId as any);
    if (index > -1) {
      user.favoriteProducts.splice(index, 1);
    } else {
      user.favoriteProducts.push(productId as any);
    }

    await user.save();
    const populatedUser = await User.findById(user._id).populate("favoriteProducts");
    res.json({ favorites: populatedUser?.favoriteProducts || [] });
  } catch (error) {
    next(error);
  }
});

export default router;
