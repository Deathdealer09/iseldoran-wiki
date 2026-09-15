import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BookMeTT — AI Booking & Scheduling",
  description:
    "Caribbean's first fully AI-powered booking platform. Effortless bookings, WhatsApp & voice AI, reminders and a built-in CRM for service businesses in Trinidad & Tobago.",
};

export const viewport: Viewport = {
  themeColor: "#E8620E",
  width: "device-width",
  initialScale: 1,
};

// Apply saved theme before paint to avoid a flash.
const themeInit = `(function(){try{var t=localStorage.getItem('bmtt-theme');if(t)document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
