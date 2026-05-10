import mongoose, { Schema, Document } from 'mongoose';

export interface IArticle extends Document {
  title: string;
  link: string;
  source: string;
  pubDate: Date;
  type: string;
  sportCategory?: string;
  createdAt: Date;
}

const ArticleSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    link: { type: String, required: true, unique: true },
    source: { type: String, required: true },
    pubDate: { type: Date, required: true },
    type: { type: String, required: true }, // e.g., 'goa_local', 'general'
    sportCategory: { type: String }, // e.g., 'football', 'badminton'
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Article || mongoose.model<IArticle>('Article', ArticleSchema);
