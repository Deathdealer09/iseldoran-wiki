/** Static marketing content (features, AI assistants, pricing). */

export const FEATURES = [
  { icon: "🎙️", title: "Voice Booking", body: "Customers book by speaking naturally — the AI understands and schedules it." },
  { icon: "🤖", title: "5 AI Assistants", body: "A full AI team handling bookings, chat, reminders, CRM and growth." },
  { icon: "💬", title: "WhatsApp AI Agent", body: "An AI agent books and confirms right inside WhatsApp — where T&T lives." },
  { icon: "📇", title: "Customer Database", body: "Built-in CRM remembers every client, visit and preference." },
  { icon: "✉️", title: "Email & WhatsApp Confirmations", body: "Instant confirmations the moment a booking is made." },
  { icon: "⏰", title: "24hr Reminders", body: "Automatic reminders slash no-shows and keep calendars full." },
];

export const AI_ASSISTANTS = [
  { n: "AI 01", em: "📅", title: "Booking Assistant", body: "Captures appointments by chat & voice" },
  { n: "AI 02", em: "💬", title: "WhatsApp Agent", body: "Handles WhatsApp conversations → bookings" },
  { n: "AI 03", em: "⏰", title: "Reminder Assistant", body: "Sends 24hr reminders, cuts no-shows" },
  { n: "AI 04", em: "📇", title: "CRM Assistant", body: "Tags repeat clients, summarises history" },
  { n: "AI 05", em: "📈", title: "Growth Assistant", body: "Re-engagement, promos & review requests" },
];

export const PLANS = [
  {
    name: "Starter",
    price: 99,
    popular: false,
    features: ["Online booking page", "Email confirmations", "Up to 100 bookings/mo", "1 staff member", "Customer database"],
  },
  {
    name: "Growth",
    price: 249,
    popular: true,
    features: ["Everything in Starter", "WhatsApp AI Agent", "24hr WhatsApp reminders", "5 AI assistants", "Up to 5 staff", "Unlimited bookings"],
  },
  {
    name: "Pro",
    price: 499,
    popular: false,
    features: ["Everything in Growth", "AI Voice Booking", "Growth & marketing AI", "Multi-location", "Priority support", "Custom branding"],
  },
];

export function money(n: number): string {
  return "TT$" + n.toLocaleString("en-US");
}
