import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import dbConnect from "@/lib/mongoose";
import Competition from "@/models/Competition";
import { sendCompetitionNotification } from "@/lib/notifications";

async function ensureAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email || !session.user.isAdmin) {
    return null;
  }
  return session.user.email;
}

export async function GET() {
  const adminEmail = await ensureAdmin();
  if (!adminEmail) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await dbConnect();
  const competitions = await Competition.find({})
    .sort({ eventDate: 1, createdAt: -1 })
    .lean();

  return NextResponse.json({ competitions });
}

export async function POST(req: Request) {
  const adminEmail = await ensureAdmin();
  if (!adminEmail) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const { title, description, sport, location, eventDate, sourceLink } = body;
  if (!title || !sport || !location || !eventDate) {
    return NextResponse.json(
      { error: "title, sport, location and eventDate are required" },
      { status: 400 }
    );
  }

  await dbConnect();
  const competition = await Competition.create({
    title,
    description,
    sport,
    location,
    eventDate: new Date(eventDate),
    sourceLink,
    createdBy: adminEmail,
  });

  try {
    await sendCompetitionNotification({
      title,
      sport,
      location,
      eventDate,
      sourceLink,
    });
  } catch (error) {
    console.error("Competition notification failed:", error);
  }

  return NextResponse.json({ competition }, { status: 201 });
}

export async function DELETE(req: Request) {
  const adminEmail = await ensureAdmin();
  if (!adminEmail) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  await dbConnect();
  await Competition.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
