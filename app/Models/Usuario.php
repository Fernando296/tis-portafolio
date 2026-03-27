<?php
/*
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Usuario extends Model
{
    use HasFactory;
}
*/
//<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens; //estube poniendo

class Usuario extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $table = 'usuarios';
    protected $primaryKey = 'id_usuario';
    //public $timestamps = false;
    public $incrementing = true;
    protected $keyType = 'int';

    const CREATED_AT = 'fecha_registro';
    const UPDATED_AT = 'updated_at';

    protected $fillable = [
        'email',
        'password_hash',
        'slug',
        'nombre',
        'apellido',
        'profesion',
        'biografia',
        'foto_url',
        'ciudad',
        'pais',
        'telefono',
        'sitio_web',
        'rol',
        'activo',
        'fecha_registro',
        'ultimo_acceso',
        'updated_at',
    ];

    protected $hidden = [
        'password_hash',
    ];
    protected $casts = [
        'activo' => 'boolean',
        'fecha_registro' => 'datetime',
        'ultimo_acceso' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function getAuthPassword()
    {
        return $this->password_hash;
    }
}
