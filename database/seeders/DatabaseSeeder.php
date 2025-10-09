<?php

namespace Database\Seeders;

use Database\Seeders\Test\TestSeeder;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            ProjectSeeder::class,
            BoardSeeder::class,
            ColumnSeeder::class,
            IssueSeeder::class,
            CommentSeeder::class,
            LabelSeeder::class,
            IssueLabelSeeder::class,
            ActivityLogSeeder::class,
        ]);
    }
}
