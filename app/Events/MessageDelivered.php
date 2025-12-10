<?php

namespace App\Events;

use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;

class MessageDelivered implements ShouldBroadcastNow
{
    public $conversationId;

    /**
     * Tạo event mới.
     */
    public function __construct($conversationId)
    {
        $this->conversationId = $conversationId;
    }

    /**
     * Kênh private để broadcast.
     */
    public function broadcastOn()
    {
        return new PrivateChannel("conversation.{$this->conversationId}");
    }

    /**
     * Tên event phía frontend sẽ lắng nghe.
     */
    public function broadcastAs(): string
    {
        return 'message.delivered';
    }

    /**
     * Payload gửi đi.
     */
    public function broadcastWith(): array
    {
        return [
            'conversation_id' => $this->conversationId,
        ];
    }
}
