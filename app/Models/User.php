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
  const STATUS_ACTIVE = 1;
  const STATUS_BANNED = 2;
  const STATUS_PENDING_VERIFICATION = 3;

  const STATUSES = [
    self::STATUS_INACTIVE,
    self::STATUS_ACTIVE,
    self::STATUS_BANNED,
    self::STATUS_PENDING_VERIFICATION,
  ];

  // Presence
  const PRESENCE_OFFLINE = 0;
  const PRESENCE_ONLINE = 1;

  const PRESENCES = [
    self::PRESENCE_OFFLINE,
    self::PRESENCE_ONLINE,
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
    'presence',
    'last_active_at',
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
