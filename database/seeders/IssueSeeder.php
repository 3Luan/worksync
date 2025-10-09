<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Carbon\Carbon;

class IssueSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('issues')->insert([
            [
                'project_id' => 1,
                'reporter_id' => 1,
                'assignee_id' => 2,
                'column_id' => 1,
                'key' => 'WS-1',
                'title' => 'Setup Laravel project structure',
                'description' => 'Initialize Laravel, setup authentication and migrations.',
                'type' => 'task',
                'priority' => 'high',
                'due_date' => Carbon::now()->addDays(5),
            ],
            [
                'project_id' => 1,
                'reporter_id' => 1,
                'assignee_id' => 3,
                'column_id' => 2,
                'key' => 'WS-2',
                'title' => 'Implement Kanban board UI',
                'description' => 'Frontend drag-and-drop columns for tasks.',
                'type' => 'story',
                'priority' => 'medium',
                'due_date' => Carbon::now()->addDays(10),
            ],
        ]);
    }
}
