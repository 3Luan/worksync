<?php

namespace App\Providers;

use App\Models\User;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Route;

class RouteServiceProvider extends ServiceProvider
{
    public const HOME = '/';

    protected $namespace = 'App\Http\Controllers';

    public function boot(): void
    {
        Route::bind(key: 'userWithTrashed', binder: function ($id): mixed {
            return User::withTrashed()->findOrFail($id);
        });

        $this->configureRateLimiting();

        $this->routes(function () {
            Route::middleware('web')
                ->group(base_path('routes/web.php'));
        });

        $this->mapApiVersionRoutes();
    }

    protected function configureRateLimiting(): void
    {
        RateLimiter::for('api', function (Request $request) {
            return Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
        });
    }

    protected function mapApiVersionRoutes(): void
    {
        $files = File::allFiles(base_path('routes'));
        foreach ($files as $file) {
            $basename = pathinfo($file)['basename'];
            if (preg_match("/api_v[1-9][0-9]*\.php/", $basename)) {
                $version = $this->getApiVersion($basename);
                Route::prefix("api/v{$version}")
                    ->middleware('api')
                    ->namespace($this->getApiNamespace($version))
                    ->group(base_path("routes/{$basename}"));
            }
        }
    }

    private function getApiVersion(string $basename): string
    {
        return str_replace(['api_v', '.php'], '', $basename);
    }

    private function getApiNamespace(string $version): string
    {
        return "{$this->namespace}\Api\V{$version}";
    }
}
