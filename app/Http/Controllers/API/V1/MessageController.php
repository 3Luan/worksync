<?php

namespace App\Http\Controllers\API\V1;

use App\Http\Controllers\API\ApiController;
use App\Http\Requests\GetMessageListRequest;
use App\Http\Requests\CreateMessageRequest;
use App\Http\Requests\UpdateMessageRequest;
use App\Models\Message;
use App\Repositories\Message\MessageRepositoryInterface;
use App\Services\LanguageService;
use App\Constants\HttpStatus;
use App\Events\MessageSent;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Exception;

class MessageController extends ApiController
{
  protected $messageRepository;
  protected $languageService;

  public function __construct(
    MessageRepositoryInterface $messageRepository,
    LanguageService $languageService
  ) {
    $this->messageRepository = $messageRepository;
    $this->languageService = $languageService;
  }

  /**
   * Get all messages (filtered by conversation or sender).
   *
   * @param GetMessageListRequest $request
   * @return \Illuminate\Http\JsonResponse
   */
  public function index(GetMessageListRequest $request)
  {
    $messages = $this->messageRepository->getList($request);

    return $this->successResponse([
      'data' => $messages,
    ]);
  }

  /**
   * Display a specific message.
   * Route: /api/messages/{message}
   *
   * @param Message $message
   * @return \Illuminate\Http\JsonResponse
   */
  public function show(Message $message)
  {
    $message = $this->messageRepository->findById($message);

    return $this->successResponse([
      'data' => $message,
    ]);
  }

  /**
   * Store a new message.
   * Route: /api/messages
   *
   * @param CreateMessageRequest $request
   * @return \Illuminate\Http\JsonResponse
   */
  public function store(CreateMessageRequest $request)
  {
    DB::beginTransaction();
    try {
      $validated = $request->validated();
      $validated['sender_id'] = Auth::id();

      $message = $this->messageRepository->create($validated);

      DB::commit();

      event(new MessageSent($message));

      return $this->successResponse([
        'message' => $this->languageService->trans('message.create_success'),
        'data' => $message,
        'status' => HttpStatus::CREATED,
      ]);
    } catch (Exception $e) {
      DB::rollBack();
      Log::error('Create message failed: ' . $e->getMessage());

      return $this->errorResponse([
        'message' => $this->languageService->trans('message.create_failed'),
        'status' => HttpStatus::INTERNAL_SERVER_ERROR,
      ]);
    }
  }

  /**
   * Update an existing message (e.g. edited content).
   * Route: /api/messages/{message}
   *
   * @param Message $message
   * @param UpdateMessageRequest $request
   * @return \Illuminate\Http\JsonResponse
   */
  public function update(Message $message, UpdateMessageRequest $request)
  {
    $validated = $request->validated();

    $result = $this->messageRepository->update($message, $validated);

    if ($result) {
      return $this->successResponse([
        'message' => $this->languageService->trans('message.update_success'),
        'data' => $message,
      ]);
    }

    return $this->errorResponse([
      'message' => $this->languageService->trans('message.update_failed'),
      'status' => HttpStatus::INTERNAL_SERVER_ERROR,
    ]);
  }

  /**
   * Soft delete a message for everyone.
   * Route: /api/messages/{message}
   *
   * @param Message $message
   * @return \Illuminate\Http\JsonResponse
   */
  public function destroy(Message $message)
  {
    $deleted = $this->messageRepository->delete($message);

    if ($deleted) {
      return $this->successResponse([
        'message' => $this->languageService->trans('message.delete_success'),
      ]);
    }

    return $this->errorResponse([
      'message' => $this->languageService->trans('message.delete_failed'),
      'status' => HttpStatus::INTERNAL_SERVER_ERROR,
    ]);
  }

  /**
   * Restore a soft-deleted message.
   * Route: /api/messages/{message}/restore
   *
   * @param Message $message
   * @return \Illuminate\Http\JsonResponse
   */
  public function restore(Message $message)
  {
    $restored = $this->messageRepository->restore($message);

    if ($restored) {
      return $this->successResponse([
        'message' => $this->languageService->trans('message.restore_success'),
      ]);
    }

    return $this->errorResponse([
      'message' => $this->languageService->trans('message.restore_failed'),
      'status' => HttpStatus::INTERNAL_SERVER_ERROR,
    ]);
  }

  /**
   * Mark a message as read by the authenticated user.
   * Route: /api/messages/{message}/read
   *
   * @param Message $message
   * @return \Illuminate\Http\JsonResponse
   */
  public function markAsRead(Message $message)
  {
    $result = $this->messageRepository->markAsRead($message, Auth::id());

    if ($result) {
      return $this->successResponse([
        'message' => $this->languageService->trans('message.read_success'),
      ]);
    }

    return $this->errorResponse([
      'message' => $this->languageService->trans('message.read_failed'),
      'status' => HttpStatus::INTERNAL_SERVER_ERROR,
    ]);
  }

  /**
   * React to a message with an emoji.
   * Route: /api/messages/{message}/react
   *
   * @param Request $request
   * @param Message $message
   * @return \Illuminate\Http\JsonResponse
   */
  public function react(Request $request, Message $message)
  {
    $request->validate([
      'emoji' => 'required|string|max:20',
    ]);

    $result = $this->messageRepository->react($message, Auth::id(), $request->emoji);

    if ($result) {
      return $this->successResponse([
        'message' => $this->languageService->trans('message.react_success'),
      ]);
    }

    return $this->errorResponse([
      'message' => $this->languageService->trans('message.react_failed'),
      'status' => HttpStatus::INTERNAL_SERVER_ERROR,
    ]);
  }

  /**
   * Get all messages by conversation ID.
   * Route: /api/conversations/{conversationId}/messages
   *
   * @param int $conversationId
   * @param Request $request
   * @return \Illuminate\Http\JsonResponse
   */
  public function getByConversation(int $conversationId, Request $request)
  {
    $messages = $this->messageRepository->getByConversation($conversationId, $request);

    return $this->successResponse([
      'data' => $messages,
    ]);
  }
}
