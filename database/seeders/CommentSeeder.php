<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CommentSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('comments')->insert([
            [
                'issue_id' => 1,
                'user_id' => 2,
                'content' => 'I started working on this setup today.',
            ],
            [
                'issue_id' => 2,
                'user_id' => 3,
                'content' => 'UI draft is ready, need API integration.',
            ],
        ]);
    }
}
