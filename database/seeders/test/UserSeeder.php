<?php

namespace Database\Seeders\Test;

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
            'last_name' => 'Admin',
            'first_name' => 'Admin',
            'email' => 'admin@example.com',
            'password' => bcrypt('password'),
            'role' => User::ROLE_ADMIN,
            'status' => User::STATUS_ACTIVE,
        ]);

        User::create([
            'last_name' => 'Staff',
            'first_name' => 'Staff',
            'email' => 'staff@example.com',
            'password' => bcrypt('password'),
            'role' => User::ROLE_STAFF_MEMBER,
            'status' => User::STATUS_ACTIVE,
        ]);

        User::create([
            'last_name' => 'Staff',
            'first_name' => 'Staff',
            'email' => 'staff2@example.com',
            'password' => bcrypt('password'),
            'role' => User::ROLE_STAFF_MEMBER,
            'status' => User::STATUS_ACTIVE,
        ]);

        User::create([
            'last_name' => 'Leader',
            'first_name' => 'Leader',
            'email' => 'leader@example.com',
            'password' => bcrypt('password'),
            'role' => User::ROLE_STAFF_LEADER,
            'status' => User::STATUS_ACTIVE,
        ]);

        User::factory()->count(10)->create();
    }
}
