<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Token extends Model
{
  const TYPE_RESET_PASSWORD = 1;
  protected $fillable = [
    'type',
    'user_id',
    'key',
    'expired_at',
  ];

  /**
   * Generate key
   *
   */
  public static function generateKey()
  {
    do {
      $key = Str::random(60);
    } while (Token::where('key', $key)->exists());
    return $key;
  }

  /**
   * Eloquent relationship with user
   *
   */
  public function user()
  {
    return $this->belongsTo(User::class);
  }
}
