<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\AuthController;

Route::get('/profile/basic-info', [ProfileController::class, 'show']);
Route::put('/profile/basic-info', [ProfileController::class, 'updateBasicInfo']);

Route::post('/register', [AuthController::class, 'register']);