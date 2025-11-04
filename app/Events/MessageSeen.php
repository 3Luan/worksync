<?php

namespace App\Events;

use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Support\Facades\Log;

class MessageSeen implements ShouldBroadcastNow
{
    public $conversationId;
    public $userId;

    public function __construct($conversationId, $userId)
    {
        $this->conversationId = $conversationId;
        $this->userId = $userId;
    }

    public function broadcastOn()
    {
        return new PrivateChannel("conversation.{$this->conversationId}");
    }

    public function broadcastAs()
    {
        Log::info('Broadcasting MessageSeen event for conversation ID: ' . $this->conversationId . ' by user ID: ' . $this->userId);
        return 'message.seen';
    }

    public function broadcastWith()
    {
        return [
            'conversation_id' => $this->conversationId,
            'user_id'=> $this->userId
        ];
    }
}

