<?php

namespace App\Models;

use Laravel\Sanctum\HasApiTokens;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable;

    /*  MUY IMPORTANTE */
    protected $table = 'usuarios';

    protected $primaryKey = 'id_usuario';

    public $timestamps = false; // solo si tu tabla no tiene created_at y updated_at

    protected $fillable = [
        'nombre',
        'apellido',
        'email',
        'password',
        'profesion',
        'biografia'
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];
}