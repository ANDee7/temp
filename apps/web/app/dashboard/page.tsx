import { Card } from "@dikidi-clone/ui";

export default function DashboardPage() {
  const kpis = [
    { label: "Записей сегодня", value: "24", trend: "+18%" },
    { label: "Новых клиентов", value: "7", trend: "+9%" },
    { label: "Средний чек", value: "2 850 ₽", trend: "+4%" },
    { label: "Загрузка мастеров", value: "78%", trend: "+6%" }
  ];

  return (
    <>
      <section className="hero">
        <span className="pill">Операционный центр салона</span>
        <h1>Dashboard бизнеса</h1>
        <p>
          Единый экран контроля по KPI, записям и загрузке мастеров. Сейчас это MVP-вариант, который
          легко расширяется до полноценного CRM-кабинета.
        </p>
      </section>

      <h2 className="section-title">Ключевые показатели</h2>
      <section className="cards-grid">
        {kpis.map((item) => (
          <Card key={item.label} title={item.value} subtitle={item.label}>
            <span className="pill">{item.trend} за неделю</span>
          </Card>
        ))}
      </section>

      <section className="two-cols">
        <Card title="Следующие шаги продукта" subtitle="Roadmap для production">
          <ul className="note bullet-list">
            <li>Добавить календарь мастеров с drag-and-drop.</li>
            <li>Подключить оплату онлайн и предоплаты.</li>
            <li>Включить автоматические напоминания в WhatsApp/Telegram/SMS.</li>
          </ul>
        </Card>

        <Card title="Системный статус" subtitle="Технические индикаторы">
          <div className="stack">
            <article className="metric-tile">
              <strong>API: online</strong>
              <span>Health-check и bookings flow отвечают корректно</span>
            </article>
            <article className="metric-tile">
              <strong>Data source switch</strong>
              <span>Поддержка in-memory и Prisma/PostgreSQL</span>
            </article>
          </div>
        </Card>
      </section>
    </>
  );
}
