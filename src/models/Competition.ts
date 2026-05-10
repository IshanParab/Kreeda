import mongoose, { Document, Schema } from "mongoose";

export interface ICompetition extends Document {
  title: string;
  description?: string;
  sport: string;
  location: string;
  eventDate: Date;
  sourceLink?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const CompetitionSchema = new Schema<ICompetition>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    sport: { type: String, required: true, trim: true, index: true },
    location: { type: String, required: true, trim: true },
    eventDate: { type: Date, required: true, index: true },
    sourceLink: { type: String, trim: true },
    createdBy: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Competition ||
  mongoose.model<ICompetition>("Competition", CompetitionSchema);
