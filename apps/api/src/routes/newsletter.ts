import { Router } from "express";
import { z } from "zod";
import { NewsletterSubscriber } from "../models/NewsletterSubscriber";

const router = Router();

const newsletterSchema = z.object({
  email: z.string().email()
});

router.post("/", async (req, res, next) => {
  try {
    const { email } = newsletterSchema.parse(req.body);
    const subscriber = await NewsletterSubscriber.findOneAndUpdate(
      { email },
      { email },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.status(201).json({ subscriberId: subscriber._id, email: subscriber.email });
  } catch (error) {
    next(error);
  }
});

export default router;
