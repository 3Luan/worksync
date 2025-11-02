<?php

namespace App\Events;

use App\Models\Message;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Support\Facades\Log;

use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;

class MessageSent implements ShouldBroadcastNow
{
    public $message;
    public $receiverId;

    public function __construct(Message $message, $receiverId)
    {
        $this->message = $message->load('sender');
        $this->receiverId = $receiverId;
    }

    public function broadcastWith()
    {
        return [
            'message' => $this->message->load('sender', 'attachments'),
        ];
    }

    public function broadcastOn()
    {
        Log::info(new PrivateChannel('user.'  . $this->receiverId));
        return [
            new PrivateChannel('conversation.' . $this->message->conversation_id),
            new PrivateChannel('user.'  . $this->receiverId),
        ];
    }

    public function broadcastAs(): string
    {
        return 'message.sent';
    }
}
