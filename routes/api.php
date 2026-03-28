<?php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\AuthController;

/* AUTH */
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

/*  TODAS LAS RUTAS PROTEGIDAS POR TOKEN */
Route::middleware('auth:sanctum')->group(function () {

    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    /* PERFIL */
    Route::get('/profile/basic-info', [ProfileController::class, 'show']);
    Route::put('/profile/basic-info', [ProfileController::class, 'update']);
});