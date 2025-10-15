<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Passport\HasApiTokens;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens, SoftDeletes;

    // User roles
    const ROLE_ADMIN = 0;
    const ROLE_LEADER = 1;
    const ROLE_MEMBER = 2;


    // Statuses
    const STATUS_INACTIVE = 0;
    const STATUS_ONLINE = 1;
    const STATUS_OFFLINE = 2;

    const STATUSES = [
        self::STATUS_ONLINE,
        self::STATUS_INACTIVE,
        self::STATUS_OFFLINE
    ];

    // Grouped roles
    const ROLES = [
        self::ROLE_ADMIN,
        self::ROLE_LEADER,
        self::ROLE_MEMBER,
    ];

    const ROLE_MANAGEMENTS = [
        self::ROLE_ADMIN,
        self::ROLE_LEADER,
    ];

    const ROLE_USERS = [
        self::ROLE_MEMBER,
        self::ROLE_LEADER,
    ];

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'username',
        'avatar',
        'email',
        'password',
        'role',
        'status',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];
}
