import { Geist_Mono, Michroma, Alexandria } from "next/font/google";

export const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], weight: ["400", "500"] });
export const michroma = Michroma({ variable: "--font-michroma", subsets: ["latin"], weight: ["400"] });
export const alexandria = Alexandria({ variable: "--font-alexandria", subsets: ["latin"], weight: ["300", "600"] });

export const homeFontVars = `${geistMono.variable} ${michroma.variable} ${alexandria.variable}`;
