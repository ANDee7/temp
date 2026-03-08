import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "DIKIDI Clone Starter",
  description: "Онлайн-запись в сфере услуг: monorepo starter"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>
        <div className="app-shell">
          <header className="app-topbar">
            <div className="app-container app-topbar__inner">
              <Link href="/" className="app-brand">
                <span className="app-brand__dot" />
                DIKIDI Clone
              </Link>
              <nav className="app-nav">
                <Link href="/">Главная</Link>
                <Link href="/booking/beauty-lab-moscow">Онлайн-запись</Link>
                <Link href="/dashboard">Dashboard</Link>
              </nav>
            </div>
          </header>
          <main className="app-main">{children}</main>
        </div>
      </body>
    </html>
  );
}
