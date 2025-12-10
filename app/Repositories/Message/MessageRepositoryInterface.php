<?php

namespace App\Repositories\Message;

use App\Models\Message;
use Illuminate\Http\Request;

interface MessageRepositoryInterface
{
  /**
   * Retrieve a list of messages based on filters (e.g. conversation, sender, date range).
   *
   * @param Request $request
   * @return mixed
   */
  public function getList(Request $request);

  /**
   * Find a specific message by its ID.
   *
   * @param Message $message
   * @return Message|null
   */
  public function findById(Message $message);

  /**
   * Create a new message with validated data.
   *
   * @param array $validatedData
   * @return Message
   */
  public function create(array $validatedData);

  /**
   * Update the specified message (for example, when editing a message).
   *
   * @param Message $message
   * @param array $validatedData
   * @return Message
   */
  public function update(Message $message, array $validatedData);

  /**
   * Soft delete (hide) the specified message.
   *
   * @param Message $message
   * @return bool
   */
  public function delete(Message $message);

  /**
   * Restore a previously deleted (soft-deleted) message.
   *
   * @param Message $message
   * @return bool
   */
  public function restore(Message $message);

  /**
   * Permanently remove a message (force delete).
   *
   * @param Message $message
   * @return bool
   */
  public function forceDelete(Message $message);

  /**

   * Mark a message as delivered to a user.
   *
   * @param Message $message
   * @return bool
   */
  public function markAsDelivered(Message $message);

  /**
   * Mark a message as seen by a user.
   *
   * @param Message $message
   * @param int $userId
   * @return bool
   */
  public function markAsSeen(Message $message, int $userId);

  /**
   * Get all messages in a specific conversation.
   *
   * @param int $conversationId
   * @param Request|null $request
   * @return mixed
   */
  public function getByConversation(int $conversationId, ?Request $request = null);

  /**
   * React to a message (like, love, laugh, etc.).
   *
   * @param Message $message
   * @param int $userId
   * @param string $emoji
   * @return bool
   */
  public function react(Message $message, int $userId, string $emoji);
}
