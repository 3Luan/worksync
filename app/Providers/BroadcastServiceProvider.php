<?php

namespace App\Providers;

use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\ServiceProvider;

class BroadcastServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        // Đăng ký route /broadcasting/auth (dùng cho private / presence channel)
        Broadcast::routes(['middleware' => ['auth:api']]);

        // Nạp file routes/channels.php
        require base_path('routes/channels.php');
    }
}
