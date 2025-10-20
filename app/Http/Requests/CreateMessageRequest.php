<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateMessageRequest extends FormRequest
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
      'conversation_id' => 'required|integer|exists:conversations,id',
      'content' => 'nullable|string|max:2000',
      'type' => 'required|string|in:text,image,video,file,audio,system',
      'parent_message_id' => 'nullable|integer|exists:messages,id',
      'forward_from_id' => 'nullable|integer|exists:messages,id',
      'attachments' => 'nullable|array',
      'attachments.*.file_name' => 'required_with:attachments|string|max:255',
      'attachments.*.file_url' => 'required_with:attachments|url',
      'attachments.*.file_type' => 'nullable|string|max:100',
      'attachments.*.file_size' => 'nullable|integer|min:0',
      'metadata' => 'nullable|array', // For mentions, preview links, etc.
    ];
  }

  public function messages(): array
  {
    return [
      'conversation_id.required' => 'Conversation ID is required.',
      'conversation_id.exists' => 'Conversation not found.',
      'type.in' => 'Invalid message type.',
      'content.max' => 'Message content cannot exceed 2000 characters.',
    ];
  }
}
