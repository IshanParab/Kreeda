import cron from "node-cron";
import { refreshNewsCache } from "@/lib/newsAggregator";

declare global {
  var __kreedaNewsSchedulerStarted: boolean | undefined;
}

export function ensureNewsSchedulerStarted() {
  if (global.__kreedaNewsSchedulerStarted) return;

  global.__kreedaNewsSchedulerStarted = true;
  void refreshNewsCache().catch((error) =>
    console.error("Initial news refresh failed:", error)
  );

  cron.schedule("0 */2 * * *", () => {
    void refreshNewsCache().catch((error) =>
      console.error("Scheduled news refresh failed:", error)
    );
  });
}
