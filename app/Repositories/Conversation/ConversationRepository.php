<?php

namespace App\Repositories\Conversation;

use App\Models\Conversation;
use App\Models\ConversationMember;
use App\Models\ConversationSetting;
use App\Models\Message;
use App\Models\MessageRead;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Exception;

class ConversationRepository implements ConversationRepositoryInterface
{
  use \App\Http\Controllers\Concerns\Paginatable;

  /**
   * Retrieve a list of conversations with filters.
   */
  public function getList(Request $request)
  {
    try {
      $userId = Auth::id();

      $query = Conversation::query()
        ->with([
          'members.user',
          'lastMessage.sender',
          'lastUnreadMessage.sender',
        ])
        ->whereHas('members', fn($q) => $q->where('user_id', $userId))
        ->withCount([
          'messages as unread_count' => function ($q) use ($userId) {
            $q->whereNotIn('id', function ($sub) use ($userId) {
              $sub->select('message_id')
                ->from('message_reads')
                ->where('user_id', $userId);
            })
              ->where('sender_id', '<>', $userId);
          },
        ])
        ->orderBy('updated_at', 'desc');

      if ($request->filled('type')) {
        $query->where('type', $request->type);
      }

      if ($request->filled('search')) {
        $query->where('name', 'like', '%' . $request->search . '%');
      }

      if (filter_var($request->get('get_all'), FILTER_VALIDATE_BOOLEAN)) {
        return $query->get();
      }

      return $query->paginate($this->getPerPage());
    } catch (Exception $e) {
      Log::error('Failed to get conversations: ' . $e->getMessage());
      return null;
    }
  }


  /**
   * Find a specific conversation.
   */
  public function findById(Conversation $conversation)
  {
    try {
      return $conversation->load(['members.user', 'lastMessage']);
    } catch (Exception $e) {
      Log::error('Failed to find conversation: ' . $e->getMessage());
      return null;
    }
  }

  /**
   * Create a new conversation.
   */
  public function create(array $validatedData)
  {
    DB::beginTransaction();
    try {
      $key = $this->generateConversationKey($validatedData);

      $conversation = Conversation::create([
        'type' => $validatedData['type'],
        'key' => $key,
        'name' => $validatedData['name'] ?? null,
        'avatar' => $validatedData['avatar'] ?? null,
        'description' => $validatedData['description'] ?? null,
        'created_by' => Auth::id(),
      ]);

      if (!empty($validatedData['members']) && is_array($validatedData['members'])) {
        foreach ($validatedData['members'] as $memberId) {
          ConversationMember::create([
            'conversation_id' => $conversation->id,
            'user_id' => $memberId,
            'role' => Conversation::ROLE_MEMBER,
            'joined_at' => now(),
          ]);
        }
      }

      ConversationMember::updateOrCreate(
        ['conversation_id' => $conversation->id, 'user_id' => Auth::id()],
        ['role' => Conversation::ROLE_ADMIN, 'joined_at' => now()]
      );

      ConversationSetting::create([
        'conversation_id' => $conversation->id,
        'theme_color' => '#6366F1',
        'default_emoji' => '💬',
        'allow_reactions' => true,
        'allow_mentions' => true,
        'allow_media' => true,
      ]);

      DB::commit();

      return $conversation->load(['members.user', 'settings']);
    } catch (Exception $e) {
      DB::rollBack();
      Log::error('Failed to create conversation: ' . $e->getMessage());
      throw $e;
    }
  }

  /**
   * Generate a unique conversation key.
   * Ví dụ: cho "direct" thì tạo t_1_2, cho "group" thì tạo uuid ngẫu nhiên.
   */
  protected function generateConversationKey(array $data): string
  {
    if ($data['type'] === Conversation::TYPE_DIRECT && !empty($data['members'])) {
      $ids = collect($data['members'])
        ->merge([Auth::id()])
        ->unique()
        ->sort()
        ->values();

      return 't_' . $ids->join('_');
    } else if ($data['type'] === Conversation::TYPE_GROUP) {
      // Group types
      return 'g_' . uniqid();
    } else {
      // Channel types
      return 'c_' . uniqid();
    }
  }

  /**
   * Update conversation details.
   */
  public function update(Conversation $conversation, array $validatedData)
  {
    try {
      return $conversation->update($validatedData);
    } catch (Exception $e) {
      Log::error('Failed to update conversation: ' . $e->getMessage());
      return false;
    }
  }

  /**
   * Soft delete (archive) conversation.
   */
  public function delete(Conversation $conversation)
  {
    try {
      return $conversation->delete();
    } catch (Exception $e) {
      Log::error('Failed to delete conversation: ' . $e->getMessage());
      return false;
    }
  }

  /**
   * Restore archived conversation.
   */
  public function restore(Conversation $conversation)
  {
    try {
      return $conversation->restore();
    } catch (Exception $e) {
      Log::error('Failed to restore conversation: ' . $e->getMessage());
      return false;
    }
  }

  /**
   * Add member to conversation.
   */
  public function addMember(int $conversationId, int $userId, string $role = 'member')
  {
    try {
      ConversationMember::updateOrCreate(
        ['conversation_id' => $conversationId, 'user_id' => $userId],
        ['role' => $role, 'joined_at' => now()]
      );
      return true;
    } catch (Exception $e) {
      Log::error('Failed to add member: ' . $e->getMessage());
      return false;
    }
  }

  /**
   * Remove member from conversation.
   */
  public function removeMember(int $conversationId, int $userId)
  {
    try {
      return ConversationMember::where('conversation_id', $conversationId)
        ->where('user_id', $userId)
        ->delete();
    } catch (Exception $e) {
      Log::error('Failed to remove member: ' . $e->getMessage());
      return false;
    }
  }

  /**
   * Get all members of a conversation.
   */
  public function getMembers(int $conversationId)
  {
    try {
      return ConversationMember::where('conversation_id', $conversationId)
        ->with('user')
        ->get();
    } catch (Exception $e) {
      Log::error('Failed to get members: ' . $e->getMessage());
      return null;
    }
  }

  /**
   * Get all conversations that a user participates in.
   */
  public function getByUser(int $userId, ?Request $request = null)
  {
    try {
      $query = Conversation::whereHas('members', function ($q) use ($userId) {
        $q->where('user_id', $userId);
      })->with(['lastMessage', 'members.user']);

      if ($request?->filled('type')) {
        $query->where('type', $request->type);
      }

      return $query->paginate($this->getPerPage());
    } catch (Exception $e) {
      Log::error('Failed to get conversations by user: ' . $e->getMessage());
      return null;
    }
  }

  /**
   * Pin a conversation for a user.
   */
  public function pinConversation(int $conversationId, int $userId)
  {
    try {
      $member = ConversationMember::where('conversation_id', $conversationId)
        ->where('user_id', $userId)
        ->first();

      if (!$member)
        return false;

      $member->update(['is_pinned' => true]);
      return true;
    } catch (Exception $e) {
      Log::error('Failed to pin conversation: ' . $e->getMessage());
      return false;
    }
  }

  /**
   * Mute conversation for a user (optional duration in minutes).
   */
  public function muteConversation(int $conversationId, int $userId, ?int $minutes = null)
  {
    try {
      $until = $minutes ? now()->addMinutes($minutes) : now()->addYears(10);
      ConversationMember::where('conversation_id', $conversationId)
        ->where('user_id', $userId)
        ->update(['muted_until' => $until]);
      return true;
    } catch (Exception $e) {
      Log::error('Failed to mute conversation: ' . $e->getMessage());
      return false;
    }
  }

  /**
   * Unmute conversation.
   */
  public function unmuteConversation(int $conversationId, int $userId)
  {
    try {
      ConversationMember::where('conversation_id', $conversationId)
        ->where('user_id', $userId)
        ->update(['muted_until' => null]);
      return true;
    } catch (Exception $e) {
      Log::error('Failed to unmute conversation: ' . $e->getMessage());
      return false;
    }
  }

  /**
   * Get conversation settings.
   */
  public function getSettings(int $conversationId)
  {
    try {
      return ConversationSetting::where('conversation_id', $conversationId)->first();
    } catch (Exception $e) {
      Log::error('Failed to get conversation settings: ' . $e->getMessage());
      return null;
    }
  }

  /**
   * Update conversation settings.
   */
  public function updateSettings(int $conversationId, array $settings)
  {
    try {
      $setting = ConversationSetting::where('conversation_id', $conversationId)->first();
      if (!$setting) {
        $setting = ConversationSetting::create([
          'conversation_id' => $conversationId,
        ]);
      }
      $setting->update($settings);
      return true;
    } catch (Exception $e) {
      Log::error('Failed to update conversation settings: ' . $e->getMessage());
      return false;
    }
  }

  /**
   * Mark all messages as delivered to a user in a conversation.
   *
   * @param int $conversationId
   * @return bool
   */
  public function markMessagesAsDelivered(int $conversationId)
  {
    try {
      $userId = Auth::id();
      // update tất cả tin nhắn của conversation đó nếu sender khác userId và status == 'sent' thành 'delivered'
      Message::where('conversation_id', $conversationId)
        ->where('sender_id', '!=', $userId)
        ->where('status', Message::STATUS_SENT)
        ->update(['status' => Message::STATUS_DELIVERED]);

      return true;
    } catch (Exception $e) {
      Log::error('Failed to mark messages as delivered: ' . $e->getMessage());
      return false;
    }
  }

  /**
   * Mark all messages as delivered by a user on all conversations.
   *
   * @return array | bool
   */
  public function markAllMessagesAsDelivered()
  {
    try {
      $userId = Auth::id();

      // Lấy danh sách conversation_id của tin nhắn sẽ được cập nhật
      $conversationIds = Message::where('sender_id', '!=', $userId)
        ->where('status', Message::STATUS_SENT)
        ->distinct()
        ->pluck('conversation_id')
        ->toArray();

      // Cập nhật trạng thái
      Message::where('sender_id', '!=', $userId)
        ->where('status', Message::STATUS_SENT)
        ->update([
          'status' => Message::STATUS_DELIVERED,
        ]);

      return $conversationIds;
    } catch (Exception $e) {
      Log::error('Failed to mark all messages as delivered: ' . $e->getMessage());
      return false;
    }
  }


  /**
   * Mark all messages as seen by a user on a specific conversation.
   *
   * @param int $conversationId
   * @return bool
   */
  public function markMessagesAsSeen(int $conversationId)
  {
      try {
          $userId = Auth::id();

          // 🔹 Lấy danh sách tin nhắn chưa đọc
          $messageIds = Message::where('conversation_id', $conversationId)
              ->where('sender_id', '!=', $userId)
              ->pluck('id')
              ->toArray();

          if (empty($messageIds)) {
              return true;
          }

          // 🔹 Tạo danh sách dữ liệu insert
          $data = [];
          $now = now();

          foreach ($messageIds as $id) {
              $data[] = [
                  'message_id' => $id,
                  'user_id'    => $userId,
                  'read_at'    => $now,
              ];
          }

          // 🔹 Ghi vào bảng message_reads, bỏ qua trùng lặp
          MessageRead::insertOrIgnore($data);

          // 🔹 Cập nhật trạng thái trong bảng messages
          Message::whereIn('id', $messageIds)
              ->where('status', '<', Message::STATUS_SEEN)
              ->update(['status' => Message::STATUS_SEEN]);

          // 🔹 Gửi event real-time (tùy chọn)
          // broadcast(new \App\Events\MessageSeen($conversationId, $messageIds))->toOthers();

          return true;
      } catch (\Throwable $e) {
          Log::error('Failed to mark messages as seen: ' . $e->getMessage());
          return false;
      }
  }

}
