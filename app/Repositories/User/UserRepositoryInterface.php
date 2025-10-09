<?php

namespace App\Repositories\User;

use App\Models\User;
use Illuminate\Http\Request;

interface UserRepositoryInterface
{
    /**
     * Retrieve a list of Users based on the specified filters.
     * @param Request $request
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getUsers(Request $request);

    /**
     * Update the specified User with validated data.
     * @param User $user
     * @param array $validatedData
     */
    public function updateUser(User $user, array $validatedData);

    /**
     * Soft delete the specified User.
     * @param User $user
     */
    public function deleteUser(User $user);

    /**
     * Force delete the specified User.
     * @param User $user
     */
    public function forceDeleteUser(User $user);

    /**
     * Restore a soft-deleted User.
     * @param User $user
     */
    public function restoreUser(User $user);

    /**
     * Create new User with validated data.
     * @param array $validatedData
     */
    public function createUser(array $validatedData);

    /**
     * Get a single user by ID.
     * @param User $user
     * @return User
     */
    public function getUser(User $user);

    /**
     * Get a list of active staff users.
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getActiveStaffUsers(Array $filters = []);

    /**
     * Update user password.
     * @param User $user
     * @param string $newPassword
     * @return bool
     */
    public function updatePassword(User $user, string $newPassword);

    /**
     * Send reset password email
     * @param Request $request
     * @return array
     */
    public function sendResetPasswordEmail(Request $request);

    /**
     * Check valid token.
     * @param string $key
     * @return Token|null
     */
    public function checkValidToken(string $key, string $type);

    /**
     * Reset password.
     * @param Request $request
     * @return bool
     */
    public function resetPassword(Request $request);

    /**
     * Summary of locationAccessDenied
     * @return void
     */
    public function locationAccessDenied();
}
