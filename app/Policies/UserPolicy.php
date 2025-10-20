<?php

namespace App\Policies;

use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;
use Illuminate\Support\Facades\Auth;

class UserPolicy
{
  use HandlesAuthorization;

  /**
   * Determine whether the user can view any models.
   *
   * @return \Illuminate\Auth\Access\Response|bool
   */
  public function view()
  {
    return in_array(Auth::user()->role, User::ROLES);
  }

  /**
   * Determine whether the user can create models.
   *
   * @return \Illuminate\Auth\Access\Response|bool
   */
  public function create()
  {
    return in_array(Auth::user()->role, User::ROLES);
  }

  /**
   * Determine whether the user can update the model.
   *
   * @return \Illuminate\Auth\Access\Response|bool
   */
  public function update()
  {
    return in_array(Auth::user()->role, User::ROLES);
  }

  /**
   * Determine whether the user can delete the model.
   *
   * @return \Illuminate\Auth\Access\Response|bool
   */
  public function delete()
  {
    return in_array(Auth::user()->role, User::ROLE_MANAGEMENTS);
  }

  /**
   * Determine whether the user can restore the model.
   *
   * @return \Illuminate\Auth\Access\Response|bool
   */
  public function restore()
  {
    return in_array(Auth::user()->role, User::ROLE_MANAGEMENTS);
  }
}
