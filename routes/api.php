<?php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PasswordResetController;

/* AUTH */
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::post('/password/email', [PasswordResetController::class, 'sendResetCode']);
Route::post('/password/reset', [PasswordResetController::class, 'resetPassword']);

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
