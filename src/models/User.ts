import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  name?: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
  // Onboarding fields
  age?: number;
  height?: number; // in cm
  weight?: number; // in kg
  bmi?: number;
  bodyType?: string;
  experienceLevel?: string;
  sportPreferences?: string[];
  trainingPlan?: string;
}

const UserSchema: Schema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String },
    image: { type: String },

    age: { type: Number },
    height: { type: Number },
    weight: { type: Number },
    bmi: { type: Number },
    bodyType: { type: String },
    experienceLevel: { type: String },
    sportPreferences: { type: [String] },
    trainingPlan: { type: String },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
