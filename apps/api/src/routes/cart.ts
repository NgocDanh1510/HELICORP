import { Router } from "express";
import { z } from "zod";
import { Cart } from "../models/Cart";

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

router.get("/:sessionId", async (req, res, next) => {
  try {
    const cart = await Cart.findOneAndUpdate(
      { sessionId: req.params.sessionId },
      { $setOnInsert: { sessionId: req.params.sessionId, items: [] } },
      { new: true, upsert: true }
    );

    res.json({ cart });
  } catch (error) {
    next(error);
  }
});

router.post("/:sessionId/items", async (req, res, next) => {
  try {
    const item = addItemSchema.parse(req.body);
    const cart = await Cart.findOneAndUpdate(
      { sessionId: req.params.sessionId },
      { $setOnInsert: { sessionId: req.params.sessionId, items: [] } },
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

router.put("/:sessionId/items/:itemId", async (req, res, next) => {
  try {
    const data = updateItemSchema.parse(req.body);
    const cart = await Cart.findOne({ sessionId: req.params.sessionId });

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

router.delete("/:sessionId/items/:itemId", async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ sessionId: req.params.sessionId });

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
