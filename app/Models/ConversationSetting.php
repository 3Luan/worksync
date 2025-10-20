<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ConversationSetting extends Model
{
  use HasFactory;

  protected $fillable = [
    'conversation_id',
    'theme_color',
    'default_emoji',
    'allow_reactions',
    'allow_mentions',
    'allow_media',
  ];

  public function conversation()
  {
    return $this->belongsTo(Conversation::class);
  }
}
