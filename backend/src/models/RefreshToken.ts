import { Schema, model, models, type InferSchemaType } from "mongoose";

const refreshTokenSchema = new Schema(
  {
    token: { type: String, required: true, unique: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    expiresAt: { type: Date, required: true }
  },
  { timestamps: true }
);

export type RefreshTokenDocument = InferSchemaType<typeof refreshTokenSchema> & {
  _id: Schema.Types.ObjectId;
};

export const RefreshToken = models.RefreshToken || model("RefreshToken", refreshTokenSchema);
