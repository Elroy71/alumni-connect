<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class JwtAuth
{
    /**
     * Handle an incoming request.
     * 
     * Middleware ini memastikan bahwa JwtGuard sudah memproses token
     * dan mengisi user context ke dalam request.
     */
    public function handle(Request $request, Closure $next)
    {
        // Debug logging
        $token = $request->bearerToken();
        \Log::debug('JwtAuth Middleware: Bearer token from request: ' . ($token ? 'EXISTS (' . substr($token, 0, 30) . '...)' : 'MISSING'));
        \Log::debug('JwtAuth Middleware: Authorization header: ' . ($request->header('Authorization') ?? 'NONE'));
        
        // Trigger auth check supaya JwtGuard memproses token
        // dan mengisi userId ke dalam request
        $user = Auth::user();
        
        \Log::debug('JwtAuth Middleware: Auth::user() result: ' . ($user ? 'User ID: ' . $user->getAuthIdentifier() : 'NULL'));
        
        if ($user) {
            // Pastikan userId tersedia di request untuk resolvers
            $request->merge(['userId' => $user->getAuthIdentifier()]);
        }

        return $next($request);
    }
}

