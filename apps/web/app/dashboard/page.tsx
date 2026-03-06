import { Card } from "@dikidi-clone/ui";

export default function DashboardPage() {
  const kpis = [
    { label: "Записей сегодня", value: "24" },
    { label: "Новых клиентов", value: "7" },
    { label: "Средний чек", value: "2 850 ₽" },
    { label: "Загрузка мастеров", value: "78%" }
  ];

  return (
    <main style={{ display: "grid", gap: 16 }}>
      <h1 style={{ margin: 0 }}>Dashboard бизнеса</h1>
      <section style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
        {kpis.map((item) => (
          <Card key={item.label} title={item.value} subtitle={item.label}>
            <span style={{ color: "#6b7280" }}>Demo метрика для стартового проекта</span>
          </Card>
        ))}
      </section>
      <Card title="Следующие шаги">
        <ul style={{ margin: 0, paddingLeft: 18 }}>
          <li>Добавить календарь мастеров с drag-and-drop.</li>
          <li>Подключить оплату онлайн и предоплаты.</li>
          <li>Включить автоматические напоминания в WhatsApp/Telegram/SMS.</li>
        </ul>
      </Card>
    </main>
  );
}
