<?php

namespace App\Repositories\Conversation;

use App\Models\Conversation;
use Illuminate\Http\Request;

interface ConversationRepositoryInterface
{
  /**
   * Retrieve a list of conversations based on filters (e.g. type, member, search).
   *
   * @param Request $request
   * @return mixed
   */
  public function getList(Request $request);

  /**
   * Get a specific conversation by ID.
   *
   * @param Conversation $conversation
   * @return Conversation|null
   */
  public function findById(Conversation $conversation);

  /**
   * Create a new conversation (1-1 or group).
   *
   * @param array $validatedData
   * @return Conversation
   */
  public function create(array $validatedData);

  /**
   * Update conversation details (e.g. name, avatar, description).
   *
   * @param Conversation $conversation
   * @param array $validatedData
   * @return bool
   */
  public function update(Conversation $conversation, array $validatedData);

  /**
   * Soft delete (archive) a conversation.
   *
   * @param Conversation $conversation
   * @return bool
   */
  public function delete(Conversation $conversation);

  /**
   * Restore a soft-deleted (archived) conversation.
   *
   * @param Conversation $conversation
   * @return bool
   */
  public function restore(Conversation $conversation);

  /**
   * Add a member to a conversation (group chat).
   *
   * @param int $conversationId
   * @param int $userId
   * @param string $role
   * @return bool
   */
  public function addMember(int $conversationId, int $userId, string $role = 'member');

  /**
   * Remove a member from a conversation.
   *
   * @param int $conversationId
   * @param int $userId
   * @return bool
   */
  public function removeMember(int $conversationId, int $userId);

  /**
   * Get all members of a conversation.
   *
   * @param int $conversationId
   * @return mixed
   */
  public function getMembers(int $conversationId);

  /**
   * Get all conversations that a user participates in.
   *
   * @param int $userId
   * @param Request|null $request
   * @return mixed
   */
  public function getByUser(int $userId, ?Request $request = null);

  /**
   * Pin a conversation for a specific user.
   *
   * @param int $conversationId
   * @param int $userId
   * @return bool
   */
  public function pinConversation(int $conversationId, int $userId);

  /**
   * Mute a conversation for a specific user.
   *
   * @param int $conversationId
   * @param int $userId
   * @param int|null $minutes
   * @return bool
   */
  public function muteConversation(int $conversationId, int $userId, ?int $minutes = null);

  /**
   * Unmute a conversation for a specific user.
   *
   * @param int $conversationId
   * @param int $userId
   * @return bool
   */
  public function unmuteConversation(int $conversationId, int $userId);

  /**
   * Get conversation settings (theme, color, permissions).
   *
   * @param int $conversationId
   * @return mixed
   */
  public function getSettings(int $conversationId);

  /**
   * Update conversation settings.
   *
   * @param int $conversationId
   * @param array $settings
   * @return bool
   */
  public function updateSettings(int $conversationId, array $settings);
}
