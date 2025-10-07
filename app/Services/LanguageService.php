<?php

namespace App\Services;

use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Config;

class LanguageService
{
    /**
     * Get the current locale.
     *
     * @return string
     */
    public function getCurrentLocale(): string
    {
        return App::getLocale();
    }

    /**
     * Set the application locale.
     *
     * @param string $locale
     * @return void
     */
    public function setLocale(string $locale): void
    {
        if ($this->isLocaleSupported($locale)) {
            App::setLocale($locale);
        } else {
            App::setLocale(Config::get('app.fallback_locale'));
        }
    }

    /**
     * Check if the locale is supported.
     *
     * @param string $locale
     * @return bool
     */
    public function isLocaleSupported(string $locale): bool
    {
        return in_array($locale, $this->getSupportedLocales());
    }

    /**
     * Get all supported locales.
     *
     * @return array
     */
    public function getSupportedLocales(): array
    {
        return ['vi', 'en', 'ja'];
    }

    /**
     * Get a translated message.
     *
     * @param string $key
     * @param array $replace
     * @param string|null $locale
     * @return string
     */
    public function trans(string $key, array $replace = [], string $locale = null): string
    {
        return trans($key, $replace, $locale);
    }

    /**
     * Get a translated message from a specific file.
     *
     * @param string $file
     * @param string $key
     * @param array $replace
     * @param string|null $locale
     * @return string
     */
    public function transFrom(string $file, string $key, array $replace = [], string $locale = null): string
    {
        return trans($file . '.' . $key, $replace, $locale);
    }
}