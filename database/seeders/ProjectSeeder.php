<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProjectSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('projects')->insert([
            [
                'key' => 'WS',
                'name' => 'WorkSync Core',
                'description' => 'Main project management system like Jira.',
                'owner_id' => 1,
            ],
            [
                'key' => 'HRM',
                'name' => 'HR Management',
                'description' => 'Internal HR tools project.',
                'owner_id' => 1,
            ],
        ]);
    }
}
