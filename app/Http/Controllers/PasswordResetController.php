<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use App\Models\User;
use App\Mail\ResetPasswordCodeMail;
use Carbon\Carbon;

class PasswordResetController extends Controller
{
    public function sendResetCode(Request $request)
    {
        $request->validate([
            'email' => 'required|email'
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            // Devuelve éxito igual para evitar adivinar correos por seguridad
            return response()->json(['message' => 'Si el correo existe en nuestro sistema, enviaremos un código de recuperación.'], 200);
        }

        // Generar un código numérico aleatorio de 6 dígitos
        $code = random_int(100000, 999999);

        // Guardar o actualizar en la tabla password_reset_tokens
        DB::table('password_reset_tokens')->updateOrInsert(
            ['email' => $request->email],
            [
                'token' => $code, // Guardamos el token en plano para validación rápida
                'created_at' => Carbon::now()
            ]
        );

        // Enviar el correo con el código
        Mail::to($user->email)->send(new ResetPasswordCodeMail($code));

        return response()->json(['message' => 'Código de recuperación enviado correctamente.'], 200);
    }

    public function resetPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'code' => 'required|numeric',
            'password' => 'required|min:8|confirmed',
        ]);

        // Verificar el token ingresado y el correo
        $resetReq = DB::table('password_reset_tokens')
            ->where('email', $request->email)
            ->where('token', $request->code)
            ->first();

        if (!$resetReq) {
            return response()->json(['message' => 'El código de recuperación es inválido o el correo no coincide.'], 400);
        }

        // Revisar que el token no haya expirado (ej. expira en 30 minutos)
        if (Carbon::parse($resetReq->created_at)->addMinutes(30)->isPast()) {
            DB::table('password_reset_tokens')->where('email', $request->email)->delete();
            return response()->json(['message' => 'El código de recuperación ha expirado, solicita uno nuevo.'], 400);
        }

        // Buscar al usuario y actualizar su contraseña
        $user = User::where('email', $request->email)->first();
        if (!$user) {
            return response()->json(['message' => 'Usuario no encontrado.'], 404);
        }

        $user->password_hash = Hash::make($request->password);
        $user->save();

        // Eliminar el token usado
        DB::table('password_reset_tokens')->where('email', $request->email)->delete();

        return response()->json(['message' => 'Contraseña restablecida y actualizada correctamente.'], 200);
    }
}
