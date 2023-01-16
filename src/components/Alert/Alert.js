import { Alert } from 'antd';

import './alert.css';

const _Alert = ({ connectionError, respondError }) => {
  const description = () => {
    if (connectionError) return 'No internet connection.';
    if (respondError) return 'Server not responding.';
  };
  if (connectionError || respondError)
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
