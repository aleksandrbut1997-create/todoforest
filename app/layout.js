import "./globals.css";

export const metadata = {
  title: "TodoForest — AI-планер дня",
  description:
    "Вивали все, що в голові, текстом або голосом — AI перетворить хаос на план на сьогодні.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#0f1115",
};

export default function RootLayout({ children }) {
  return (
    <html lang="uk">
      <body>{children}</body>
    </html>
  );
}
