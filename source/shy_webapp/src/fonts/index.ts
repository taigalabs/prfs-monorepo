import { Roboto, Ubuntu } from "next/font/google";

export const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const ubuntu = Ubuntu({
  weight: ["300", "400", "500"],
  subsets: ["latin"],
  display: "swap",
});
