<?php

namespace App\Providers;

use App\Models\Message;
use App\Repositories\Conversation\ConversationRepository;
use App\Repositories\Conversation\ConversationRepositoryInterface;
use App\Repositories\Message\MessageRepository;
use App\Repositories\Message\MessageRepositoryInterface;
use App\Repositories\User\UserRepository;
use App\Repositories\User\UserRepositoryInterface;
use Illuminate\Support\ServiceProvider;
use Laravel\Passport\Passport;
use URL;

class AppServiceProvider extends ServiceProvider
{
  /**
   * Register any application services.
   */
  public function register(): void
  {
    $this->app->bind(UserRepositoryInterface::class, UserRepository::class);
    $this->app->bind(MessageRepositoryInterface::class, MessageRepository::class);
    $this->app->bind(ConversationRepositoryInterface::class, ConversationRepository::class);
  }

  /**
   * Bootstrap any application services.
   */
  public function boot(): void
  {
    // if (config('app.env') === 'production') {
    //   URL::forceScheme('https');
    // }
    Passport::enablePasswordGrant();
    // TimeCard::observe(TimeCardObserver::class);
  }
}
