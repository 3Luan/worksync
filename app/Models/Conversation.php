<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Conversation extends Model
{
  use HasFactory, SoftDeletes;

  // Conversation role
  const ROLE_ADMIN = 0;
  const ROLE_MEMBER = 1;

  // Conversation type
  const TYPE_DIRECT = 0;
  const TYPE_GROUP = 1;
  const TYPE_CHANNEL = 2;

  protected $fillable = [
    'key',
    'type',
    'name',
    'avatar',
    'description',
    'created_by',
    'last_message_id',
    'is_archived',
  ];

  public function creator()
  {
    return $this->belongsTo(User::class, 'created_by');
  }

  public function members()
  {
    return $this->hasMany(ConversationMember::class);
  }

  public function messages()
  {
    return $this->hasMany(Message::class);
  }

  public function lastMessage()
  {
    return $this->belongsTo(Message::class, 'last_message_id');
  }

  public function settings()
  {
    return $this->hasOne(ConversationSetting::class);
  }

  public function pinnedMessages()
  {
    return $this->hasMany(PinnedMessage::class);
  }
}
