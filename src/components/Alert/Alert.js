import { Alert } from "antd";

import "./alert.css";

const _Alert = ({ сonnectionError, respondError }) => {
  const description = () => {
    if (сonnectionError) return "No internet connection.";
    if (respondError) return "Server not responding.";
  };
  if (сonnectionError || respondError)
    return (
      <Alert
        message="Error"
        description={description()}
        type="error"
        className="alert"
      />
    );
};

export default _Alert;
