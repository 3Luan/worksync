<?php

namespace App\Http\Requests;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateUserRequest extends FormRequest
{
  /**
   * Determine if the user is authorized to make this request.
   */
  public function authorize(): bool
  {
    return true;
  }
  /**
   * Get the validation rules that apply to the request.
   *
   * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
   */
  public function rules(): array
  {
    return [
      'name' => 'nullable|string|max:255',
      'email' => 'nullable|email|max:255',
      'password' => 'nullable|string|min:8',
      'role' => 'nullable|integer|in:' . implode(',', User::ROLES),
      'status' => 'nullable|integer|in:' . implode(',', User::STATUSES)
    ];
  }
}
