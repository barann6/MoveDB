import { Spin } from "antd";
import { Loading3QuartersOutlined } from "@ant-design/icons";

import "./spin.css";

Spin.setDefaultIndicator(<Loading3QuartersOutlined spin />);

const _Spin = ({ loading }) => {
  return <Spin size="large" spinning={loading} className="spin" />;
};

export default _Spin;
