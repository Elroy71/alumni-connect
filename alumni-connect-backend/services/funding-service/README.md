# Funding Service - AlumniConnect

Crowdfunding service for AlumniConnect platform built with Laravel and GraphQL.

## Features

- Campaign Management (CRUD)
- Donation System
- Campaign Updates
- Progress Tracking
- JWT Authentication

## Tech Stack

- PHP 8.1+
- Laravel 10
- PostgreSQL
- Lighthouse GraphQL
- Apollo Federation Compatible

## Installation

1. Install dependencies:
```bash
composer install
```

2. Configure environment:
```bash
cp .env.example .env
# Update database credentials
```

3. Generate application key:
```bash
php artisan key:generate
```

4. Run migrations:
```bash
php artisan migrate
```

5. Seed database:
```bash
php artisan db:seed
```

6. Start server:
```bash
php artisan serve --port=4003
```

## GraphQL Playground

Access GraphQL Playground at: `http://localhost:4003/graphql-playground`

## API Endpoints

- GraphQL API: `http://localhost:4003/graphql`

## Database Schema

### Tables
- `campaigns` - Campaign information
- `donations` - Donation records
- `campaign_updates` - Campaign progress updates

## Authentication

This service uses JWT tokens shared with the Identity Service. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```
