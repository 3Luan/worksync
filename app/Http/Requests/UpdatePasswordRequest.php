<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class UpdatePasswordRequest extends FormRequest
{
  /**
   * Determine if the user is authorized to make this request.
   *
   * @return bool
   */
  public function authorize()
  {
    return true;
  }

  /**
   * Get the validation rules that apply to the request.
   *
   * @return array
   */
  public function rules()
  {
    return [
      'current_password' => ['required', 'string'],
      'new_password' => ['required', 'string', 'min:8', 'different:current_password'],
      'confirm_password' => ['required', 'string', 'same:new_password'],
    ];
  }

  /**
   * Configure the validator instance.
   *
   * @param  \Illuminate\Validation\Validator  $validator
   * @return void
   */
  public function withValidator($validator)
  {
    $validator->after(function ($validator) {
      if (!Hash::check($this->current_password, Auth::user()->password)) {
        $validator->errors()->add('current_password', 'Mật khẩu hiện tại không đúng.');
      }
    });
  }

  /**
   * Get custom messages for validator errors.
   *
   * @return array
   */
  public function messages()
  {
    return [
      'current_password.required' => 'Vui lòng nhập mật khẩu hiện tại.',
      'new_password.required' => 'Vui lòng nhập mật khẩu mới.',
      'new_password.min' => 'Mật khẩu mới phải có ít nhất 8 ký tự.',
      'new_password.different' => 'Mật khẩu mới phải khác mật khẩu hiện tại.',
      'confirm_password.required' => 'Vui lòng xác nhận mật khẩu mới.',
      'confirm_password.same' => 'Mật khẩu xác nhận không khớp với mật khẩu mới.',
    ];
  }
}
