import mongoose, { Schema, Document } from 'mongoose';

export interface ICompetition extends Document {
  title: string;
  description?: string;
  sport: string;
  date?: string;
  location?: string;
  sourceLink?: string;
  isAiGenerated: boolean;
  status: string; // e.g., 'pending', 'approved', 'rejected'
  createdAt: Date;
}

const CompetitionSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    sport: { type: String, required: true },
    date: { type: String },
    location: { type: String },
    sourceLink: { type: String },
    isAiGenerated: { type: Boolean, default: false },
    status: { type: String, default: 'pending', enum: ['pending', 'approved', 'rejected'] },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Competition || mongoose.model<ICompetition>('Competition', CompetitionSchema);
