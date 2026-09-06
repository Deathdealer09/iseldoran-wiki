export type Channel = "web" | "whatsapp" | "voice";
export type BookingStatus = "confirmed" | "pending" | "cancelled";

export interface Service {
  id: string;
  name: string;
  durationMins: number;
  price: number; // TTD
  description: string;
}

export interface Booking {
  id: string;
  day: string; // "Today" | "Tomorrow" | "Wed" | "Thu"  (demo horizon)
  time: string; // "14:30"
  customerName: string;
  customerPhone: string;
  serviceId: string;
  serviceName: string;
  price: number;
  channel: Channel;
  status: BookingStatus;
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  visits: number;
  lastVisit: string;
  tag: "VIP" | "Regular" | "New";
}

export interface Assistant {
  id: string;
  emoji: string;
  name: string;
  role: string;
  enabled: boolean;
}

export interface Business {
  name: string;
  location: string;
  timezone: string;
  openHour: number; // 9
  closeHour: number; // 17
  slotMins: number; // 45
}

export interface Store {
  business: Business;
  services: Service[];
  bookings: Booking[];
  customers: Customer[];
  assistants: Assistant[];
}
