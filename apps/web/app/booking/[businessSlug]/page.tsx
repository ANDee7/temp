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
      <main>
        <Card title="Салон не найден">
          Проверьте ссылку или настройте каталог бизнеса в API.
        </Card>
      </main>
    );
  }

  const [services, staff] = await Promise.all([getServices(businessSlug), getStaff(businessSlug)]);

  return (
    <main style={{ display: "grid", gap: 16 }}>
      <Card title={business.name} subtitle={`${business.city} · ${business.phone}`}>
        <p style={{ margin: 0 }}>{business.description}</p>
      </Card>
      <BookingForm businessId={business.id} services={services} staff={staff} />
    </main>
  );
}
