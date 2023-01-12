import { useEffect, useState } from "react";
import { Layout, Tabs } from "antd";

import MDBService from "../../service/MDBService";

import Context from "../Context";
import List from "../List";
import Alert from "../Alert";
import RatedList from "../RatedList";
import Spin from "../Spin";

import "./app.css";

const { Content } = Layout;

const App = () => {
  //--------------------------------------------------
  const [connectionError, setConnectionError] = useState(false);

  useEffect(() => {
    if (Navigator.onLine) setConnectionError(true); // Это странная строчка
    window.addEventListener("online", () => {
      setConnectionError(false);
    });
    window.addEventListener("offline", () => {
      setConnectionError(true);
      setActiveTab(false);
    });
  }, []);
  //--------------------------------------------------
  const [respondError, setError] = useState(false);
  //--------------------------------------------------
  const [genres, setGenres] = useState();

  useEffect(() => {
    MDBService.getGenres()
      .then((results) => setGenres(results))
      .catch(() => setError(true));
  }, []);
  //--------------------------------------------------
  const [guestId, setGuestId] = useState("");

  useEffect(() => {
    MDBService.getGuestId()
      .then((result) => setGuestId(result))
      .catch(() => setError(true));
  }, []);
  //--------------------------------------------------
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (connectionError || respondError || (genres && guestId))
      setLoading(false);
  }, [connectionError, respondError, genres, guestId]);
  //--------------------------------------------------
  const [activeTab, setActiveTab] = useState(false);

  useEffect(() => {
    if (!connectionError && genres && guestId) setActiveTab("1");
  }, [genres, guestId, connectionError]);
  //--------------------------------------------------
  return (
    <Context.Provider value={guestId}>
      <Layout className="app__layout">
        <Content className="app__content">
          <Tabs
            centered
            size="large"
            activeKey={activeTab}
            onChange={(ak) => setActiveTab(ak)}
            // destroyInactiveTabPane
            items={[
              {
                label: `Search`,
                key: "1",
                children: <List genres={genres} />,
                disabled: !activeTab,
              },
              {
                label: `Rated`,
                key: "2",
                children: (
                  <RatedList genres={genres} activeTabChanged={activeTab} />
                ),
                disabled: !activeTab,
              },
            ]}
          />
          <Spin loading={loading} />
          <Alert
            connectionError={connectionError}
            respondError={respondError}
          />
        </Content>
      </Layout>
    </Context.Provider>
  );
};
export default App;
