<?php

namespace App\Auth;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Illuminate\Contracts\Auth\Guard;
use Illuminate\Contracts\Auth\Authenticatable;

class JwtGuard implements Guard
{
    protected $user;

    /**
     * Determine if the current user is authenticated.
     */
    public function check(): bool
    {
        return !is_null($this->user());
    }

    /**
     * Determine if the current user is a guest.
     */
    public function guest(): bool
    {
        return !$this->check();
    }

    /**
     * Get the currently authenticated user.
     */
    public function user(): ?Authenticatable
    {
        if ($this->user !== null) {
            return $this->user;
        }

        // Gunakan request() helper untuk mendapatkan current request
        $request = request();
        $token = $request->bearerToken();
        
        if (!$token) {
            \Log::debug('JwtGuard: No bearer token found');
            return null;
        }

        try {
            $secret = env('JWT_SECRET', 'your-super-secret-jwt-key-change-this-in-production');
            \Log::debug('JwtGuard: Decoding token with secret: ' . substr($secret, 0, 10) . '...');
            
            $decoded = JWT::decode($token, new Key($secret, 'HS256'));
            
            // Buat user dari JWT payload
            $userId = $decoded->userId ?? $decoded->sub ?? null;
            
            \Log::debug('JwtGuard: Token decoded successfully, userId: ' . $userId);
            
            if ($userId) {
                // Buat user virtual karena kita tidak punya User model lokal
                $this->user = new JwtUser([
                    'id' => $userId,
                    'email' => $decoded->email ?? null,
                    'role' => $decoded->role ?? 'user',
                ]);
                
                // Juga set userId pada request untuk digunakan oleh resolvers
                $request->merge(['userId' => $userId]);
            }
            
        } catch (\Firebase\JWT\ExpiredException $e) {
            \Log::warning('JwtGuard: Token expired');
            return null;
        } catch (\Exception $e) {
            \Log::error('JwtGuard: JWT Auth Error - ' . $e->getMessage());
            return null;
        }

        return $this->user;
    }

    /**
     * Get the ID for the currently authenticated user.
     */
    public function id()
    {
        $user = $this->user();
        return $user ? $user->getAuthIdentifier() : null;
    }

    /**
     * Validate a user's credentials.
     */
    public function validate(array $credentials = []): bool
    {
        // Tidak digunakan untuk JWT auth
        return false;
    }

    /**
     * Determine if the guard has a user instance.
     */
    public function hasUser(): bool
    {
        return !is_null($this->user);
    }

    /**
     * Set the current user.
     */
    public function setUser(Authenticatable $user)
    {
        $this->user = $user;
        return $this;
    }
}

