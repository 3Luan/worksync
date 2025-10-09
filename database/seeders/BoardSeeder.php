<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class BoardSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('boards')->insert([
            ['project_id' => 1, 'name' => 'Development Board'],
            ['project_id' => 2, 'name' => 'HR Tasks Board'],
        ]);
    }
}
