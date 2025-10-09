<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ActivityLogSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('activity_logs')->insert([
            [
                'user_id' => 1,
                'project_id' => 1,
                'issue_id' => 1,
                'action' => 'created issue',
                'data' => json_encode(['key' => 'WS-1']),
            ],
            [
                'user_id' => 2,
                'project_id' => 1,
                'issue_id' => 1,
                'action' => 'commented',
                'data' => json_encode(['comment' => 'Started working on setup']),
            ],
        ]);
    }
}
