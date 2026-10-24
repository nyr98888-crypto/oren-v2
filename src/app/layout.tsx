import type { Metadata } from "next";
import { Heebo } from "next/font/google";
import "./globals.css";

const heebo = Heebo({
  subsets: ["hebrew", "latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-heebo",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SocialAI Pro – ניהול סושיאל ופרסום חכם",
  description:
    "דשבורד שיווק ברשתות לעסקים קטנים — פרסום אוטומטי לחשבונות עסקיים ושיתוף מהיר לפרטיים",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl" className={heebo.variable}>
      <body className="h-screen w-full overflow-hidden font-sans text-base">
        {children}
      </body>
    </html>
  );
}
