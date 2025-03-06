import { notification } from "antd";

const notifications = (type: string) => {
  switch (type) {
    case "register":
      return notification.success({
        message: "Code sent to Emile, please confirm.",
      });
      break;
    case "error-register":
      return notification.error({
        message: "Emile already exsist",
      });
      break;
    case "otp":
      return notification.success({
        message: "Done! Your OTP has been verified successfully.",
      });
      break;
    case "error-otp":
      return notification.error({
        message: "Invalid OTP. Please try again",
      });
      break;

    case "login":
      return notification.success({
        message: "You're in! Logged in successfully.",
      });
      break;
    case "error-login":
      return notification.error({
        message: "Login failed. Please try again later.",
      });
      break;
      case "add-movie":
        return notification.success({
          message: "Movie successfully saved.",
        });
        break;
        case "err-add-movie":
          return notification.error({
            message: "An error occurred while saving.",
          });
          break;

    default:
      break;
  }
};

export default notifications;
