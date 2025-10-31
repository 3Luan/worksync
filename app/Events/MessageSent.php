<?php

namespace App\Events;

use App\Models\Message;
use Illuminate\Broadcasting\Channel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class MessageSent implements ShouldBroadcast
{
  use SerializesModels;

  public $message;

  /**
   * Tạo event chứa dữ liệu tin nhắn
   */
  public function __construct(Message $message)
  {
    // Tải kèm user để phía frontend có thể hiển thị
    $this->message = $message->load('sender');
  }

  /**
   * Kênh Reverb sẽ broadcast
   */
  public function broadcastOn(): Channel
  {
    return new Channel('conversation.' . $this->message->conversation_id);
  }

  /**
   * Tên sự kiện (client sẽ listen theo tên này)
   */
  public function broadcastAs(): string
  {
    return 'message.sent';
  }
}
