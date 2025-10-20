<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateMessageRequest extends FormRequest
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
      'content' => 'nullable|string|max:2000',
      'metadata' => 'nullable|array',
      'is_pinned' => 'nullable|boolean',
      'is_recalled' => 'nullable|boolean',
    ];
  }

  public function messages(): array
  {
    return [
      'content.max' => 'Message content cannot exceed 2000 characters.',
    ];
  }
}
