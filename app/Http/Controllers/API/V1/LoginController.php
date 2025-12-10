<?php

namespace App\Http\Controllers\API\V1;

use App\Http\Controllers\API\ApiController;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Laravel\Passport\Client as OClient;
use App\Http\Traits\ThrottlesAttempts;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Log;
use App\Services\LanguageService;

class LoginController extends ApiController
{
  use ThrottlesAttempts;

  protected $languageService;

  public function __construct(LanguageService $languageService)
  {
    $this->languageService = $languageService;
  }

  /**
   * login.
   *
   * @param  \Illuminate\Http\Request  $request
   * @return \Illuminate\Http\JsonResponse
   */
  public function login(Request $request)
  {
    try {
      $credentials = $request->only('email', 'password');

      $validation = Validator::make($request->all(), [
        'email' => 'required|email|max:255',
        'password' => 'required|string|min:6',
      ]);

      if ($validation->fails()) {
        return response()->json([
          'message' => $this->languageService->trans('common.validation_error'),
          'errors' => $validation->errors()
        ], 403);
      }

      if ($this->hasTooManyAttempts($request)) {
        return $this->forbiddenResponse($this->languageService->trans('auth.too_many_attempts'));
      }

      $account = User::where('email', '=', $request->email)->first();
      if ($account && $account->status === User::STATUS_INACTIVE) {
        return $this->forbiddenResponse($this->languageService->trans('auth.account_inactive'));
      }

      if (!Auth::attempt($credentials)) {
        $this->incrementAttempts($request);
        if ($account) {
          $password = Hash::check($request->password, $account->password);
          if (!$password) {
            return $this->forbiddenResponse($this->languageService->trans('auth.password_incorrect'));
          }
          return $this->forbiddenResponse($this->languageService->trans('auth.failed'));
        } else {
          return $this->forbiddenResponse($this->languageService->trans('auth.failed'));
        }
      } else {
        $this->clearAttempts($request);
        $oClient = OClient::where('password_client', 1)->first();
        $request->request->add([
          'grant_type' => 'password',
          'client_id' => $oClient->id,
          'client_secret' => $oClient->secret,
          'username' => $request->email,
          'password' => $request->password,
          'scope' => '*',
        ]);
        $newRequest = Request::create('/oauth/token', Request::METHOD_POST);
        $response = Route::dispatch($newRequest)->getContent();
        $result = json_decode((string) $response, true);

        $result['user'] = Auth::user();

        return $this->successResponse([
          'data' => $result
        ]);
      }
    } catch (\Exception $e) {
      Log::error('Error during login: ' . $e->getMessage());
      return $this->serverErrorResponse($this->languageService->trans('auth.failed_login_request'));
    }
  }

  /**
   * Summary of refreshToken
   * @param \Illuminate\Http\Request $request
   * @return \Illuminate\Http\JsonResponse
   */
  public function refreshToken(Request $request)
  {
    try {
      $oClient = OClient::where('password_client', 1)->first();
      $request->request->add([
        'grant_type' => 'refresh_token',
        'client_id' => $oClient->id,
        'client_secret' => $oClient->secret,
        'refresh_token' => $request->refresh_token,
        'scope' => '*'
      ]);
      $newRequest = Request::create('/oauth/token', Request::METHOD_POST);
      $response = Route::dispatch($newRequest)->getContent();
      $result = json_decode((string) $response, true);

      if (isset($result['error'])) {
        Log::error(message: 'Error refreshing token: ' . $result['error_description']);
        return $this->errorResponse([
          'message' => $this->languageService->trans('auth.failed_refresh_token'),
          'errors' => $result['error_description'],
        ]);
      }
      return $this->successResponse([
        'data' => $result
      ]);
    } catch (\Exception $e) {
      Log::error('Error refreshing token: ' . $e->getMessage());
      return $this->serverErrorResponse($this->languageService->trans('auth.failed_refresh_token'));
    }
  }

  public function register(Request $request)
  {
    try {
      $validation = Validator::make($request->all(), [
        'name' => 'required|string|max:255',
        'username' => 'required|string|max:255|unique:users,username',
        'email' => 'required|email|max:255|unique:users,email',
        'password' => 'required|string|min:6',
      ]);

      if ($validation->fails()) {
        return response()->json([
          'message' => $this->languageService->trans('common.validation_error'),
          'errors' => $validation->errors()
        ], 403);
      }
      $user = User::create([
        'name' => $request->name,
        'username' => $request->username,
        'email' => $request->email,
        'password' => Hash::make($request->password),
      ]);

      return $this->successResponse([
        'data' => $user
      ]);
    } catch (\Exception $e) {
      Log::error('Error during registration: ' . $e->getMessage());
      return $this->serverErrorResponse($this->languageService->trans('auth.failed_register_request'));
    }
  }
}
