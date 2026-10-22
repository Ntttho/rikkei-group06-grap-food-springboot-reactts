interface ApiErrorResponse {
  code?: string;
  message?: string;
}

const ERROR_MESSAGE_MAP: Record<string, string> = {
  // Error codes mapping
  AUTH_INVALID_CREDENTIALS: 'Số điện thoại hoặc mật khẩu không chính xác.',
  USER_NOT_FOUND: 'Không tìm thấy tài khoản với số điện thoại này.',
  PHONE_EXISTS: 'Số điện thoại này đã được sử dụng trên hệ thống.',
  INVALID_ROLE: 'Tài khoản của bạn không có quyền truy cập vào cổng này.',
  FORBIDDEN: 'Bạn không có quyền thực hiện thao tác này.',

  // Fallback mappings for unaccented backend messages
  'Sai tai khoan hoac mat khau': 'Số điện thoại hoặc mật khẩu không chính xác.',
  'Phone number already exists': 'Số điện thoại này đã được sử dụng trên hệ thống.',
  'User has no role assigned': 'Tài khoản chưa được phân quyền trong hệ thống.',
  'User not found': 'Tài khoản không tồn tại trên hệ thống.',
  'phone, password and valid role are required': 'Vui lòng điền đầy đủ số điện thoại và mật khẩu.',
  'fullName, phone and password are required': 'Vui lòng điền đầy đủ thông tin đăng ký.',
  'phone must be a valid Vietnamese phone number': 'Số điện thoại không đúng định dạng Việt Nam.',
  'password must be at least 6 characters': 'Mật khẩu phải có ít nhất 6 ký tự.',
};

export const formatErrorMessage = (
  error: unknown,
  fallbackMessage = 'Đã có lỗi xảy ra. Vui lòng thử lại sau.'
): string => {
  if (!error) return fallbackMessage;

  const err = error as { response?: { data?: ApiErrorResponse } };
  const responseData = err.response?.data;

  if (responseData) {
    if (responseData.code && ERROR_MESSAGE_MAP[responseData.code]) {
      return ERROR_MESSAGE_MAP[responseData.code];
    }
    if (responseData.message && ERROR_MESSAGE_MAP[responseData.message]) {
      return ERROR_MESSAGE_MAP[responseData.message];
    }
    if (responseData.message) {
      return responseData.message;
    }
  }

  return fallbackMessage;
};
