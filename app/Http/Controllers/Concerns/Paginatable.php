<?php

namespace App\Http\Controllers\Concerns;

use Illuminate\Support\Facades\Config;

trait Paginatable
{
    public function getPerPage(int $perPageMax = 100, int $perPageMin = 10)
    {
        $perPage = request('per_page', Config::get('models.per_page'));
        return min(max($perPage, $perPageMin), $perPageMax);
    }
}
