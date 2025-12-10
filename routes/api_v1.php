<?php

use App\Http\Controllers\API\V1\ConversationController;
use App\Http\Controllers\API\V1\LoginController;
use App\Http\Controllers\API\V1\MessageController;
use App\Http\Controllers\API\V1\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Laravel\Reverb\Loggers\Log;

/*
|--------------------------------------------------------------------------|
| API Routes                                                              |
|--------------------------------------------------------------------------|
| Here is where you can register API routes for your applicant. These     |
| routes are loaded by the RouteServiceProvider within a group which      |
| is assigned the "api" middleware group. Enjoy building your API!        |
|--------------------------------------------------------------------------|
*/

Route::post('/login', [LoginController::class, 'login']);
Route::post('/register', [LoginController::class, 'register']);
Route::post('/refresh_token', [LoginController::class, 'refreshToken']);
Route::post('/forgot-password', [UserController::class, 'forgotPassword']);
Route::get('/check-forgot-password-token', [UserController::class, 'checkForgotPasswordToken']);
Route::post('/reset-password', [UserController::class, 'resetPassword']);

Route::group(['middleware' => 'auth:api'], function () {

  // Logout API
  Route::post('/logout', function (Request $request) {
    $request->user()->token()->revoke();
    return response()->json([
      'message' => app(App\Services\LanguageService::class)->trans('auth.logout_successful')
    ], 200);
  });

  // User API
  Route::prefix('user')->group(function () {
    Route::get('/', [UserController::class, 'index'])->middleware('can:view,App\Models\User');
    Route::post('/create', [UserController::class, 'store'])->middleware('can:create,App\Models\User');
    Route::get('/{user}/detail', [UserController::class, 'show'])->middleware('can:view,App\Models\User');
    Route::put('/{user}/update', [UserController::class, 'update'])->middleware('can:update,App\Models\User');
    Route::delete('/{user}/delete', [UserController::class, 'destroy'])->middleware('can:delete,App\Models\User');
    Route::put('/update-password', [UserController::class, 'updatePassword']);
    Route::get('/actives', [UserController::class, 'getActive'])->middleware('can:viewStaff,App\Models\User');
  });

  // Message API
  Route::prefix('messages')->group(function () {
    Route::get('/', [MessageController::class, 'index']);
    Route::post('/', [MessageController::class, 'store']);
    Route::get('/{message}', [MessageController::class, 'show']);
    Route::put('/{message}', [MessageController::class, 'update']);
    Route::delete('/{message}', [MessageController::class, 'destroy']);
    Route::post('/{message}/restore', [MessageController::class, 'restore']);
    Route::post('/{message}/react', [MessageController::class, 'react']);
    Route::post('/{message}/delivered', [MessageController::class, 'markAsDelivered']);
    Route::post('/{message}/seen', [MessageController::class, 'markAsSeen']);
  });

  // Conversation API
  Route::prefix('conversations')->group(function () {
    Route::get('/', [ConversationController::class, 'index']);
    Route::post('/', [ConversationController::class, 'store']);
    Route::get('/{conversation}', [ConversationController::class, 'show']);
    Route::put('/{conversation}', [ConversationController::class, 'update']);
    Route::delete('/{conversation}', [ConversationController::class, 'destroy']);
    Route::post('/{conversation}/restore', [ConversationController::class, 'restore']);
    Route::post('/{conversation}/add-member', [ConversationController::class, 'addMember']);
    Route::delete('/{conversation}/remove-member', [ConversationController::class, 'removeMember']);
    Route::get('/{conversation}/members', [ConversationController::class, 'getMembers']);
    Route::get('/my', [ConversationController::class, 'getMyConversations']);
    Route::post('/{conversation}/pin', [ConversationController::class, 'pin']);
    Route::post('/{conversation}/mute', [ConversationController::class, 'mute']);
    Route::post('/{conversation}/unmute', [ConversationController::class, 'unmute']);
    Route::get('/{conversation}/settings', [ConversationController::class, 'getSettings']);
    Route::put('/{conversation}/settings', [ConversationController::class, 'updateSettings']);
    Route::post('/{conversation}/delivered', [ConversationController::class, 'markMessagesAsDelivered']);
    Route::post('/all-delivered', [ConversationController::class, 'markAllMessagesAsDelivered']);
    Route::post('/{conversation}/seen', [ConversationController::class, 'markMessagesAsSeen']);
  });

  // Admin API
  Route::prefix('admin')->group(function () {
    Route::prefix('user')->group(function () {
      Route::get('/', [UserController::class, 'index'])->middleware('can:manageView,App\Models\User');
      Route::get('/{user}/detail', [UserController::class, 'show'])->middleware('can:view,App\Models\User');
      Route::post('/create', [UserController::class, 'store'])->middleware('can:create,App\Models\User');
      Route::put('/{user}/update', [UserController::class, 'update'])->middleware('can:update,App\Models\User');
      Route::delete('/{user}/delete', [UserController::class, 'destroy'])->middleware('can:delete,App\Models\User');
      Route::post('{userWithTrashed}/restore', [UserController::class, 'restore'])->middleware('can:restore,App\Models\User');
      Route::get('/actives', [UserController::class, 'getActive'])->middleware('can:adminView,App\Models\User');
    });
  });
});
