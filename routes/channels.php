<?php

use App\Models\Conversation;
use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\Facades\Log;

Broadcast::channel('conversation.{id}', function ($user, $id) {
  return Conversation::where('id', $id)
    ->whereHas('members', fn($q) => $q->where('user_id', $user->id))
    ->exists();
});

Broadcast::channel('user.{id}', function ($user, $id) {
  Log::info("User channel accessed by user ID: {$user->id} for channel ID: {$id}");
  return (int) $user->id === (int) $id;
});
