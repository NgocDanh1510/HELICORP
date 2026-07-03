import { Router } from "express";
import { z } from "zod";
import { Cart } from "../models/Cart";
import { authMiddleware, type AuthenticatedRequest } from "../middlewares/auth";

const router = Router();

const addItemSchema = z.object({
  productId: z.string().min(1),
  name: z.string().min(1),
  price: z.number().nonnegative(),
  image: z.string().url().optional(),
  color: z.string().min(1),
  storage: z.string().min(1),
  quantity: z.number().int().min(1).default(1)
});

const updateItemSchema = z.object({
  quantity: z.number().int().min(1)
});

type CartItemSnapshot = {
  productId: { toString(): string };
  color: string;
  storage: string;
};

// Use authMiddleware for all cart endpoints
router.use(authMiddleware as any);

// @route   GET /api/cart
// @desc    Get or create user's cart
router.get("/", async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = req.user?.id;
    const cart = await Cart.findOneAndUpdate(
      { userId },
      { $setOnInsert: { userId, items: [] } },
      { new: true, upsert: true }
    );

    res.json({ cart });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/cart/items
// @desc    Add item to user's cart
router.post("/items", async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = req.user?.id;
    const item = addItemSchema.parse(req.body);
    const cart = await Cart.findOneAndUpdate(
      { userId },
      { $setOnInsert: { userId, items: [] } },
      { new: true, upsert: true }
    );

    const existingItem = cart.items.find(
      (cartItem: CartItemSnapshot) =>
        cartItem.productId.toString() === item.productId &&
        cartItem.color === item.color &&
        cartItem.storage === item.storage
    );

    if (existingItem) {
      existingItem.quantity += item.quantity;
    } else {
      cart.items.push(item);
    }

    await cart.save();
    res.status(201).json({ cart });
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/cart/items/:itemId
// @desc    Update item quantity in user's cart
router.put("/items/:itemId", async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = req.user?.id;
    const data = updateItemSchema.parse(req.body);
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      res.status(404).json({ message: "Cart not found" });
      return;
    }

    const item = cart.items.id(req.params.itemId);

    if (!item) {
      res.status(404).json({ message: "Cart item not found" });
      return;
    }

    item.quantity = data.quantity;
    await cart.save();
    res.json({ cart });
  } catch (error) {
    next(error);
  }
});

// @route   DELETE /api/cart/items/:itemId
// @desc    Remove item from user's cart
router.delete("/items/:itemId", async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = req.user?.id;
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      res.status(404).json({ message: "Cart not found" });
      return;
    }

    cart.items.pull(req.params.itemId);
    await cart.save();
    res.json({ cart });
  } catch (error) {
    next(error);
  }
});

export default router;
