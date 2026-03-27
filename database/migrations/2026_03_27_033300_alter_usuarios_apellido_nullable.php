<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement('ALTER TABLE usuarios ALTER COLUMN apellido DROP NOT NULL;');
    }

    public function down(): void
    {
        DB::statement("UPDATE usuarios SET apellido = '' WHERE apellido IS NULL;");
        DB::statement('ALTER TABLE usuarios ALTER COLUMN apellido SET NOT NULL;');
    }
};
