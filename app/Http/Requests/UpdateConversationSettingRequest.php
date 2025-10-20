<?php

namespace App\Http\Requests\Conversation;

use Illuminate\Foundation\Http\FormRequest;

class UpdateConversationSettingRequest extends FormRequest
{
  public function authorize(): bool
  {
    return true;
  }

  public function rules(): array
  {
    return [
      'theme_color' => 'nullable|string|max:20',
      'default_emoji' => 'nullable|string|max:10',
      'allow_reactions' => 'nullable|boolean',
      'allow_mentions' => 'nullable|boolean',
      'allow_media' => 'nullable|boolean',
    ];
  }

  public function messages(): array
  {
    return [
      'theme_color.max' => 'Theme color cannot exceed 20 characters.',
      'default_emoji.max' => 'Emoji must be 10 characters or less.',
      'allow_reactions.boolean' => 'Allow reactions must be true or false.',
    ];
  }
}
