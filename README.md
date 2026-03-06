# DIKIDI-like Online Booking Monorepo Starter

Стартовый монорепозиторий для сервиса онлайн-записи в сфере услуг (beauty/wellness/healthcare) с архитектурой уровня продуктовой команды.

## Что внутри

### Apps

- `apps/api` — Fastify API (TypeScript)
  - JWT-аутентификация
  - Каталог бизнеса/услуг
  - Мастера (staff)
  - Клиенты
  - Записи (bookings) с проверкой пересечений по времени
  - `prisma/schema.prisma` как фундамент для production-хранилища
- `apps/web` — Next.js web-клиент (App Router)
  - Лендинг
  - Публичная страница онлайн-записи `/booking/[businessSlug]`
  - Dashboard MVP `/dashboard`

### Packages

- `packages/shared` — единые доменные модели и Zod-схемы
- `packages/ui` — базовые UI-компоненты
- `packages/config` — общие конфиги для Node/TS

### Infra

- `infra/docker-compose.yml` — PostgreSQL, Redis, MailHog
- `.github/workflows/ci.yml` — CI-пайплайн (lint + test + build)

---

## Быстрый старт

```bash
npm install
cp .env.example .env
npm run dev
```

Запуск по умолчанию:

- Web: `http://localhost:3000`
- API: `http://localhost:4000`
- Healthcheck: `http://localhost:4000/api/v1/health`

## Запуск инфраструктуры

```bash
docker compose -f infra/docker-compose.yml up -d
```

## Скрипты

```bash
npm run dev      # все приложения в режиме разработки
npm run lint     # typecheck lint
npm run test     # тесты по workspaces
npm run build    # production build
npm run check    # lint + test + build
```

---

## Product/Architecture Notes

### Целевой bounded contexts

- **Identity & Access**: пользователи бизнеса, роли, права
- **Catalog**: салоны, услуги, прайсы, мастера
- **Scheduling**: расписания, слоты, исключения
- **Bookings**: жизненный цикл записи (created/confirmed/cancelled/...)
- **CRM**: клиенты, история посещений, LTV
- **Comms**: напоминания, транзакционные уведомления
- **Payments**: предоплаты, возвраты, чеки

### Технический roadmap (эволюция из starter в production)

1. Переключить API с in-memory на PostgreSQL + Prisma Client.
2. Добавить RBAC и refresh-token стратегию.
3. Внедрить job queue (BullMQ + Redis) для напоминаний.
4. Подключить webhooks/интеграции (Telegram/WhatsApp/SMS).
5. Реализовать метрики, трассировку, audit trail.
6. Разделить API на доменные сервисы по мере роста нагрузки.

---

## Demo данные

В API уже зашиты тестовые сущности:

- business slug: `beauty-lab-moscow`
- тестовый owner для login:
  - phone: `+79991234567`
  - password: `owner123`

Этого достаточно, чтобы сразу проверить end-to-end flow записи через web.
