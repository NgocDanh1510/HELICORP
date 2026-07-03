import { Schema, model, models, type InferSchemaType } from "mongoose";

const cartItemSchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    image: { type: String },
    color: { type: String, required: true },
    storage: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1, default: 1 }
  },
  { timestamps: true }
);

const cartSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true, index: true },
    items: [cartItemSchema]
  },
  { timestamps: true }
);

export type CartDocument = InferSchemaType<typeof cartSchema>;

export const Cart = models.Cart || model("Cart", cartSchema);
