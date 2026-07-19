import "./globals.css";

export const metadata = {
  metadataBase: new URL("https://todoforest-a.vercel.app"),
  title: "Джура — козацький AI-планер дня",
  description:
    "Кажи все, що в голові, текстом або голосом — джура розбере на задачі і збере план на сьогодні.",
  openGraph: {
    title: "Джура — козацький AI-планер дня",
    description:
      "Кажи все, що в голові, текстом або голосом — джура розбере на задачі і збере план на сьогодні.",
    url: "https://todoforest-a.vercel.app",
    siteName: "Джура",
    locale: "uk_UA",
    type: "website",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#14110b",
};

export default function RootLayout({ children }) {
  return (
    <html lang="uk">
      <body>{children}</body>
    </html>
  );
}
