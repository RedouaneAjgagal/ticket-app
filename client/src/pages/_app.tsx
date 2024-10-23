import "@/styles/globals.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div>
      <main className="max-w-[70rem] mx-auto">
        <Component {...pageProps} />
      </main>
    </div>
  )
}
