<?php

namespace App\Repositories\User;

use App\Models\User;
use Illuminate\Http\Request;

interface MessageRepositoryInterface
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
}
