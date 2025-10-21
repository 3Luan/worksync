<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateConversationRequest extends FormRequest
{
  public function authorize(): bool
  {
    return true;
  }

  public function rules(): array
  {
    return [
      'name' => 'nullable|string|max:255',
      'avatar_url' => 'nullable|url|max:255',
      'description' => 'nullable|string|max:500',
      'is_archived' => 'nullable|boolean',
    ];
  }

  public function messages(): array
  {
    return [
      'avatar_url.url' => 'Avatar must be a valid URL.',
      'description.max' => 'Description cannot exceed 500 characters.',
    ];
  }
}
