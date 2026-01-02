<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

// Root endpoint - API info
Route::get('/', function () {
    return response()->json([
        'message' => 'Alumni Connect - Funding Service',
        'version' => '1.0.0',
        'graphql' => '/graphql',
        'health' => '/health'
    ]);
});

// Health check endpoint
Route::get('/health', function () {
    return response()->json([
        'status' => 'healthy',
        'service' => 'funding-service',
        'version' => '1.0.0'
    ]);
});
