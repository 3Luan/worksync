<?php

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

/**
 * Send email.
 */
if (!function_exists('sendEmail')) {
  if (!function_exists('sendEmail')) {
    function sendEmail(string $action): void
    {
      try {
        $user = Auth::user();
      } catch (\Throwable $e) {
        Log::error('sendEmail error: ' . $e->getMessage(), [
          'action' => $action,
          'user_id' => $user->id ?? null,
        ]);
        throw $e;
      }
    }

    function createNotificationByAction(string $action, $user)
    {
      return;
    }
  }
}

/**
 * Check if the current route matches the given route name(s)
 *
 * @param string|array $routes Route name or array of route names
 * @param string $output The output string when route is active
 * @return string
 */
function isActive($routes, $output = 'active')
{
  if (is_array($routes)) {
    foreach ($routes as $route) {
      if (request()->routeIs($route)) {
        return $output;
      }
    }
    return '';
  }

  return request()->routeIs($routes) ? $output : '';
}

/**
 * Convert URLs in text to clickable links.
 *
 * @param string $text Input text
 * @return string
 */
function makeLinksClickable($text)
{
  return preg_replace(
    '~(https?://[^\s<]+)~',
    '<a href="$1" target="_blank">$1</a>',
    $text
  );
}

/**
 * Remove Vietnamese Tones
 * @param mixed $str
 * @return array|string|null
 */
if (!function_exists('removeVietnameseTones')) {
  function removeVietnameseTones($str)
  {
    $str = preg_replace([
      "/(à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ)/u",
      "/(è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ)/u",
      "/(ì|í|ị|ỉ|ĩ)/u",
      "/(ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ)/u",
      "/(ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ)/u",
      "/(ỳ|ý|ỵ|ỷ|ỹ)/u",
      "/(đ)/u",
      "/(À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ)/u",
      "/(È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ)/u",
      "/(Ì|Í|Ị|Ỉ|Ĩ)/u",
      "/(Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ)/u",
      "/(Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ)/u",
      "/(Ỳ|Ý|Ỵ|Ỷ|Ỹ)/u",
      "/(Đ)/u"
    ], [
      "a",
      "e",
      "i",
      "o",
      "u",
      "y",
      "d",
      "A",
      "E",
      "I",
      "O",
      "U",
      "Y",
      "D"
    ], $str);

    return $str;
  }
}
