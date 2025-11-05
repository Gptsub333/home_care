import { Inter, Playfair_Display } from "next/font/google"
import "./globals.css"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
})

export const metadata = {
  title: "MediLux - Premium Healthcare at Home",
  description: "Connect with verified healthcare professionals for luxury in-home medical services",
  generator: "v0.app",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased">
        {children}

        {/* ✅ ToastContainer must be inside body */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          theme="light"
        />
      </body>
    </html>
  )
}
