<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ColumnSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('columns')->insert([
            ['board_id' => 1, 'name' => 'To Do', 'position' => 1],
            ['board_id' => 1, 'name' => 'In Progress', 'position' => 2],
            ['board_id' => 1, 'name' => 'Review', 'position' => 3],
            ['board_id' => 1, 'name' => 'Done', 'position' => 4],
        ]);
    }
}
