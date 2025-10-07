<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;


class AuthenticateMiddleware
{
    /**
     * Handle the incoming request.
     *
     * This method checks if the user is authenticated.
     * If the user is not authenticated, it redirects them to the login page with an error message.
     * If the user is authenticated, it allows the request to proceed to the next middleware or route handler.
     *
     * @param  \Illuminate\Http\Request  $request The incoming request.
     * @param  \Closure  $next The next middleware or route handler.
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        if (Auth::id() == null) {
            return redirect()->route('login');
        }
        return $next($request);
    }
}
