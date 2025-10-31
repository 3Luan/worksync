<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('conversation.{conversationId}', function ($user, $conversationId) {
    // trả về true nếu user là thành viên conversation
    // ví dụ bạn có model Conversation và table conversation_user
    return \App\Models\Conversation::find($conversationId)
        ->members->contains('user_id', $user->id);
});
