<?php

namespace App\Providers;

use App\Http\Middleware\SetLocale;
use App\Services\LanguageService;
use Illuminate\Support\Facades\App;
use Illuminate\Support\ServiceProvider;

class LanguageServiceProvider extends ServiceProvider
{
  /**
   * Register services.
   *
   * @return void
   */
  public function register(): void
  {
    $this->app->singleton(LanguageService::class, function ($app) {
      return new LanguageService();
    });
  }

  /**
   * Bootstrap services.
   *
   * @return void
   */
  public function boot(): void
  {
    // Set the default locale from config
    $locale = config('app.locale');
    App::setLocale($locale);

    // Register middleware
    $router = $this->app['router'];
    $router->aliasMiddleware('locale', SetLocale::class);

    // Add locale middleware to web and api middleware groups
    $router->pushMiddlewareToGroup('web', SetLocale::class);
    $router->pushMiddlewareToGroup('api', SetLocale::class);
  }
}
