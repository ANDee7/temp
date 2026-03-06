import Link from "next/link";
import { Card } from "@dikidi-clone/ui";

export default function HomePage() {
  return (
    <main>
      <h1 style={{ fontSize: 36, marginBottom: 8 }}>DIKIDI-like Booking Starter</h1>
      <p style={{ maxWidth: 680, color: "#4b5563", marginBottom: 24 }}>
        Готовый стартовый проект для сервиса онлайн-записи в сфере услуг: каталог, мастера,
        бронирования, API и web-клиент в одном монорепозитории.
      </p>

      <section style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
        <Card title="Онлайн-запись для клиентов" subtitle="Публичная страница салона">
          <Link href="/booking/beauty-lab-moscow">Открыть демо-страницу записи</Link>
        </Card>
        <Card title="Кабинет бизнеса" subtitle="MVP dashboard">
          <Link href="/dashboard">Открыть dashboard</Link>
        </Card>
      </section>
    </main>
  );
}
