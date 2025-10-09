<?php

namespace App\Repositories\User;

use App\Exceptions\MailException;
use App\Mail\ResetPasswordMail;
use App\Mail\SendMailForUser;
use App\Models\BreakTime;
use App\Models\TimeCard;
use App\Models\Token;
use App\Models\User;
use App\Services\LanguageService;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;

class UserRepository implements UserRepositoryInterface
{
    use \App\Http\Controllers\Concerns\Paginatable;

    protected $languageService;

    public function __construct(LanguageService $languageService)
    {
        $this->languageService = $languageService;
    }

    /**
     * Retrieve a list of Users based on the specified filters.
     * @param Request $request
     * @return mixed
     */
    public function getUsers(Request $request)
    {
        try {
            $query = User::with(['time_cards'])
                ->withTrashed();
            $isCheckingToday = filter_var($request->get('is_checking_today'), FILTER_VALIDATE_BOOLEAN);
            $isDelete = filter_var($request->get('is_delete'), FILTER_VALIDATE_BOOLEAN);
            $today = now()->toDateString();

            $sortBy = $request->get('sortBy');
            $sortDirection = $request->get('sortDirection', 'asc');

            $query->when($request->has('name'), function ($query) use ($request) {
                $search = '%' . preg_replace('/\s+/', ' ', trim($request->name)) . '%';
                $searchLower = strtolower($search);

                $query->where(function ($q) use ($searchLower) {
                    $q->whereRaw("LOWER(CONCAT(name)) LIKE ?", [$searchLower]);
                });
            });


            if ($isDelete) {
                $query->onlyTrashed();
            }

            if ($isCheckingToday) {
                $query->whereHas('time_cards', function ($query) use ($today) {
                    $query->whereDate('date', $today);
                });
            }

            if ($sortBy) {
                $query->orderBy($sortBy, $sortDirection)
                    ->orderBy('name');
            }

            $query->orderByDesc('id');

            if (filter_var($request->get('get_all'), FILTER_VALIDATE_BOOLEAN)) {
                return $query->get();
            }

            return $query->paginate($this->getPerPage());
        } catch (\Exception $e) {
            Log::error('Lấy danh sách người dùng thất bại ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Create new User with validated data.
     * @param array $validatedData
     */
    public function createUser(array $userData)
    {

        $plainPassword = $userData['password'];

        if (isset($userData['password'])) {
            $userData['password'] = Hash::make($userData['password']);
        }

        $user = User::create($userData);

        $key = Token::generateKey();
        $expiredDate = Carbon::now()->addDay();
        Token::create([
            'user_id' => $user->id,
            'type' => Token::TYPE_RESET_PASSWORD,
            'key' => $key,
            'expired_at' => $expiredDate,
        ]);

        $resetUrl = config('app.url') . '/auth/reset-password?token=' . $key;
        try {
            Mail::to($userData['email'])->send(new SendMailForUser([
                ...$userData,
                'password' => $plainPassword,
                'reset_url' => $resetUrl,
            ]));
        } catch (Exception $e) {
            throw new MailException();
        }

        return $userData;
    }

    /**
     * Update the specified User with validated data.
     *
     * @param User $user
     * @param array $validatedData
     * @return bool
     */
    public function updateUser(User $user, array $validatedData)
    {
        try {
            if (isset($validatedData['password'])) {
                $validatedData['password'] = Hash::make($validatedData['password']);
            }
            return $user->update($validatedData);
        } catch (\Exception $e) {
            Log::error('Cập nhập người dùng thất bại' . $e->getMessage());
            return false;
        }
    }

    /**
     * Delete the specified User.
     * @param User $user
     * @return bool|null
     */
    public function deleteUser(User $user)
    {
        try {
            if (Auth::id() === $user->id) {
                return response()->json(['message' => 'Bạn không thể xoá chính tài khoản của bạn'], 400);
            }

            return $user->delete();
        } catch (\Exception $e) {
            Log::error('Xoá người dùng thất bại ' . $e->getMessage());
            return response()->json(['message' => 'Xoá người dùng thất bại'], 400);
        }
    }

    /**
     * Force Delete the specified User.
     * @param User $user
     * @return bool|null
     */
    public function forceDeleteUser(User $user)
    {
        try {
            if (Auth::id() === $user->id) {
                return response()->json(['message' => 'Bạn không thể xoá chính tài khoản của bạn'], 400);
            }

            return $user->forceDelete();
        } catch (\Exception $e) {
            Log::error('Xoá người dùng thất bại ' . $e->getMessage());
            return response()->json(['message' => 'Xoá người dùng thất bại'], 400);
        }
    }

    /**
     * Restore a soft-deleted User.
     * @param User $user
     * @return bool|null
     */
    public function restoreUser(User $user)
    {
        try {
            return $user->restore();
        } catch (\Exception $e) {
            Log::error('Khôi phục người dùng thất bại ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Get a single user by ID.
     * @param User $user
     * @return User
     */
    public function getUser(User $user)
    {
        try {
            return $user;
        } catch (\Exception $e) {
            Log::error('Lấy thông tin người dùng thất bại ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Get a list of active staff users.
     * @return mixed
     */

    public function getActiveStaffUsers(array $filters = [])
    {
        try {
            $query = User::where('status', User::STATUS_ACTIVE)
                ->whereIn('role', $filters['roles']);

            return $query->paginate($this->getPerPage());
        } catch (\Exception $e) {
            Log::error('Lấy danh sách người dùng thất bại ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Update user password.
     * @param User $user
     * @param string $newPassword
     * @return bool
     */
    public function updatePassword(User $user, string $newPassword)
    {
        DB::beginTransaction();
        try {
            $user->update([
                'password' => Hash::make($newPassword)
            ]);

            DB::commit();
            return true;
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Cập nhật mật khẩu thất bại: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Send reset password email
     * @param Request $request
     * @return array
     */
    public function sendResetPasswordEmail(Request $request)
    {
        DB::beginTransaction();
        try {
            $user = User::where('email', '=', $request->email)->first();
            if (!$user) {
                throw new \Exception($this->languageService->trans('user.email_not_found'), 404);
            } else {
                $key = Token::generateKey();
                $expiredDate = Carbon::now()->addHour();
                $type = Token::TYPE_RESET_PASSWORD;
                Token::updateOrCreate([
                    'type' => $type,
                    'user_id' => $user->id,
                ], [
                    'key' => $key,
                    'expired_at' => $expiredDate,
                ]);
                $resetPath = config('app.url') . "/auth/reset-password?token=" . $key;
                $data = [
                    'fullname' => $user->name,
                    'reset_path' => $resetPath,
                ];
                Mail::to($request->email)->send(new ResetPasswordMail($data));
                DB::commit();
                return ['message' => "Send reset password email successfully."];
            }
        } catch (Exception $e) {
            DB::rollBack();
            Log::error('Password reset email error: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Check valid token.
     * @param string $key
     * @return Token|null
     */
    public function checkValidToken(string $key, string $type)
    {
        try {
            $token = Token::where('type', '=', $type)
                ->where('key', '=', $key)
                ->first();
            $now = Carbon::now();
            if (!$token || $now->gt($token->expired_at)) {
                return null;
            }
            return $token;
        } catch (Exception $e) {
            Log::error('Check valid token error: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Reset password.
     * @param Request $request
     * @return bool
     */
    public function resetPassword(Request $request)
    {
        DB::beginTransaction();
        try {
            $key = $request->token;
            $type = Token::TYPE_RESET_PASSWORD;
            $token = $this->checkValidToken($key, $type);

            if (empty($token)) {
                DB::rollBack();
                throw new \Exception('Invalid token', 400);
            }

            $newPassword = Hash::make($request->password);
            $token->user->update([
                'password' => $newPassword,
            ]);
            $token->user->save();
            $token->delete();

            DB::commit();
            return true;
        } catch (Exception $e) {
            DB::rollBack();
            Log::error('Reset password handle error: ' . $e);
            throw $e;
        }
    }

    public function locationAccessDenied()
    {
        sendEmail('deny_location');
    }
}
