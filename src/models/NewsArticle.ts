import mongoose, { Document, Schema } from "mongoose";

export interface INewsArticle extends Document {
  title: string;
  link: string;
  source: string;
  pubDate?: Date;
  type: "general" | "goa_local";
  sport: string;
  scrapedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const NewsArticleSchema = new Schema<INewsArticle>(
  {
    title: { type: String, required: true },
    link: { type: String, required: true, unique: true, index: true },
    source: { type: String, required: true },
    pubDate: { type: Date },
    type: { type: String, enum: ["general", "goa_local"], required: true },
    sport: { type: String, default: "General", index: true },
    scrapedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.models.NewsArticle ||
  mongoose.model<INewsArticle>("NewsArticle", NewsArticleSchema);
