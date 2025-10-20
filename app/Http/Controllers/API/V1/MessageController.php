<?php

namespace App\Http\Controllers\API\V1;

use App\Http\Controllers\API\ApiController;
use App\Http\Requests\CheckForgotPasswordTokenRequest;
use App\Http\Requests\CreateUserRequest;
use App\Http\Requests\ForgotPasswordRequest;
use App\Http\Requests\GetUserRequest;
use App\Http\Requests\UpdatePasswordRequest;
use App\Http\Requests\ResetPasswordRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Models\Token;
use App\Models\User;
use App\Repositories\User\UserRepositoryInterface;
use App\Services\LanguageService;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Constants\HttpStatus;
use App\Exceptions\MailException;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class MessageController extends ApiController
{
  protected $userRepository;
  protected $languageService;

  public function __construct(
    UserRepositoryInterface $userRepository,
    LanguageService $languageService
  ) {
    $this->userRepository = $userRepository;
    $this->languageService = $languageService;
  }

  /**
   * Display a listing of the users.
   *
   * @param  \App\Http\Requests\GetUserRequest  $request
   * @return \Illuminate\Http\JsonResponse
   */
  public function index(GetUserRequest $request)
  {
    $users = $this->userRepository->getList($request);
    return $this->successResponse([
      'data' => $users
    ]);
  }

  /**
   * Display the specified user.
   * router: /api/user/{user}
   * @param User $user
   * @return \Illuminate\Http\JsonResponse
   */
  public function show(User $user)
  {
    $user = $this->userRepository->findById($user);
    return $this->successResponse([
      'data' => $user
    ]);
  }

  /**
   * Store User.
   * router: /api/user/store
   * @param Request $request
   * @return \Illuminate\Http\JsonResponse
   */
  public function store(CreateUserRequest $request)
  {
    DB::beginTransaction();
    try {
      $validated = $request->validated();

      $exists = User::withTrashed()
        ->where('email', $validated['email'])
        ->exists();

      if ($exists) {
        return response()->json([
          'message' => $this->languageService->trans('user.email_already_exists')
        ], HttpStatus::CONFLICT);
      }

      $user = $this->userRepository->create($validated);

      DB::commit();

      return $this->successResponse([
        'message' => $this->languageService->trans('user.createEmployeeSuccess'),
        'data' => $user,
        'status' => HttpStatus::CREATED
      ]);
    } catch (MailException $e) {
      DB::rollBack();
      return $this->errorResponse([
        'message' => $this->languageService->trans('common.sendEmailError'),
        'status' => HttpStatus::BAD_REQUEST
      ]);
    } catch (Exception $e) {
      DB::rollBack();
      return $this->errorResponse([
        'message' => $this->languageService->trans('user.error_create_user'),
        'status' => HttpStatus::INTERNAL_SERVER_ERROR
      ]);
    }
  }

  /**
   * Update User.
   * router: /api/user/{user}/update
   * @param UpdateUserRequest $request, User $user
   * @return \Illuminate\Http\JsonResponse
   */
  public function update(User $user, UpdateUserRequest $request)
  {
    $validated = $request->validated();

    if ($request->email) {
      $exists = User::withTrashed()
        ->where('email', $validated['email'])
        ->exists();

      if ($exists) {
        return response()->json([
          'message' => $this->languageService->trans('user.email_already_exists')
        ], 409);
      }
    }

    $updatedUser = $this->userRepository->update($user, $validated);
    if ($updatedUser) {
      return $this->successResponse([
        'message' => $this->languageService->trans('user.update_user_success'),
        'data' => $user
      ]);
    }

    return response()->json([
      'message' => $this->languageService->trans('user.update_failed')
    ], 500);
  }

  /**
   * Delete User (soft delete).
   * router: /api/user/{user}/delete
   * @param User $user
   * @return \Illuminate\Http\JsonResponse
   */
  public function destroy(User $user)
  {
    $result = $this->userRepository->delete($user);
    if ($result) {
      return $this->successResponse([
        'message' => $this->languageService->trans('user.delete_user_success')
      ]);
    }
    return $this->serverErrorResponse($this->languageService->trans('user.error_delete_user'));
  }

  /**
   * Restore deleted User.
   * router: /api/user/{userWithTrashed}/restore
   * @param User $userWithTrashed
   * @return \Illuminate\Http\JsonResponse
   */
  public function restore(User $user)
  {
    $result = $this->userRepository->restore($user);
    if ($result) {
      return $this->successResponse([
        'message' => $this->languageService->trans('user.restore_user_success')
      ]);
    }
    return $this->serverErrorResponse($this->languageService->trans('user.error_restore_user'));
  }

  /**
   * Get a list of active staff users.
   * @param Request $request
   * @return \Illuminate\Http\JsonResponse
   */
  public function getActive(Request $request)
  {
    $users = $this->userRepository->getActive($request->all());
    return $this->successResponse([
      'data' => $users
    ]);
  }

  /**
   * Update user password.
   * Route: /api/user/update-password or /api/admin/update-password
   * @param UpdatePasswordRequest $request
   * @return \Illuminate\Http\JsonResponse
   */
  public function updatePassword(UpdatePasswordRequest $request)
  {
    $validated = $request->validated();
    $user = Auth::user();

    $result = $this->userRepository->updatePassword($user, $validated['new_password']);

    if ($result) {
      return $this->successResponse([
        'message' => $this->languageService->trans('user.password_update_success')
      ]);
    }

    return response()->json([
      'message' => $this->languageService->trans('user.password_update_failed')
    ], 500);
  }

  /**
   * Send reset password email
   * @param ForgotPasswordRequest $request
   * @return \Illuminate\Http\JsonResponse
   */
  public function forgotPassword(ForgotPasswordRequest $request)
  {
    try {
      $result = $this->userRepository->sendResetPasswordLink($request);
      return $this->successResponse([
        'data' => $result
      ]);
    } catch (Exception $e) {
      Log::error('Password reset email: ' . $e->getMessage());
      return $this->errorResponse([
        'message' => $e->getMessage(),
        'status' => $e->getCode() ?: HttpStatus::INTERNAL_SERVER_ERROR
      ]);
    }
  }

  /**
   * Check the token for password reset
   * @param CheckForgotPasswordTokenRequest $request
   * @return \Illuminate\Http\JsonResponse
   */
  public function checkForgotPasswordToken(CheckForgotPasswordTokenRequest $request)
  {
    try {
      $key = $request->token;
      $type = Token::TYPE_RESET_PASSWORD;
      $result = $this->userRepository->validateToken($key, $type);
      if (empty($result)) {
        return $this->errorResponse([
          'message' => $this->languageService->trans('user.token_invalid'),
          'status' => HttpStatus::BAD_REQUEST
        ]);
      }
      return $this->successResponse([
        'message' => $this->languageService->trans('user.valid_token')
      ]);
    } catch (Exception $e) {
      Log::error('Check forgot password token: ' . $e->getMessage());
      return $this->serverErrorResponse($e->getMessage());
    }
  }

  /**
   * Reset password
   * @param ResetPasswordRequest $request
   * @return \Illuminate\Http\JsonResponse
   */
  public function resetPassword(ResetPasswordRequest $request)
  {
    try {
      $this->userRepository->resetPassword($request);
      return $this->successResponse([
        'message' => $this->languageService->trans('user.reset_password_success'),
        'data' => true
      ]);
    } catch (Exception $e) {
      Log::error('Reset password error: ' . $e->getMessage());
      return $this->errorResponse([
        'message' => $e->getMessage(),
        'status' => HttpStatus::BAD_REQUEST
      ]);
    }
  }
}
