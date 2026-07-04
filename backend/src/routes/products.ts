import { Router } from "express";
import { Product } from "../models/Product";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const queryObj: any = {};
    
    // Filter by category (supports comma-separated string)
    if (typeof req.query.category === "string" && req.query.category) {
      queryObj.category = { $in: req.query.category.split(",") };
    }
    
    // Filter by brand (supports comma-separated string)
    if (typeof req.query.brand === "string" && req.query.brand) {
      queryObj.brand = { $in: req.query.brand.split(",") };
    }
    
    // Search keyword in name or description
    const search = req.query.search || req.query.q;
    if (typeof search === "string" && search.trim()) {
      const searchRegex = new RegExp(search.trim(), "i");
      queryObj.$or = [
        { name: searchRegex },
        { description: searchRegex }
      ];
    }

    // Sorting
    let sortObj: any = { createdAt: -1 };
    const sort = req.query.sort;
    if (sort === "price_asc") {
      sortObj = { price: 1 };
    } else if (sort === "price_desc") {
      sortObj = { price: -1 };
    } else if (sort === "newest") {
      sortObj = { createdAt: -1 };
    }

    // Pagination
    const page = Math.max(1, Number(req.query.page || 1));
    const limit = Math.max(1, Number(req.query.limit || 6));
    const skip = (page - 1) * limit;

    const total = await Product.countDocuments(queryObj);
    const products = await Product.find(queryObj)
      .sort(sortObj)
      .skip(skip)
      .limit(limit);

    res.json({
      products,
      total,
      page,
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    next(error);
  }
});

router.get("/filters", async (req, res, next) => {
  try {
    const brands = await Product.distinct("brand");
    const categories = await Product.distinct("category");
    res.json({ brands, categories });
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
