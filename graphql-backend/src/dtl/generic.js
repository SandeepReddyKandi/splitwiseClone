function getResponseDto(data, reason, error) {
  const response = {
    success: true,
    reason: undefined,
    error: undefined,
    data: undefined
  };

  if (reason) {
    response.success = false;
    response.reason = reason;
  }

  if (error) {
    response.success = false;
    response.error = {
      code: error.code,
      data: error.data,
    };
  }

  if (data) response.data = data;

  return response;
}

export default {getResponseDto}
