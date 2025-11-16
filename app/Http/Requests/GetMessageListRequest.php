<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class GetMessageListRequest extends FormRequest
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
      'conversation_id' => 'nullable|integer|exists:conversations,id',
      'sender_id' => 'nullable|integer|exists:users,id',
      'search' => 'nullable|string|max:255',
      'sortBy' => 'nullable|string|in:created_at,id',
      'sortDirection' => 'nullable|string|in:asc,desc',
      'get_all' => 'nullable|boolean',
      'page' => 'nullable|integer|min:1',
      'per_page' => 'nullable|integer|min:5|max:100',
    ];
  }

  public function messages(): array
  {
    return [
      'conversation_id.exists' => 'Conversation not found.',
      'sender_id.exists' => 'Sender not found.',
      'sortDirection.in' => 'Sort direction must be asc or desc.',
    ];
  }
}
