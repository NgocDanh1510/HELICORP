import "dotenv/config";
import cors from "cors";
import express, { type ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { connectDatabase } from "./config/db";
import cartRouter from "./routes/cart";
import newsletterRouter from "./routes/newsletter";
import ordersRouter from "./routes/orders";
import productsRouter from "./routes/products";

const app = express();
const port = Number(process.env.PORT || 4000);
const corsOrigin = process.env.CORS_ORIGIN || "http://localhost:3000";

app.use(cors({ origin: corsOrigin, credentials: true }));
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "helicorp-api" });
});

app.use("/api/products", productsRouter);
app.use("/api/cart", cartRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/newsletter", newsletterRouter);

const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof ZodError) {
    res.status(400).json({ message: "Validation failed", issues: error.flatten() });
    return;
  }

  console.error(error);
  res.status(500).json({ message: "Internal server error" });
};

app.use(errorHandler);

connectDatabase()
  .then(() => {
    app.listen(port, () => {
      console.log(`API listening on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to start API", error);
    process.exit(1);
  });
