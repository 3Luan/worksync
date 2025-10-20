<?php

namespace App\Traits;

use Illuminate\Http\JsonResponse;
use App\Constants\HttpStatus;

trait ApiResponse
{
  /**
   * Return a success response.
   *
   * @param array $options Options such as: data, message, status
   * @return JsonResponse
   */
  protected function successResponse(array $options = []): JsonResponse
  {
    return response()->json([
      'success' => true,
      'message' => $options['message'] ?? null,
      'data' => $options['data'] ?? null,
      'errors' => null,
    ], $options['status'] ?? HttpStatus::SUCCESS);
  }

  /**
   * Return a no content response.
   *
   * @param array $options Options such as: message, status
   * @return JsonResponse
   */
  protected function noContentResponse(array $options = []): JsonResponse
  {
    return response()->json([
      'success' => true,
      'message' => $options['message'] ?? null,
      'data' => null,
      'errors' => null,
    ], $options['status'] ?? HttpStatus::NO_CONTENT);
  }

  /**
   * Return an error response.
   *
   * @param array $options Options such as: message, status, errors
   * @return JsonResponse
   */
  protected function errorResponse(array $options = []): JsonResponse
  {
    return response()->json([
      'success' => false,
      'message' => $options['message'] ?? 'An error occurred',
      'data' => null,
      'errors' => $options['errors'] ?? null,
    ], $options['status'] ?? HttpStatus::BAD_REQUEST);
  }

  /**
   * Return a validation error response.
   *
   * @param array $errors
   * @return JsonResponse
   */
  protected function validationErrorResponse(array $errors): JsonResponse
  {
    return $this->errorResponse([
      'message' => 'Validation error',
      'status' => HttpStatus::UNPROCESSABLE_ENTITY,
      'errors' => $errors,
    ]);
  }

  /**
   * Return a not found error response.
   *
   * @param string|null $message
   * @return JsonResponse
   */
  protected function notFoundResponse(string $message = 'Resource not found'): JsonResponse
  {
    return $this->errorResponse([
      'message' => $message,
      'status' => HttpStatus::NOT_FOUND,
    ]);
  }

  /**
   * Return an unauthorized error response.
   *
   * @param string|null $message
   * @return JsonResponse
   */
  protected function unauthorizedResponse(string $message = 'Unauthorized access'): JsonResponse
  {
    return $this->errorResponse([
      'message' => $message,
      'status' => HttpStatus::UNAUTHORIZED,
    ]);
  }

  /**
   * Return a forbidden error response.
   *
   * @param string|null $message
   * @return JsonResponse
   */
  protected function forbiddenResponse(string $message = 'Access denied'): JsonResponse
  {
    return $this->errorResponse([
      'message' => $message,
      'status' => HttpStatus::FORBIDDEN,
    ]);
  }

  /**
   * Return a conflict error response.
   *
   * @param string|null $message
   * @return JsonResponse
   */
  protected function conflictResponse(string $message = 'Resource conflict'): JsonResponse
  {
    return $this->errorResponse([
      'message' => $message,
      'status' => HttpStatus::CONFLICT,
    ]);
  }

  /**
   * Return a server error response.
   *
   * @param string|null $message
   * @return JsonResponse
   */
  protected function serverErrorResponse(string $message = 'Internal server error'): JsonResponse
  {
    return $this->errorResponse([
      'message' => $message,
      'status' => HttpStatus::INTERNAL_SERVER_ERROR,
    ]);
  }
}
