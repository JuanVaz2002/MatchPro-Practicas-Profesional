"use client"

/* 
  Next.js entry point that renders the existing Vite <App />.
  We simply import the App component and the global Tailwind styles
  that already live in src/.
*/
import "../src/index.css"
import App from "../src/App"

export default function Page() {
  return <App />
}
