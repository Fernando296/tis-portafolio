<?php

namespace App\Http\Controllers;

use App\Models\Profile;
use App\Models\User;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    public function show()
    {
        $user = User::first();

        if (!$user) {
            return response()->json([
                'message' => 'No existe un usuario.',
                'data' => [
                    'nombre' => '',
                    'apellido' => '',
                    'profesion' => '',
                    'biografia' => '',
                ]
            ], 404);
        }

        $profile = Profile::where('user_id', $user->id)->first();

        return response()->json([
            'data' => [
                'nombre' => $profile->nombre ?? '',
                'apellido' => $profile->apellido ?? '',
                'profesion' => $profile->profesion ?? '',
                'biografia' => $profile->biografia ?? '',
            ]
        ]);
    }

    public function updateBasicInfo(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'apellido' => 'required|string|max:255',
            'profesion' => 'required|string|max:255',
            'biografia' => 'required|string',
        ]);

        $user = User::first();

        if (!$user) {
            return response()->json([
                'message' => 'No existe un usuario para asociar el perfil.'
            ], 404);
        }

        $profile = Profile::firstOrNew([
            'user_id' => $user->id,
        ]);

        $profile->nombre = $validated['nombre'];
        $profile->apellido = $validated['apellido'];
        $profile->profesion = $validated['profesion'];
        $profile->biografia = $validated['biografia'];
        $profile->save();

        return response()->json([
            'message' => 'Perfil actualizado correctamente.',
            'data' => [
                'nombre' => $profile->nombre,
                'apellido' => $profile->apellido,
                'profesion' => $profile->profesion,
                'biografia' => $profile->biografia,
            ]
        ]);
    }
}