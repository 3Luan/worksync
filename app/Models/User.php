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

    const ROLE_ADMIN = 0;
    const ROLE_STAFF_MEMBER = 1;
    const ROLE_STAFF_LEADER = 2;
    const ROLE_STAFF_ACCOUNTANT = 3;
    const STATUS_ACTIVE = 1;
    const STATUS_INACTIVE = 0;
    const STATUSES = [
        self::STATUS_ACTIVE,
        self::STATUS_INACTIVE
    ];
    const ROLES = [
        self::ROLE_ADMIN,
        self::ROLE_STAFF_MEMBER,
        self::ROLE_STAFF_LEADER,
        self::ROLE_STAFF_ACCOUNTANT
    ];
    const ROLE_MANAGEMENTS = [
        self::ROLE_ADMIN,
        self::ROLE_STAFF_LEADER,
    ];
    const ROLE_STAFF = [
        self::ROLE_STAFF_MEMBER,
        self::ROLE_STAFF_LEADER,
        self::ROLE_STAFF_ACCOUNTANT
    ];

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'last_name',
        'first_name',
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
     * Summary of time_cards
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function time_cards()
    {
        return $this->hasMany(TimeCard::class);
    }

    /**
     * Summary of leave_requests
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function leaveRequests()
    {
        return $this->hasMany(LeaveRequest::class);
    }

    /**
     * Summary of remote_requests
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function remoteWorkRequests()
    {
        return $this->hasMany(RemoteWorkRequest::class);
    }

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    public function getNameAttribute()
    {
        return implode(' ', [$this->last_name, $this->first_name]);
    }
}
