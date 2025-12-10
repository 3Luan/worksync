<?php

namespace App\Repositories\Message;

use App\Models\Message;
use App\Models\Conversation;
use App\Models\MessageRead;
use App\Models\MessageReaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Exception;

class MessageRepository implements MessageRepositoryInterface
{
  use \App\Http\Controllers\Concerns\Paginatable;

  /**
   * Retrieve a list of messages based on filters (conversation, sender, etc.).
   *
   * @param Request $request
   * @return mixed
   */
  public function getList(Request $request)
  {
    try {
      $query = Message::query()
        ->with(['sender', 'attachments', 'reactions', 'mentions']);

      // Filter
      if ($request->filled('conversation_id')) {
        $query->where('conversation_id', $request->conversation_id);
      }

      if ($request->filled('sender_id')) {
        $query->where('sender_id', $request->sender_id);
      }

      if ($request->filled('search')) {
        $query->where('content', 'LIKE', '%' . $request->search . '%');
      }

      // Sắp xếp (desc để lấy mới nhất)
      $query->orderBy('created_at', $request->get('sort', 'desc'));

      // Lấy tất cả hoặc phân trang
      if (filter_var($request->get('get_all'), FILTER_VALIDATE_BOOLEAN)) {
        return $query->get();
      }

      return $query->paginate($this->getPerPage());
    } catch (Exception $e) {
      Log::error('Failed to retrieve messages: ' . $e->getMessage());
      return response()->json(['error' => 'Server error'], 500);
    }
  }

  /**
   * Get a specific message by ID.
   *
   * @param Message $message
   * @return Message|null
   */
  public function findById(Message $message)
  {
    try {
      return $message->load(['sender', 'attachments', 'reactions', 'mentions']);
    } catch (Exception $e) {
      Log::error('Failed to find message: ' . $e->getMessage());
      return null;
    }
  }

  /**
   * Create a new message.
   *
   * @param array $validatedData
   * @return Message|null
   */
  public function create(array $validatedData)
  {
    DB::beginTransaction();
    try {
      $validatedData['sender_id'] = $validatedData['sender_id'] ?? Auth::id();

      /** @var Message $message */
      $message = Message::create($validatedData);

      // Handle attachments if provided
      if (!empty($validatedData['attachments'])) {
        $message->attachments()->createMany($validatedData['attachments']);
      }

      // Update conversation last message
      Conversation::where('id', $message->conversation_id)
        ->update(['last_message_id' => $message->id]);

      DB::commit();
      return $message->load(['attachments', 'sender']);
    } catch (Exception $e) {
      DB::rollBack();
      Log::error('Failed to create message: ' . $e->getMessage());
      return null;
    }
  }

  /**
   * Update message content or metadata.
   *
   * @param Message $message
   * @param array $validatedData
   * @return bool
   */
  public function update(Message $message, array $validatedData)
  {
    try {
      return $message->update($validatedData);
    } catch (Exception $e) {
      Log::error('Failed to update message: ' . $e->getMessage());
      return false;
    }
  }

  /**
   * Soft delete (hide) a message for everyone.
   *
   * @param Message $message
   * @return bool
   */
  public function delete(Message $message)
  {
    try {
      return $message->delete();
    } catch (Exception $e) {
      Log::error('Failed to delete message: ' . $e->getMessage());
      return false;
    }
  }

  /**
   * Restore a soft-deleted message.
   *
   * @param Message $message
   * @return bool
   */
  public function restore(Message $message)
  {
    try {
      return $message->restore();
    } catch (Exception $e) {
      Log::error('Failed to restore message: ' . $e->getMessage());
      return false;
    }
  }

  /**
   * Permanently delete a message (force delete).
   *
   * @param Message $message
   * @return bool
   */
  public function forceDelete(Message $message)
  {
    try {
      return $message->forceDelete();
    } catch (Exception $e) {
      Log::error('Failed to permanently delete message: ' . $e->getMessage());
      return false;
    }
  }

  /**
   * Mark a message as delivered to the recipient.
   * @param Message $message
   * @return bool
   */
  public function markAsDelivered(Message $message)
  {
    try {
      // update status message
      Message::where('id', $message->id)->update(['status' => Message::STATUS_DELIVERED]);
      return true;
    } catch (Exception $e) {
      Log::error('Failed to mark message as delivered: ' . $e->getMessage());
      return false;
    }
  }

  /**
   * Mark a message as seen by a user.
   *
   * @param Message $message
   * @param int $userId
   * @return bool
   */
  public function markAsSeen(Message $message, int $userId)
  {
    try {
      MessageRead::updateOrCreate([
        'message_id' => $message->id,
        'user_id' => $userId,
      ], [
        'read_at' => now(),
      ]);

      // update status message
      Message::where('id', $message->id)->update(['status' => Message::STATUS_SEEN]);

      return true;
    } catch (Exception $e) {
      Log::error('Failed to mark message as seen: ' . $e->getMessage());
      return false;
    }
  }

  /**
   * Retrieve all messages in a conversation.
   *
   * @param int $conversationId
   * @param Request|null $request
   * @return mixed
   */
  public function getByConversation(int $conversationId, ?Request $request = null)
  {
    try {
      $query = Message::where('conversation_id', $conversationId)
        ->with(['sender', 'attachments', 'reactions'])
        ->orderBy('created_at', 'asc');

      return $query->paginate($this->getPerPage());
    } catch (Exception $e) {
      Log::error('Failed to get messages by conversation: ' . $e->getMessage());
      return null;
    }
  }

  /**
   * Add or update a reaction (emoji) to a message.
   *
   * @param Message $message
   * @param int $userId
   * @param string $emoji
   * @return bool
   */
  public function react(Message $message, int $userId, string $emoji)
  {
    try {
      MessageReaction::updateOrCreate(
        [
          'message_id' => $message->id,
          'user_id' => $userId,
        ],
        ['emoji' => $emoji]
      );
      return true;
    } catch (Exception $e) {
      Log::error('Failed to react to message: ' . $e->getMessage());
      return false;
    }
  }
}
