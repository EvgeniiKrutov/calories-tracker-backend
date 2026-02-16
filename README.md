# Calorie Tracker API

NestJS REST API for tracking calorie and nutrition records.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file from the example:
```bash
cp .env.example .env
```

3. Update `.env` with your PostgreSQL credentials.

4. Make sure PostgreSQL is running and the database exists:
```sql
CREATE DATABASE calorie_tracker;
```

5. Run in watch mode:
```bash
npm run start:dev
```

## API Endpoints

Base URL: `http://localhost:3000/api`

| Method | Endpoint           | Description        |
|--------|--------------------|--------------------|
| GET    | /api/records       | Get all records    |
| GET    | /api/records/:id   | Get record by id   |
| POST   | /api/records       | Create a record    |
| PUT    | /api/records/:id   | Update a record    |
| DELETE | /api/records/:id   | Delete a record    |

### Example request body (POST/PUT):
```json
{
  "category": "Breakfast",
  "date": "2025-02-05T08:00:00.000Z",
  "kcal": 450.5,
  "fat": 15.2,
  "saturatedFat": 5.1,
  "protein": 25.0,
  "salt": 1.2,
  "sugar": 8.5,
  "carb": 55.3
}
```
