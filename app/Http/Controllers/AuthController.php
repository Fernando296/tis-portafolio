<?php

namespace App\Http\Controllers;

use App\Models\Usuario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $data = $request->validate([
            'nombre' => [
                'required',
                'string',
                'min:3',
                'max:40',
                'regex:/^[\pL\s]+$/u',
            ],
            'email' => [
             'required',
             'string',
             'email',
             'max:255',
             'regex:/^[A-Za-z0-9._%+-]+@(gmail\.com|hotmail\.com|yahoo\.com|outlook\.com|umss\.edu\.bo|umss\.edu|est\.umss\.edu|ucb\.edu\.bo|univalle\.edu|harvard\.edu|mit\.edu|empresa\.com\.bo|miempresa\.net)$/i',
             'unique:usuarios,email',
            ],    
            'password' => [
                'required',
                'string',
                'min:8',
                'max:16',
                'regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/',
                'confirmed',
            ],
        ], [
            'nombre.required' => 'Este campo es obligatorio',
            'nombre.min' => 'Fuera del límite',
            'nombre.max' => 'Fuera del límite',
            'nombre.regex' => 'El nombre solo debe contener letras',

            'email.required' => 'Este campo es obligatorio',
            'email.email' => 'Correo electrónico no válido',
            'email.unique' => 'Ya existe una cuenta registrada a este correo electrónico',
            'email.regex' => 'Correo electrónico no válido',

            'password.required' => 'Este campo es obligatorio',
            'password.min' => 'La contraseña debe tener 8 caracteres',
            'password.max' => 'La contraseña debe tener 8 caracteres',
            'password.regex' => 'La contraseña debe tener 8 caracteres',
            'password.confirmed' => 'Las contraseñas no coinciden',
        ]);

        $usuario = DB::transaction(function () use ($data) {
            $slug = $this->generarSlugUnico($data['nombre']);

            $usuario = Usuario::create([
                'email' => $data['email'],
                'password_hash' => Hash::make($data['password']),
                'slug' => $slug,
                'nombre' => trim($data['nombre']),
                'apellido' => null,
                'rol' => 'usuario',
                'activo' => true,
                'fecha_registro' => now(),
                'updated_at' => now(),
            ]);

            DB::table('portafolios')->insert([
                'id_usuario' => $usuario->id_usuario,
                'titulo' => 'Mi portafolio',
                'tema_visual' => 'default',
                'publicado' => false,
                'fecha_creacion' => now(),
                'fecha_actualizacion' => now(),
            ]);

            DB::table('configuracion_portafolio')->insert([
                'id_usuario' => $usuario->id_usuario,
                'updated_at' => now(),
            ]);

            return $usuario;
        });

        Auth::login($usuario);

        return response()->json([
            'message' => 'Cuenta creada correctamente',
            'usuario' => [
                'id_usuario' => $usuario->id_usuario,
                'nombre' => $usuario->nombre,
                'email' => $usuario->email, 
                'slug' => $usuario->slug,
            ],
            'redirect' => '/',
        ], 201);
    }

    private function generarSlugUnico(string $nombre): string
    {
        $base = Str::slug($nombre);

        if ($base === '') {
            $base = 'usuario';
        }

        $slug = $base;
        $contador = 1;

        while (Usuario::where('slug', $slug)->exists()) {
            $slug = $base . '-' . $contador;
            $contador++;
        }

        return $slug;
    }
}