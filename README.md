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
  - Доступность слотов (`availability`) с учетом длительности услуги/таймзоны
  - Персональные графики мастеров + исключения по датам (day off / сокращенный день)
  - Data source switch: `DATA_SOURCE=in-memory|prisma`
  - `Prisma Client + seed` для production/dev БД
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

По умолчанию API работает на `in-memory` источнике данных (удобно для первого запуска и тестов).
Чтобы включить PostgreSQL + Prisma, укажи в `.env`:

```env
DATA_SOURCE=prisma
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/dikidi_clone
```

## Запуск инфраструктуры

```bash
docker compose -f infra/docker-compose.yml up -d
```

Инициализация схемы/данных Prisma:

```bash
npm run prisma:migrate:dev -w apps/api
npm run prisma:seed -w apps/api
```

## Скрипты

```bash
npm run dev      # все приложения в режиме разработки
npm run lint     # typecheck lint
npm run test     # тесты по workspaces
npm run build    # production build
npm run check    # lint + test + build
```

### Быстрая проверка availability API

```bash
curl "http://localhost:4000/api/v1/availability/business/beauty-lab-moscow?serviceId=6c2435be-b9fd-40a6-a719-1734fbd8465c&date=2026-03-10&stepMin=30"
```

Demo-исключения в seed/in-memory:

- `2099-12-31`: у Анны сокращенный график `14:00-18:00`
- `2099-12-31`: у Екатерины полный выходной

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

1. Добавить RBAC и refresh-token стратегию.
2. Внедрить job queue (BullMQ + Redis) для напоминаний.
3. Подключить webhooks/интеграции (Telegram/WhatsApp/SMS).
4. Реализовать метрики, трассировку, audit trail.
5. Разделить API на доменные сервисы по мере роста нагрузки.

---

## Demo данные

В API уже зашиты тестовые сущности:

- business slug: `beauty-lab-moscow`
- тестовый owner для login:
  - phone: `+79991234567`
  - password: `owner123`

Этого достаточно, чтобы сразу проверить end-to-end flow записи через web.
