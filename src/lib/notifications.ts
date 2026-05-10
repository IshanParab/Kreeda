import nodemailer from "nodemailer";

interface CompetitionNotificationInput {
  title: string;
  sport: string;
  location: string;
  eventDate: string;
  sourceLink?: string;
}

export async function sendCompetitionNotification(
  payload: CompetitionNotificationInput
) {
  const to = process.env.NOTIFICATION_TO_EMAILS;
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || "587");
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM || user;

  if (!to || !host || !user || !pass || !from || Number.isNaN(port)) {
    return;
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  await transporter.sendMail({
    from,
    to,
    subject: `New Competition: ${payload.title}`,
    text: `A new ${payload.sport} competition was added.\n\nTitle: ${payload.title}\nLocation: ${payload.location}\nDate: ${payload.eventDate}\n${payload.sourceLink ? `Source: ${payload.sourceLink}` : ""}`,
  });
}
