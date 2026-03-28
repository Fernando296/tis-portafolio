<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ProfileController extends Controller
{
    public function show(Request $request): JsonResponse
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'message' => 'No autenticado.'
            ], 401);
        }

        return response()->json([
            'data' => [
                'nombre'    => $user->nombre ?? '',
                'apellido'  => $user->apellido ?? '',
                'profesion' => $user->profesion ?? '',
                'biografia' => $user->biografia ?? '',
            ]
        ], 200);
    }

    public function update(Request $request): JsonResponse
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'message' => 'No autenticado.'
            ], 401);
        }

        $validator = Validator::make($request->all(), [
            'nombre' => [
                'required',
                'string',
                'min:2',
                'max:100',
                "regex:/^[\p{L}\s'-]+$/u",
            ],
            'apellido' => [
                'nullable',
                'string',
                'min:2',
                'max:100',
                "regex:/^[\p{L}\s'-]+$/u",
            ],
            'profesion' => [
                'required',
                'string',
                'min:2',
                'max:150',
            ],
            'biografia' => [
                'required',
                'string',
                'min:10',
                'max:500',
            ],
        ], [
            'nombre.required' => 'El nombre es obligatorio.',
            'nombre.min' => 'El nombre debe tener al menos 2 caracteres.',
            'nombre.max' => 'El nombre no puede superar 100 caracteres.',
            'nombre.regex' => 'El nombre solo puede contener letras, espacios, apóstrofes y guiones.',

            'apellido.required' => 'El apellido es obligatorio.',
            'apellido.min' => 'El apellido debe tener al menos 2 caracteres.',
            'apellido.max' => 'El apellido no puede superar 100 caracteres.',
            'apellido.regex' => 'El apellido solo puede contener letras, espacios, apóstrofes y guiones.',

            'profesion.required' => 'La profesión es obligatoria.',
            'profesion.min' => 'La profesión debe tener al menos 2 caracteres.',
            'profesion.max' => 'La profesión no puede superar 150 caracteres.',

            'biografia.required' => 'La biografía es obligatoria.',
            'biografia.min' => 'La biografía debe tener al menos 10 caracteres.',
            'biografia.max' => 'La biografía no puede superar 500 caracteres.',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Los datos enviados no son válidos.',
                'errors' => $validator->errors(),
            ], 422);
        }

        $data = $validator->validated();

        $user->nombre = trim($data['nombre']);
        $user->apellido = isset($data['apellido']) && trim((string) $data['apellido']) !== ''
    ? trim($data['apellido'])
    : null;
        $user->profesion = trim($data['profesion']);
        $user->biografia = trim($data['biografia']);
        $user->save();

        return response()->json([
            'message' => 'Perfil guardado correctamente.',
            'data' => [
                'nombre'    => $user->nombre,
                'apellido'  => $user->apellido,
                'profesion' => $user->profesion,
                'biografia' => $user->biografia,
            ]
        ], 200);
    }
}