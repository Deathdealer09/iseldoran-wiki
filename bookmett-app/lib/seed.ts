import type { Store } from "./types";

/** Initial seed used the first time the datastore is created. */
export function seedStore(): Store {
  return {
    business: {
      name: "Kelly's Studio",
      location: "Port of Spain",
      timezone: "America/Port_of_Spain",
      openHour: 9,
      closeHour: 17,
      slotMins: 45,
    },
    services: [
      { id: "haircut", name: "Signature Haircut", durationMins: 45, price: 120, description: "Cut, wash & style" },
      { id: "color", name: "Colour & Treatment", durationMins: 120, price: 450, description: "Full colour + deep condition" },
      { id: "beard", name: "Beard Grooming", durationMins: 30, price: 80, description: "Trim, line-up & hot towel" },
      { id: "facial", name: "Express Facial", durationMins: 60, price: 300, description: "Cleanse, exfoliate & mask" },
    ],
    bookings: [
      mk("b1", "Today", "14:30", "Aaliyah Ramnarine", "868-555-0142", "color", "whatsapp", "confirmed"),
      mk("b2", "Today", "15:15", "Marcus Baptiste", "868-555-0198", "haircut", "voice", "confirmed"),
      mk("b3", "Today", "16:00", "Priya Maharaj", "868-555-0176", "facial", "web", "pending"),
      mk("b4", "Tomorrow", "09:45", "Kwame Alexander", "868-555-0110", "beard", "whatsapp", "confirmed"),
      mk("b5", "Tomorrow", "11:15", "Simone Charles", "868-555-0155", "haircut", "web", "confirmed"),
    ],
    customers: [
      { id: "c1", name: "Aaliyah Ramnarine", phone: "868-555-0142", visits: 12, lastVisit: "2 wks ago", tag: "VIP" },
      { id: "c2", name: "Marcus Baptiste", phone: "868-555-0198", visits: 8, lastVisit: "1 mo ago", tag: "Regular" },
      { id: "c3", name: "Priya Maharaj", phone: "868-555-0176", visits: 3, lastVisit: "New", tag: "New" },
      { id: "c4", name: "Kwame Alexander", phone: "868-555-0110", visits: 21, lastVisit: "1 wk ago", tag: "VIP" },
    ],
    assistants: [
      { id: "a1", emoji: "📅", name: "Booking Assistant", role: "Books via chat + voice", enabled: true },
      { id: "a2", emoji: "💬", name: "WhatsApp Agent", role: "Live on WhatsApp", enabled: true },
      { id: "a3", emoji: "⏰", name: "Reminder Assistant", role: "24hr reminders + nudges", enabled: true },
      { id: "a4", emoji: "📇", name: "CRM Assistant", role: "Insights on every client", enabled: true },
      { id: "a5", emoji: "📈", name: "Growth Assistant", role: "Win-backs & promos", enabled: false },
    ],
  };
}

const SERVICE_MAP: Record<string, { name: string; price: number }> = {
  haircut: { name: "Signature Haircut", price: 120 },
  color: { name: "Colour & Treatment", price: 450 },
  beard: { name: "Beard Grooming", price: 80 },
  facial: { name: "Express Facial", price: 300 },
};

function mk(
  id: string, day: string, time: string, name: string, phone: string,
  serviceId: string, channel: any, status: any,
) {
  const s = SERVICE_MAP[serviceId];
  return {
    id, day, time, customerName: name, customerPhone: phone,
    serviceId, serviceName: s.name, price: s.price,
    channel, status, createdAt: "seed",
  };
}
