<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProfileController;

Route::get('/profile/basic-info', [ProfileController::class, 'show']);
Route::put('/profile/basic-info', [ProfileController::class, 'updateBasicInfo']);