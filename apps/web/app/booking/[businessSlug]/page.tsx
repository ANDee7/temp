import { Card } from "@dikidi-clone/ui";
import { BookingForm } from "../../../components/booking-form";
import { getBusiness, getServices, getStaff } from "../../../lib/api";

type BookingPageProps = {
  params: Promise<{
    businessSlug: string;
  }>;
};

export default async function BookingPage({ params }: BookingPageProps) {
  const { businessSlug } = await params;
  const business = await getBusiness(businessSlug);

  if (!business) {
    return (
      <>
        <Card title="Салон не найден" subtitle="Проверьте корректность ссылки">
          Проверьте ссылку или настройте каталог бизнеса в API.
        </Card>
      </>
    );
  }

  const [services, staff] = await Promise.all([getServices(businessSlug), getStaff(businessSlug)]);

  return (
    <>
      <section className="hero">
        <span className="pill">Онлайн-запись для клиентов</span>
        <h1>{business.name}</h1>
        <p>{business.description}</p>
        <div className="hero__actions">
          <span className="pill">{business.city}</span>
          <span className="pill">{business.phone}</span>
        </div>
      </section>

      <section className="two-cols">
        <BookingForm businessId={business.id} services={services} staff={staff} />
        <div className="stack">
          <Card title="Что вы получаете" subtitle="Быстрый и прозрачный flow">
            <ul className="note bullet-list">
              <li>Выбор услуги с ценой и длительностью.</li>
              <li>Запись к нужному мастеру.</li>
              <li>Подтверждение с уникальным ID записи.</li>
            </ul>
          </Card>
          <Card title="Надежность данных" subtitle="Под капотом">
            <p className="note">
              Слоты рассчитываются с учетом уже занятых окон, расписаний мастеров и исключений по
              датам (выходные/сокращенные смены).
            </p>
          </Card>
          <Card title="Контакты" subtitle="Свяжитесь с салоном">
            <p className="note note--tight">
              Город: {business.city}
              <br />
              Телефон: {business.phone}
              <br />
              Таймзона: {business.timezone}
            </p>
          </Card>
        </div>
      </section>

      <Card title="Состав команды" subtitle="Мастера и специализация">
        <div className="cards-grid">
          {staff.map((member) => (
            <article key={member.id} className="metric-tile">
              <strong>{member.fullName}</strong>
              <span>{member.role}</span>
            </article>
          ))}
        </div>
      </Card>
    </>
  );
}
