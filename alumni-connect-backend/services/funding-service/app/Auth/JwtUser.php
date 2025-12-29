<?php

namespace App\Auth;

use Illuminate\Contracts\Auth\Authenticatable;

/**
 * JwtUser adalah virtual user yang dibuat dari JWT payload.
 * Karena funding service tidak menyimpan data user lokal (user ada di Identity Service),
 * kita menggunakan class ini sebagai representasi user dari JWT token.
 */
class JwtUser implements Authenticatable
{
    protected $attributes;

    public function __construct(array $attributes = [])
    {
        $this->attributes = $attributes;
    }

    /**
     * Get the name of the unique identifier for the user.
     */
    public function getAuthIdentifierName(): string
    {
        return 'id';
    }

    /**
     * Get the unique identifier for the user.
     */
    public function getAuthIdentifier()
    {
        return $this->attributes['id'] ?? null;
    }

    /**
     * Get the password for the user (not used for JWT).
     */
    public function getAuthPassword(): string
    {
        return '';
    }

    /**
     * Get the token value for the "remember me" session (not used for JWT).
     */
    public function getRememberToken(): ?string
    {
        return null;
    }

    /**
     * Set the token value for the "remember me" session (not used for JWT).
     */
    public function setRememberToken($value): void
    {
        // Not used for JWT
    }

    /**
     * Get the column name for the "remember me" token (not used for JWT).
     */
    public function getRememberTokenName(): string
    {
        return '';
    }

    /**
     * Get user attribute.
     */
    public function __get($key)
    {
        return $this->attributes[$key] ?? null;
    }

    /**
     * Set user attribute.
     */
    public function __set($key, $value)
    {
        $this->attributes[$key] = $value;
    }

    /**
     * Check if attribute exists.
     */
    public function __isset($key)
    {
        return isset($this->attributes[$key]);
    }

    /**
     * Get user ID (alias for getAuthIdentifier).
     */
    public function getId(): ?string
    {
        return $this->getAuthIdentifier();
    }

    /**
     * Get user role.
     */
    public function getRole(): ?string
    {
        return $this->attributes['role'] ?? 'user';
    }

    /**
     * Check if user is admin.
     */
    public function isAdmin(): bool
    {
        return $this->getRole() === 'SUPER_ADMIN' || $this->getRole() === 'super_admin';
    }
}
