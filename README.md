# Calorie Tracker API

A NestJS + TypeORM REST API for tracking meals and daily calorie/nutrition intake, backed by PostgreSQL.

## Features

- **Meals** — a catalog of foods with per-portion nutrition values.
- **Records** — logged consumption entries that reference a meal for a given user, date, and portion size (in grams).
- **Daily summary** — aggregated nutrition totals for a user on a specific day.
- **Charts** — time-series data for a chosen nutrient over a week, month, or custom range.
- Pagination on list endpoints, request validation, and CORS enabled.

## Tech Stack

- [NestJS](https://nestjs.com/) 10
- [TypeORM](https://typeorm.io/) 0.3
- PostgreSQL (`pg`)
- `class-validator` / `class-transformer` for DTO validation

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file from the example:
   ```bash
   cp env.example .env
   ```

3. Update `.env` with your PostgreSQL credentials:
   ```
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=your_name
   DB_PASSWORD=your_password
   DB_NAME=calories_tracker
   PORT=3000
   ```

4. Make sure PostgreSQL is running and the database exists:
   ```sql
   CREATE DATABASE calories_tracker;
   ```
   > TypeORM runs with `synchronize: true`, so the schema is created automatically from the entities on startup. This is convenient for development but should not be used in production.

## Running

```bash
npm run start:dev    # watch mode
npm run start        # standard
npm run start:debug  # watch + debugger
npm run build        # compile to dist/
npm run start:prod   # run compiled build (node dist/main)
```

The server starts on `http://localhost:3000` (or `PORT`). All routes are prefixed with `/api`.

## Data Model

### Meal
| Field         | Type   | Description                |
|---------------|--------|----------------------------|
| id            | uuid   | Generated identifier       |
| name          | string | Meal name                  |
| kcal          | float  | Calories                   |
| fat           | float  | Fat                        |
| saturatedFat  | float  | Saturated fat              |
| protein       | float  | Protein                    |
| carb          | float  | Carbohydrates              |
| sugar         | float  | Sugar                      |
| salt          | float  | Salt                       |
| fibre         | float  | Fibre                      |

Nutrition values represent the meal's reference portion. Records scale these by `grams`.

### Record
| Field         | Type   | Description                          |
|---------------|--------|--------------------------------------|
| id            | uuid   | Generated identifier                 |
| userId        | uuid   | Owning user                          |
| mealId        | uuid   | Referenced meal                      |
| mealName      | string | Snapshot of the meal name            |
| category      | string | e.g. `Breakfast`, `Lunch`            |
| date          | string | ISO 8601 timestamp                   |
| grams         | float  | Portion size consumed                |
| kcal, fat, saturatedFat, protein, carb, sugar, salt, fibre | float | Computed nutrition for the portion |

## API Endpoints

Base URL: `http://localhost:3000/api`

### Meals

| Method | Endpoint      | Description                    |
|--------|---------------|--------------------------------|
| GET    | /meals        | List meals (paginated)         |
| GET    | /meals/:id    | Get a meal by id               |
| POST   | /meals        | Create a meal                  |
| PUT    | /meals/:id    | Update a meal                  |
| DELETE | /meals/:id    | Delete a meal                  |

**Create/update body:**
```json
{
  "name": "Oatmeal",
  "kcal": 389,
  "fat": 6.9,
  "saturatedFat": 1.2,
  "protein": 16.9,
  "carb": 66.3,
  "sugar": 0.99,
  "salt": 0.02,
  "fibre": 10.6
}
```

### Records

| Method | Endpoint          | Description                       |
|--------|-------------------|-----------------------------------|
| GET    | /records          | List records (paginated)          |
| GET    | /records/summary  | Daily nutrition summary           |
| GET    | /records/chart    | Time-series chart data            |
| GET    | /records/:id      | Get a record by id                |
| POST   | /records          | Create a record                   |
| PUT    | /records/:id      | Update a record                   |
| DELETE | /records/:id      | Delete a record                   |

**Create/update body:**
```json
{
  "userId": "11111111-1111-1111-1111-111111111111",
  "mealId": "22222222-2222-2222-2222-222222222222",
  "category": "Breakfast",
  "date": "2025-02-05T08:00:00.000Z",
  "grams": 60
}
```

## Query Parameters

### Pagination (`GET /meals`, `GET /records`)
| Param | Type | Default | Description               |
|-------|------|---------|---------------------------|
| page  | int  | 1       | Page number (min 1)       |
| limit | int  | 20      | Items per page (min 1)    |

Paginated responses have the shape:
```json
{
  "data": [],
  "total": 0,
  "page": 1,
  "limit": 20,
  "totalPages": 0
}
```

### Daily summary (`GET /records/summary`)
| Param  | Type          | Description         |
|--------|---------------|---------------------|
| userId | uuid          | Required            |
| date   | ISO 8601 date | Required            |

Example: `GET /api/records/summary?userId=<uuid>&date=2025-02-05`

### Chart (`GET /records/chart`)
| Param    | Type   | Description                                                   |
|----------|--------|---------------------------------------------------------------|
| userId   | uuid   | Required                                                       |
| period   | enum   | `week`, `month`, or `custom`                                  |
| category | enum   | `kcal`, `saturatedFat`, `sugar`, or `salt`                   |
| start    | string | Required when `period=custom` (range start)                  |
| end      | string | Required when `period=custom` (range end)                    |

Example: `GET /api/records/chart?userId=<uuid>&period=week&category=kcal`

## Project Structure

```
.
├── main.ts                  # App bootstrap, global prefix, validation, CORS
├── app.module.ts            # Root module, TypeORM + Config setup
├── routes/
│   ├── meals/               # Meal module, controller, service, entity
│   └── records/             # Record module, controller, service, entity
├── dto/
│   ├── common/              # Pagination DTOs
│   ├── meals/               # Meal create/update DTOs
│   └── records/             # Record, summary, and chart DTOs
├── types/
└── utils/
```
