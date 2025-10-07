<?php

use App\Http\Controllers\API\V1\LoginController;
use App\Http\Controllers\API\V1\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

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

    Route::prefix('user')->group(function () {
        Route::get('/current-time-card', [UserController::class, 'getCurrentTimeCard'])->middleware('can:viewAny,App\Models\User');
        Route::put('/update-password', [UserController::class, 'updatePassword']);
        Route::get('/checkin/date', [UserController::class, 'getCheckinsByDate'])->middleware('can:staffView,App\Models\User');
        Route::post('/location-access-denied', [UserController::class, 'locationAccessDenied'])->middleware('can:viewAny,App\Models\User');
    });
    Route::get('/active-staffs', [UserController::class, 'getActiveStaffUsers'])->middleware('can:viewStaff,App\Models\User');



    // Admin API
    Route::prefix('admin')->group(function () {
        Route::prefix('user')->group(function () {
            Route::get('/', [UserController::class, 'index'])->middleware('can:manageView,App\Models\User');
            Route::get('/{user}/detail', [UserController::class, 'detail'])->middleware('can:view,App\Models\User');
            Route::post('/create', [UserController::class, 'store'])->middleware('can:create,App\Models\User');
            Route::put('/{user}/update', [UserController::class, 'update'])->middleware('can:update,App\Models\User');
            Route::delete('/{user}/delete', [UserController::class, 'delete'])->middleware('can:delete,App\Models\User');
            Route::delete('{userWithTrashed}/force-delete', [UserController::class, 'forceDelete'])->middleware('can:delete,App\Models\User');
            Route::post('{userWithTrashed}/restore', [UserController::class, 'restore'])->middleware('can:restore,App\Models\User');
            Route::get('/active-staffs', [UserController::class, 'getActiveStaffUsers'])->middleware('can:adminView,App\Models\User');
            Route::get('/checkin/date', [UserController::class, 'getCheckinsByDate'])->middleware('can:adminView,App\Models\User');
        });

        Route::put('/update-password', [UserController::class, 'updatePassword']);
    });
});
