import "./globals.css";

export const metadata = {
  title: "Джура — козацький AI-планер дня",
  description:
    "Кажи все, що в голові, текстом або голосом — джура розбере на задачі і збере план на сьогодні.",
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
