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
            'username' => 'admin',
            'avatar' => 'https://i.pravatar.cc/200?img=1',
            'email' => 'admin@example.com',
            'password' => bcrypt('password'),
            'role' => User::ROLE_ADMIN,
            'status' => User::STATUS_ONLINE,
        ]);

        User::create([
            'name' => 'Leader',
            'username' => 'leader',
            'avatar' => 'https://i.pravatar.cc/200?img=2',
            'email' => 'leader@example.com',
            'password' => bcrypt('password'),
            'role' => User::ROLE_LEADER,
            'status' => User::STATUS_ONLINE,
        ]);

        User::create([
            'name' => 'User',
            'username' => 'user',
            'avatar' => 'https://i.pravatar.cc/200?img=3',
            'email' => 'user@example.com',
            'password' => bcrypt('password'),
            'role' => User::ROLE_MEMBER,
            'status' => User::STATUS_ONLINE,
        ]);

        User::create([
            'name' => 'User 1',
            'username' => 'user1',
            'avatar' => 'https://i.pravatar.cc/200?img=4',
            'email' => 'user1@example.com',
            'password' => bcrypt('password'),
            'role' => User::ROLE_MEMBER,
            'status' => User::STATUS_ONLINE,
        ]);

        User::factory()->count(10)->create();
    }
}
