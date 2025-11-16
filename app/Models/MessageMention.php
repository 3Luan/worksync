<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MessageMention extends Model
{
  use HasFactory;

  protected $fillable = [
    'message_id',
    'mentioned_user_id',
  ];

  public function message()
  {
    return $this->belongsTo(Message::class);
  }

  public function mentionedUser()
  {
    return $this->belongsTo(User::class, 'mentioned_user_id');
  }
}
