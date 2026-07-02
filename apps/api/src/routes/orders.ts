import { Router } from "express";
import { z } from "zod";
import { Cart } from "../models/Cart";
import { Order } from "../models/Order";

const router = Router();

const checkoutSchema = z.object({
  sessionId: z.string().min(1),
  customerName: z.string().min(2),
  phone: z.string().min(8),
  address: z.string().min(5)
});

type CartOrderItem = {
  productId: unknown;
  name: string;
  price: number;
  image?: string;
  color: string;
  storage: string;
  quantity: number;
};

router.post("/", async (req, res, next) => {
  try {
    const data = checkoutSchema.parse(req.body);
    const cart = await Cart.findOne({ sessionId: data.sessionId });

    if (!cart || cart.items.length === 0) {
      res.status(400).json({ message: "Cart is empty" });
      return;
    }

    const items = cart.items.map((item: CartOrderItem) => ({
      productId: item.productId,
      name: item.name,
      price: item.price,
      image: item.image,
      color: item.color,
      storage: item.storage,
      quantity: item.quantity
    }));
    const totalPrice = items.reduce((sum: number, item: CartOrderItem) => sum + item.price * item.quantity, 0);

    const order = await Order.create({
      sessionId: data.sessionId,
      customerName: data.customerName,
      phone: data.phone,
      address: data.address,
      items,
      totalPrice
    });

    await Cart.deleteOne({ sessionId: data.sessionId });

    res.status(201).json({ orderId: order._id, order });
  } catch (error) {
    next(error);
  }
});

export default router;
