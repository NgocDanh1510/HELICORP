import { Schema, model, models, type InferSchemaType } from "mongoose";

const productSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    description: { type: String, required: true },
    images: [{ type: String, required: true }],
    specs: {
      display: { type: String, required: true },
      chip: { type: String, required: true },
      camera: { type: String, required: true },
      battery: { type: String, required: true },
      material: { type: String, required: true }
    },
    colors: [{ type: String, required: true }],
    storageOptions: [{ type: String, required: true }],
    category: { type: String, required: true, index: true },
    brand: { type: String, required: true, index: true, trim: true }
  },
  { timestamps: true }
);

export type ProductDocument = InferSchemaType<typeof productSchema>;

export const Product = models.Product || model("Product", productSchema);
