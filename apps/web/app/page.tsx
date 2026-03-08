import Link from "next/link";
import { Card } from "@dikidi-clone/ui";

export default function HomePage() {
  const featureCards = [
    {
      title: "Публичная онлайн-запись",
      subtitle: "Быстрая запись клиента в 3 шага",
      description:
        "Персональная страница салона с выбором услуги, мастера и времени. Можно использовать как мини-лендинг."
    },
    {
      title: "Умная доступность",
      subtitle: "Расписание + исключения + таймзона",
      description:
        "Слоты рассчитываются с учетом рабочего времени мастеров, day off, сокращенных смен и уже созданных записей."
    },
    {
      title: "CRM-ready API",
      subtitle: "Каталог, клиенты, записи, auth",
      description:
        "API уже разделен по модулям и готов к масштабированию под CRM, платежи, уведомления и аналитику."
    }
  ];

  return (
    <>
      <section className="hero">
        <span className="pill">Starter kit для SaaS онлайн-записи</span>
        <h1>DIKIDI-like Booking Platform</h1>
        <p>
          Полноценный старт для сервиса онлайн-записи в beauty/wellness сегменте: клиентский
          booking flow, API с доменной архитектурой, расписания мастеров и готовый фундамент под
          CRM-процессы.
        </p>
        <div className="hero__actions">
          <Link href="/booking/beauty-lab-moscow" className="ui-button ui-button--primary ui-button--lg">
            Открыть онлайн-запись
          </Link>
          <Link href="/dashboard" className="ui-button ui-button--secondary ui-button--lg">
            Открыть dashboard
          </Link>
        </div>
        <div className="metrics-grid">
          <article className="metric-tile">
            <strong>2 apps</strong>
            <span>web + api в одном монорепо</span>
          </article>
          <article className="metric-tile">
            <strong>5+ модулей</strong>
            <span>catalog, bookings, clients, auth</span>
          </article>
          <article className="metric-tile">
            <strong>Prod-ready</strong>
            <span>Prisma + CI + Docker infrastructure</span>
          </article>
        </div>
      </section>

      <h2 className="section-title">Ключевые блоки продукта</h2>
      <section className="cards-grid">
        {featureCards.map((item) => (
          <Card key={item.title} title={item.title} subtitle={item.subtitle}>
            <p className="note">{item.description}</p>
          </Card>
        ))}
      </section>

      <h2 className="section-title">Быстрый переход</h2>
      <section className="cards-grid">
        <Card title="Клиентский сценарий" subtitle="Публичная страница салона">
          <p className="note">Проверь сценарий записи клиента с выбором услуги и мастера.</p>
          <div className="hero__actions">
            <Link href="/booking/beauty-lab-moscow" className="ui-button ui-button--primary ui-button--md">
              Перейти к записи
            </Link>
          </div>
        </Card>
        <Card title="Бизнес-сценарий" subtitle="Операционный dashboard">
          <p className="note">Посмотри KPI-блоки и дальнейшие точки роста продукта.</p>
          <div className="hero__actions">
            <Link href="/dashboard" className="ui-button ui-button--secondary ui-button--md">
              Перейти в dashboard
            </Link>
          </div>
        </Card>
      </section>
    </>
  );
}
