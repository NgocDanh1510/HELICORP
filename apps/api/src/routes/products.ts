import { Router } from "express";
import { Product } from "../models/Product";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const category = typeof req.query.category === "string" ? req.query.category : undefined;
    const products = await Product.find(category ? { category } : {}).sort({ createdAt: -1 });

    res.json({ products });
  } catch (error) {
    next(error);
  }
});

router.get("/:slug", async (req, res, next) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });

    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    res.json({ product });
  } catch (error) {
    next(error);
  }
});

export default router;
