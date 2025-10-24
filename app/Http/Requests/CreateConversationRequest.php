<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateConversationRequest extends FormRequest
{
  public function authorize(): bool
  {
    return true;
  }

  public function rules(): array
  {
    return [
      'type' => 'required|int|in:0,1,2', // 0: direct, 1: group, 2: channel
      'name' => 'nullable|string|max:255',
      'avatar' => 'nullable|url|max:255',
      'description' => 'nullable|string|max:500',
      'members' => 'required|array|min:1',
      'members.*' => 'integer|exists:users,id',
    ];
  }

  public function messages(): array
  {
    return [
      'type.required' => 'Conversation type is required.',
      'type.in' => 'Type must be either direct or group.',
      'members.required' => 'At least one member is required.',
      'members.*.exists' => 'Some members do not exist in the system.',
    ];
  }
}
