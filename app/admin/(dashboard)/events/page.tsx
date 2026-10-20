import { EventsManager } from "@/components/admin/events-manager";
import { getEventsWithStatus } from "@/lib/events/store";

export const dynamic = "force-dynamic";

export default async function AdminEventsPage() {
  const events = await getEventsWithStatus();
  const upcoming = events.filter((event) => event.upcoming);
  const past = events.filter((event) => !event.upcoming);

  return <EventsManager upcoming={upcoming} past={past} />;
}
