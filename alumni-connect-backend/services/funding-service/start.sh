#!/bin/bash

# Run migrations
php artisan migrate --force

# Run seeders (only if tables are empty)
php artisan db:seed --force

# Start the server
php artisan serve --host=0.0.0.0 --port=${PORT:-8080}
