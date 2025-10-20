<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ConversationInvitation extends Model
{
  use HasFactory;

  protected $fillable = [
    'conversation_id',
    'inviter_id',
    'invitee_id',
    'status',
  ];

  public function conversation()
  {
    return $this->belongsTo(Conversation::class);
  }

  public function inviter()
  {
    return $this->belongsTo(User::class, 'inviter_id');
  }

  public function invitee()
  {
    return $this->belongsTo(User::class, 'invitee_id');
  }
}
