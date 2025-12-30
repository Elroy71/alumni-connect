# Funding Service Dockerfile for AlumniConnect
FROM php:8.2-cli

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    zip \
    unzip \
    libpq-dev \
    libzip-dev \
    && docker-php-ext-install pdo_pgsql zip bcmath \
    && rm -rf /var/lib/apt/lists/*

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copy composer files first for better caching
COPY composer.json composer.lock* ./

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader --no-scripts

# Copy source code
COPY . .

# Run composer scripts after copying all files
RUN composer dump-autoload --optimize

# Expose Funding Service port
EXPOSE 4003

# Start Laravel development server
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=4003"]
