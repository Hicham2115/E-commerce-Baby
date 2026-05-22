import { Lato, Playfair_Display } from "next/font/google";
import AppProviders from "@/components/providers/AppProviders";
import "./globals.css";

const lato = Lato({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const playfair = Playfair_Display({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "Vêtements bébé naissance — Chahrazad Baby",
  description:
    "Boutique en ligne de vêtements bébé naissance au Maroc : bébé fille, bébé garçon, packs clinique, grenouillères, idées cadeaux. Livraison gratuite dès 400 dh.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="fr"
      className={`${lato.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background" id="top">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
