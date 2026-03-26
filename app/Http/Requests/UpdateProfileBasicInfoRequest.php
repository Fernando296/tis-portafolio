<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProfileBasicInfoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'nombre' => trim((string) $this->input('nombre', '')),
            'apellido' => trim((string) $this->input('apellido', '')),
            'profesion' => trim((string) $this->input('profesion', '')),
            'biografia' => trim((string) $this->input('biografia', '')),
        ]);
    }

    public function rules(): array
    {
        return [
            'nombre' => ['required', 'string', 'min:2', 'max:100', "regex:/^[\pL\s'-]+$/u"],
            'apellido' => ['required', 'string', 'min:2', 'max:100', "regex:/^[\pL\s'-]+$/u"],
            'profesion' => ['required', 'string', 'min:2', 'max:80'],
            'biografia' => ['required', 'string', 'min:10', 'max:500'],
        ];
    }

    public function messages(): array
    {
        return [
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
            'profesion.max' => 'La profesión no puede superar 80 caracteres.',

            'biografia.required' => 'La biografía es obligatoria.',
            'biografia.min' => 'La biografía debe tener al menos 10 caracteres.',
            'biografia.max' => 'La biografía no puede superar 500 caracteres.',
        ];
    }
}