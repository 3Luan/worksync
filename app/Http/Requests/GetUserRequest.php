<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class GetUserRequest extends FormRequest
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
            'status' => 'nullable|string|max:255',
            'is_delete' => 'nullable|in:true,false',
            'name' => 'nullable|string|max:255',
            'get_all' => 'nullable|in:true,false',
            'is_checking_today' => 'nullable|in:true,false',
        ];
    }
}
