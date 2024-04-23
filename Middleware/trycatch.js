export const trycatchmidddleware = (statusCode, message) => {
    const error = new Error();
    error.statusCode = statusCode;
    switch( statusCode) {
      case 404:
        break;
      case 401:
        break;
    }
    error.message = message;
    return error;
  };