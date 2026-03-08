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
      setStatus(`success: Успешно! ID записи: ${booking.id}`);
      setFullName("");
      setPhone("");
      setEmail("");
      setNotes("");
    } catch (error) {
      setStatus(
        error instanceof Error ? `error: Ошибка: ${error.message}` : "error: Неизвестная ошибка"
      );
    }
  }

  const statusTone = status.startsWith("success")
    ? "status-chip status-chip--success"
    : status.startsWith("error")
      ? "status-chip status-chip--error"
      : "status-chip status-chip--pending";

  const statusText = status.replace(/^success:\s*|^error:\s*/, "");

  return (
    <Card title="Онлайн-запись" subtitle="Выберите услугу, мастера и удобное время" className="stack">
      <form onSubmit={handleSubmit} className="booking-form">
        <div className="booking-form__grid">
          <label className="form-field">
            <span className="form-label">Услуга</span>
            <select
              className="select"
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
            >
              {services.map((service) => (
                <option value={service.id} key={service.id}>
                  {service.name} — {service.price} {service.currency} ({service.durationMin} мин)
                </option>
              ))}
            </select>
          </label>

          <label className="form-field">
            <span className="form-label">Мастер</span>
            <select
              className="select"
              required
              value={staffId}
              onChange={(event) => setStaffId(event.target.value)}
            >
              {compatibleStaff.map((member) => (
                <option value={member.id} key={member.id}>
                  {member.fullName} — {member.role}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="booking-form__grid">
          <label className="form-field">
            <span className="form-label">Дата и время</span>
            <input
              className="input"
              type="datetime-local"
              required
              value={startAt}
              onChange={(event) => setStartAt(event.target.value)}
            />
          </label>

          <label className="form-field">
            <span className="form-label">Имя</span>
            <input
              className="input"
              required
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
            />
          </label>
        </div>

        <div className="booking-form__grid">
          <label className="form-field">
            <span className="form-label">Телефон</span>
            <input
              className="input"
              required
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="+7..."
            />
          </label>

          <label className="form-field">
            <span className="form-label">Email (опционально)</span>
            <input
              className="input"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>
        </div>

        <label className="form-field form-field--full">
          <span className="form-label">Комментарий</span>
          <textarea
            className="textarea"
            rows={4}
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Комментарий к записи (необязательно)"
          />
        </label>

        <div className="form-footer">
          <Button type="submit" size="lg">
            Записаться
          </Button>
          {status ? <span className={statusTone}>{statusText}</span> : null}
        </div>
      </form>
    </Card>
  );
}
