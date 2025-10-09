<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class LabelSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('labels')->insert([
            ['name' => 'Frontend', 'color' => '#4caf50'],
            ['name' => 'Backend', 'color' => '#2196f3'],
            ['name' => 'Bug', 'color' => '#f44336'],
        ]);
    }
}
