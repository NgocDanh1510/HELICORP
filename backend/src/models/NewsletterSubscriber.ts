import { Schema, model, models, type InferSchemaType } from "mongoose";

const newsletterSubscriberSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, index: true, lowercase: true, trim: true }
  },
  { timestamps: true }
);

export type NewsletterSubscriberDocument = InferSchemaType<typeof newsletterSubscriberSchema>;

export const NewsletterSubscriber =
  models.NewsletterSubscriber || model("NewsletterSubscriber", newsletterSubscriberSchema);
