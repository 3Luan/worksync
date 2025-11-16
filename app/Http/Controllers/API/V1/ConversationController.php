<?php

namespace App\Http\Controllers\API\V1;

use App\Http\Controllers\API\ApiController;
use App\Http\Requests\CreateConversationRequest;
use App\Http\Requests\UpdateConversationRequest;
use App\Http\Requests\UpdateConversationSettingRequest;
use App\Repositories\Conversation\ConversationRepositoryInterface;
use App\Services\LanguageService;
use App\Models\Conversation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Constants\HttpStatus;
use Exception;

class ConversationController extends ApiController
{
  protected $conversationRepository;
  protected $languageService;

  public function __construct(
    ConversationRepositoryInterface $conversationRepository,
    LanguageService $languageService
  ) {
    $this->conversationRepository = $conversationRepository;
    $this->languageService = $languageService;
  }

  /**
   * Get list of conversations (with filters: type, search, user_id)
   * Route: GET /api/conversations
   */
  public function index(Request $request)
  {
    $conversations = $this->conversationRepository->getList($request);

    return $this->successResponse([
      'data' => $conversations,
    ]);
  }

  /**
   * Get a specific conversation.
   * Route: GET /api/conversations/{conversation}
   */
  public function show(Conversation $conversation)
  {
    $conversation = $this->conversationRepository->findById($conversation);

    return $this->successResponse([
      'data' => $conversation,
    ]);
  }

  /**
   * Create a new conversation (1-1 or group)
   * Route: POST /api/conversations
   */
  public function store(CreateConversationRequest $request)
  {
    DB::beginTransaction();
    try {
      $validated = $request->validated();

      $conversation = $this->conversationRepository->create($validated);

      DB::commit();

      return $this->successResponse([
        'message' => $this->languageService->trans('conversation.create_success'),
        'data' => $conversation,
        'status' => HttpStatus::CREATED,
      ]);
    } catch (Exception $e) {
      DB::rollBack();
      Log::error('Create conversation failed: ' . $e->getMessage());

      return $this->errorResponse([
        'message' => $this->languageService->trans('conversation.create_failed'),
        'status' => HttpStatus::INTERNAL_SERVER_ERROR,
      ]);
    }
  }

  /**
   * Update conversation info (name, avatar, description)
   * Route: PUT /api/conversations/{conversation}
   */
  public function update(Conversation $conversation, UpdateConversationRequest $request)
  {
    $validated = $request->validated();

    $result = $this->conversationRepository->update($conversation, $validated);

    if ($result) {
      return $this->successResponse([
        'message' => $this->languageService->trans('conversation.update_success'),
        'data' => $conversation,
      ]);
    }

    return $this->errorResponse([
      'message' => $this->languageService->trans('conversation.update_failed'),
      'status' => HttpStatus::INTERNAL_SERVER_ERROR,
    ]);
  }

  /**
   * Delete (archive) a conversation.
   * Route: DELETE /api/conversations/{conversation}
   */
  public function destroy(Conversation $conversation)
  {
    $deleted = $this->conversationRepository->delete($conversation);

    if ($deleted) {
      return $this->successResponse([
        'message' => $this->languageService->trans('conversation.delete_success'),
      ]);
    }

    return $this->errorResponse([
      'message' => $this->languageService->trans('conversation.delete_failed'),
      'status' => HttpStatus::INTERNAL_SERVER_ERROR,
    ]);
  }

  /**
   * Restore an archived conversation.
   * Route: POST /api/conversations/{conversation}/restore
   */
  public function restore(Conversation $conversation)
  {
    $restored = $this->conversationRepository->restore($conversation);

    if ($restored) {
      return $this->successResponse([
        'message' => $this->languageService->trans('conversation.restore_success'),
      ]);
    }

    return $this->errorResponse([
      'message' => $this->languageService->trans('conversation.restore_failed'),
      'status' => HttpStatus::INTERNAL_SERVER_ERROR,
    ]);
  }

  /**
   * Add a user to a conversation (group chat only)
   * Route: POST /api/conversations/{conversation}/add-member
   */
  public function addMember(Request $request, Conversation $conversation)
  {
    $request->validate([
      'user_id' => 'required|integer|exists:users,id',
      'role' => 'nullable|string|in:owner,admin,member',
    ]);

    $added = $this->conversationRepository->addMember(
      $conversation->id,
      $request->user_id,
      $request->role ?? 'member'
    );

    if ($added) {
      return $this->successResponse([
        'message' => $this->languageService->trans('conversation.add_member_success'),
      ]);
    }

    return $this->errorResponse([
      'message' => $this->languageService->trans('conversation.add_member_failed'),
    ]);
  }

  /**
   * Remove a member from a conversation.
   * Route: DELETE /api/conversations/{conversation}/remove-member
   */
  public function removeMember(Request $request, Conversation $conversation)
  {
    $request->validate([
      'user_id' => 'required|integer|exists:users,id',
    ]);

    $removed = $this->conversationRepository->removeMember($conversation->id, $request->user_id);

    if ($removed) {
      return $this->successResponse([
        'message' => $this->languageService->trans('conversation.remove_member_success'),
      ]);
    }

    return $this->errorResponse([
      'message' => $this->languageService->trans('conversation.remove_member_failed'),
    ]);
  }

  /**
   * Get members of a conversation.
   * Route: GET /api/conversations/{conversation}/members
   */
  public function getMembers(Conversation $conversation)
  {
    $members = $this->conversationRepository->getMembers($conversation->id);

    return $this->successResponse([
      'data' => $members,
    ]);
  }

  /**
   * Get all conversations of the current user.
   * Route: GET /api/my-conversations
   */
  public function getMyConversations(Request $request)
  {
    $userId = Auth::id();

    $conversations = $this->conversationRepository->getByUser($userId, $request);

    return $this->successResponse([
      'data' => $conversations,
    ]);
  }

  /**
   * Pin a conversation for the current user.
   * Route: POST /api/conversations/{conversation}/pin
   */
  public function pin(Conversation $conversation)
  {
    $result = $this->conversationRepository->pinConversation($conversation->id, Auth::id());

    return $result
      ? $this->successResponse(['message' => $this->languageService->trans('conversation.pin_success')])
      : $this->errorResponse(['message' => $this->languageService->trans('conversation.pin_failed')]);
  }

  /**
   * Mute a conversation for a user (optional minutes param)
   * Route: POST /api/conversations/{conversation}/mute
   */
  public function mute(Request $request, Conversation $conversation)
  {
    $request->validate(['minutes' => 'nullable|integer|min:1']);

    $result = $this->conversationRepository->muteConversation(
      $conversation->id,
      Auth::id(),
      $request->minutes
    );

    return $result
      ? $this->successResponse(['message' => $this->languageService->trans('conversation.mute_success')])
      : $this->errorResponse(['message' => $this->languageService->trans('conversation.mute_failed')]);
  }

  /**
   * Unmute conversation for the current user.
   * Route: POST /api/conversations/{conversation}/unmute
   */
  public function unmute(Conversation $conversation)
  {
    $result = $this->conversationRepository->unmuteConversation($conversation->id, Auth::id());

    return $result
      ? $this->successResponse(['message' => $this->languageService->trans('conversation.unmute_success')])
      : $this->errorResponse(['message' => $this->languageService->trans('conversation.unmute_failed')]);
  }

  /**
   * Get conversation settings (theme, emoji, etc.)
   * Route: GET /api/conversations/{conversation}/settings
   */
  public function getSettings(Conversation $conversation)
  {
    $settings = $this->conversationRepository->getSettings($conversation->id);

    return $this->successResponse([
      'data' => $settings,
    ]);
  }

  /**
   * Update conversation settings.
   * Route: PUT /api/conversations/{conversation}/settings
   */
  public function updateSettings(UpdateConversationSettingRequest $request, Conversation $conversation)
  {
    $validated = $request->validated();

    $result = $this->conversationRepository->updateSettings($conversation->id, $validated);

    return $result
      ? $this->successResponse(['message' => $this->languageService->trans('conversation.update_setting_success')])
      : $this->errorResponse(['message' => $this->languageService->trans('conversation.update_setting_failed')]);
  }
}
