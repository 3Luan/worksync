<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'name' => 'Admin',
            'email' => 'admin@example.com',
            'password' => bcrypt('password'),
            'role' => User::ROLE_ADMIN,
            'status' => User::STATUS_ACTIVE,
        ]);

          User::create([
            'name' => 'Leader',
            'email' => 'leader@example.com',
            'password' => bcrypt('password'),
            'role' => User::ROLE_LEADER,
            'status' => User::STATUS_ACTIVE,
        ]);

        User::create([
            'name' => 'Developer',
            'email' => 'developer@example.com',
            'password' => bcrypt('password'),
            'role' => User::ROLE_DEVELOPER,
            'status' => User::STATUS_ACTIVE,
        ]);

        User::create([
            'name' => 'Tester',
            'email' => 'tester@example.com',
            'password' => bcrypt('password'),
            'role' => User::ROLE_TESTER,
            'status' => User::STATUS_ACTIVE,
        ]);

        User::factory()->count(10)->create();
    }
}
