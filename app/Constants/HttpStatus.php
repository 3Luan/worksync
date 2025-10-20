<?php

namespace App\Constants;

class HttpStatus
{
  // 2xx Success codes
  const SUCCESS = 200;
  const CREATED = 201;
  const NO_CONTENT = 204;

  // 4xx Client Error codes
  const BAD_REQUEST = 400;
  const UNAUTHORIZED = 401;
  const FORBIDDEN = 403;
  const NOT_FOUND = 404;
  const CONFLICT = 409;
  const UNPROCESSABLE_ENTITY = 422;

  // 5xx Server Error codes
  const INTERNAL_SERVER_ERROR = 500;
  const BAD_GATEWAY = 502;
  const SERVICE_UNAVAILABLE = 503;
}
