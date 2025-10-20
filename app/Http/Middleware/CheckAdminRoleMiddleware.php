<?php

namespace App\Http\Middleware;

use App\Models\User;
use Closure;
use Illuminate\Support\Facades\Auth;


class CheckAdminRoleMiddleware
{
  /**
   * Handle the incoming request.
   *
   * This method checks if the user is authenticated and has the role of an admin.
   * If the user is authenticated as an admin, it allows the request to proceed to the next middleware or route handler.
   * If the user is not authenticated as an admin, it redirects them to the login page with an error message.
   *
   * @param  \Illuminate\Http\Request  $request The incoming request.
   * @param  \Closure  $next The next middleware or route handler.
   * @return mixed
   */
  public function handle($request, Closure $next)
  {
    if (Auth::check()) {
      $user = Auth::user();
      if ($user->role === User::ROLE_ADMIN) {
        return $next($request);
      }
      return redirect()->route('login')->with('error', 'You are not allowed to');
    }
    return redirect()->route('login')->with('error', 'You need to login');
  }
}
