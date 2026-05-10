# Kreeda

Kreeda is an AI-powered sports training and community platform designed to help users achieve their fitness goals. It provides personalized training plans, curated sports news, and easy access to government sports schemes.

## Features

- **Authentication:** Secure sign-in using Google via NextAuth.
- **AI Onboarding:** A 5-step interactive onboarding process to capture personal stats (Age, Height, Weight), Body Type, Experience Level, and Sport Preferences.
- **Personalized Training Plans:** Automatically calculates BMI and utilizes the Google Gemini API to generate customized 14-day training plans.
- **Dashboard:** A central hub to view your profile details and your dynamically generated Markdown training plan.
- **Local & National News Feed:** Aggregates top sports headlines from NewsAPI and local Goa sports/event updates via RSS feeds.
- **Automated News Refresh:** Runs a scheduled refresh every 2 hours with deduplication and sport-wise tagging.
- **Schemes & Verification:** Direct links to apply for national initiatives like Khelo India and SAI Schemes, complete with a mocked DigiLocker verification flow for simulated eligibility checks.
- **Admin Dashboard:** Admin-only competition manager with create/delete workflows and optional notifications.

## Tech Stack

- **Framework:** Next.js (App Router) with React and TypeScript
- **Styling:** Tailwind CSS
- **Database:** MongoDB via Mongoose
- **Authentication:** NextAuth.js (Google Provider)
- **AI Integration:** Google Gen AI SDK (`@google/genai`)
- **Other Utilities:** `rss-parser`, `react-markdown`, `node-cron`, `string-similarity`, `nodemailer`

## Prerequisites

Ensure you have the following installed on your machine:
- Node.js (v18 or higher)
- npm or yarn
- A MongoDB database (e.g., MongoDB Atlas)

You will also need valid API keys for:
- Google OAuth (Client ID and Secret)
- Google Gemini API
- NewsAPI (Optional, for national news)

## Getting Started

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd kreeda
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Configure Environment Variables:**

   Create a `.env` file in the root directory and add the necessary environment variables. Refer to the provided keys or the list below:

   ```env
   # Google Auth
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret

   # MongoDB
   MONGO_URI=your_mongodb_connection_string

   # AI APIs
   GEMINI_API_KEY=your_gemini_api_key

   # News API
   NEWS_API_KEY=your_news_api_key

    # NextAuth
    NEXTAUTH_SECRET=a_super_secret_key_for_kreeda
    NEXTAUTH_URL=http://localhost:3000

    # Admin access
    ADMIN_EMAILS=admin@example.com

    # Optional notifications
    NOTIFICATION_TO_EMAILS=committee@example.com
    SMTP_HOST=smtp.example.com
    SMTP_PORT=587
    SMTP_USER=smtp_username
    SMTP_PASS=smtp_password
    SMTP_FROM=kreeda@example.com
    ```

4. **Run the development server:**

   ```bash
   npm run dev &
   ```

5. **Open the application:**

   Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `src/app`: Contains all Next.js route handlers and pages.
- `src/app/api`: Backend API endpoints for authentication, user data, news, and onboarding.
- `src/components`: Reusable UI components like Navigation and AuthProvider.
- `src/lib`: Utility files, including the MongoDB connection setup.
- `src/models`: Mongoose schemas (e.g., `User.ts`).
