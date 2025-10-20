<?php

namespace App\Http\Middleware;

use App\Services\LanguageService;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Config;
use Symfony\Component\HttpFoundation\Response;

class SetLocale
{
  /**
   * @var LanguageService
   */
  protected LanguageService $languageService;

  /**
   * Constructor
   *
   * @param LanguageService $languageService
   */
  public function __construct(LanguageService $languageService)
  {
    $this->languageService = $languageService;
  }

  /**
   * Handle an incoming request.
   *
   * @param Request $request
   * @param Closure $next
   * @return Response
   */
  public function handle(Request $request, Closure $next): Response
  {
    // Default locale from config
    $locale = Config::get('app.locale');

    if ($request->hasHeader('X-Language')) {
      $locale = $request->header('X-Language');
    }

    $this->languageService->setLocale($locale);

    return $next($request);
  }
}
