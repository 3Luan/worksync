<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class IssueLabelSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('issue_labels')->insert([
            ['issue_id' => 1, 'label_id' => 2],
            ['issue_id' => 2, 'label_id' => 1],
        ]);
    }
}
