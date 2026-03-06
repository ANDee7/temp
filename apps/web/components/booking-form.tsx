"use client";

import type { Service, Staff } from "@dikidi-clone/shared";
import { Button, Card } from "@dikidi-clone/ui";
import { useMemo, useState } from "react";
import { createBooking } from "../lib/api";

type BookingFormProps = {
  businessId: string;
  services: Service[];
  staff: Staff[];
};

export function BookingForm({ businessId, services, staff }: BookingFormProps) {
  const [serviceId, setServiceId] = useState(services[0]?.id ?? "");
  const [staffId, setStaffId] = useState(staff[0]?.id ?? "");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [startAt, setStartAt] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<string>("");

  const compatibleStaff = useMemo(() => {
    if (!serviceId) {
      return staff;
    }
    return staff.filter((member) => member.serviceIds.includes(serviceId));
  }, [serviceId, staff]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("Создаем запись...");

    try {
      const booking = await createBooking({
        businessId,
        serviceId,
        staffId,
        client: {
          fullName,
          phone,
          email: email || undefined
        },
        startAt: new Date(startAt).toISOString(),
        notes: notes || undefined
      });
      setStatus(`Успешно! ID записи: ${booking.id}`);
    } catch (error) {
      setStatus(error instanceof Error ? `Ошибка: ${error.message}` : "Неизвестная ошибка");
    }
  }

  return (
    <Card title="Онлайн-запись" subtitle="Выберите услугу, мастера и удобное время">
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
        <label>
          Услуга
          <select
            required
            value={serviceId}
            onChange={(event) => {
              const nextServiceId = event.target.value;
              setServiceId(nextServiceId);
              const nextStaff = staff.find((member) => member.serviceIds.includes(nextServiceId));
              if (nextStaff) {
                setStaffId(nextStaff.id);
              }
            }}
            style={{ width: "100%", padding: 8, marginTop: 6 }}
          >
            {services.map((service) => (
              <option value={service.id} key={service.id}>
                {service.name} — {service.price} {service.currency} ({service.durationMin} мин)
              </option>
            ))}
          </select>
        </label>

        <label>
          Мастер
          <select
            required
            value={staffId}
            onChange={(event) => setStaffId(event.target.value)}
            style={{ width: "100%", padding: 8, marginTop: 6 }}
          >
            {compatibleStaff.map((member) => (
              <option value={member.id} key={member.id}>
                {member.fullName} — {member.role}
              </option>
            ))}
          </select>
        </label>

        <label>
          Дата и время
          <input
            type="datetime-local"
            required
            value={startAt}
            onChange={(event) => setStartAt(event.target.value)}
            style={{ width: "100%", padding: 8, marginTop: 6 }}
          />
        </label>

        <label>
          Имя
          <input
            required
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            style={{ width: "100%", padding: 8, marginTop: 6 }}
          />
        </label>

        <label>
          Телефон
          <input
            required
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            style={{ width: "100%", padding: 8, marginTop: 6 }}
          />
        </label>

        <label>
          Email (опционально)
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            style={{ width: "100%", padding: 8, marginTop: 6 }}
          />
        </label>

        <label>
          Комментарий
          <textarea
            rows={3}
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            style={{ width: "100%", padding: 8, marginTop: 6 }}
          />
        </label>

        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <Button type="submit">Записаться</Button>
          <span>{status}</span>
        </div>
      </form>
    </Card>
  );
}
