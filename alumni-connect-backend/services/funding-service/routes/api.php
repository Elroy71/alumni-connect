<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'service' => 'Funding Service',
        'version' => '1.0.0',
        'status' => 'running',
        'graphql' => url('/graphql'),
    ]);
});
