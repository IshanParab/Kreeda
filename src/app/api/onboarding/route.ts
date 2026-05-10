import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();
    const { age, height, weight, bodyType, experienceLevel, sportPreferences } = data;

    const h = parseFloat(height);
    const w = parseFloat(weight);
    let bmi = 0;
    if (h > 0 && w > 0) {
      bmi = w / Math.pow(h / 100, 2);
    }

    const prompt = `Create a 14-day training plan for a ${age}-year old with a BMI of ${bmi.toFixed(1)}, body type ${bodyType}, experience level ${experienceLevel}, focusing on ${sportPreferences.join(", ")}. Return ONLY the plan in Markdown format, with daily breakdown.`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });

    const trainingPlan = response.text;

    await dbConnect();
    await User.findOneAndUpdate(
      { email: session.user.email },
      {
        age,
        height,
        weight,
        bmi,
        bodyType,
        experienceLevel,
        sportPreferences,
        trainingPlan,
      }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in onboarding:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
