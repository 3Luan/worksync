<?php

namespace App\Repositories\User;

use App\Models\Token;
use App\Models\User;
use Illuminate\Http\Request;

interface UserRepositoryInterface
{
  /**
   * Retrieve a list of Users based on the specified filters.
   * @param Request $request
   * @return mixed
   */
  public function getList(Request $request);

  /**
   * Find a User by their ID.
   * @param User $user
   * @return User|null
   */
  public function findById(User $user);

  /**
   * Create a new User with validated data.
   * @param array $validatedData
   * @return User
   */
  public function create(array $validatedData);

  /**
   * Update the specified User with validated data.
   * @param User $user
   * @param array $validatedData
   * @return User
   */
  public function update(User $user, array $validatedData);

  /**
   * Soft delete the specified User.
   * @param User $user
   */
  public function delete(User $user);

  /**
   * Restore a soft-deleted User.
   * @param User $user
   * @return bool
   */
  public function restore(User $user);

  /**
   * Get a list of active staff users.
   * @return mixed
   */
  public function getActive(array $filters = []);

  /**
   * Update user's password.
   * @param User $user
   * @param string $newPassword
   * @return bool
   */
  public function updatePassword(User $user, string $newPassword);

  /**
   * Send reset password link to user's email.
   * @param Request $request
   * @return bool
   */
  public function sendResetPasswordLink(Request $request);

  /**
   * Validate reset password token.
   * @param string $key
   * @param string $type
   * @return Token|null
   */
  public function validateToken(string $key, string $type);

  /**
   * Reset user's password using a valid token.
   * @param Request $request
   * @return bool
   */
  public function resetPassword(Request $request);
}
