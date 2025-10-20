<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Message extends Model
{
  use HasFactory, SoftDeletes;

  protected $fillable = [
    'conversation_id',
    'sender_id',
    'parent_message_id',
    'forward_from_id',
    'content',
    'type',
    'metadata',
    'is_pinned',
    'is_recalled',
    'is_deleted_for_all',
    'status',
  ];

  protected $casts = [
    'metadata' => 'array',
  ];

  public function conversation()
  {
    return $this->belongsTo(Conversation::class);
  }

  public function sender()
  {
    return $this->belongsTo(User::class, 'sender_id');
  }

  public function parent()
  {
    return $this->belongsTo(Message::class, 'parent_message_id');
  }

  public function replies()
  {
    return $this->hasMany(Message::class, 'parent_message_id');
  }

  public function forwardFrom()
  {
    return $this->belongsTo(Message::class, 'forward_from_id');
  }

  public function attachments()
  {
    return $this->hasMany(Attachment::class);
  }

  public function reactions()
  {
    return $this->hasMany(MessageReaction::class);
  }

  public function mentions()
  {
    return $this->hasMany(MessageMention::class);
  }

  public function reads()
  {
    return $this->hasMany(MessageRead::class);
  }
}
