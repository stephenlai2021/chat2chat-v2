import "./globals.css";

/* next */
import { Inter } from "next/font/google";

/* utils */
import { Toaster } from "react-hot-toast";

/* daisy-ui theme */
import DaisyUIThemeProvider from "@/providers/daisyui-theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Chat2Chat",
  description:
    "an instant messenger that brings up your communication to a incredible awesome level 😍",
  icons: {
    icon: "/chat-icon.png",
  },
  content: {
    width: "device-width",
    "user-scalable": "no",
    "initial-scale": "1.0",
    "maximum-scale": "1.0",
  },
};

export default async function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className}`}>
        <DaisyUIThemeProvider>
          <div className="max-w-[1200px] mx-auto bg-base-200">
            <Toaster position="bottom-center" />
            {children}
          </div>
        </DaisyUIThemeProvider>
      </body>
    </html>
  );
}
