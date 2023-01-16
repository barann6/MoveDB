import { useState, useEffect, useContext } from "react";
import { List } from "antd";

import MDBService from "../../service/MDBService";
import Alert from "../Alert";
import Card from "../Card";
import Context from "../Context";

import "../List/list.css";

const _RatedList = ({ genres, activeTabChanged }) => {
  //-------------------------------------------------
  const [loading, setLoading] = useState(false);
  const [respondError, setRespondError] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState([]);
  
  const context = useContext(Context);

  useEffect(() => {
    setRespondError(false);
    setLoading(true);
    MDBService.getRatedMovies(context, currentPage)
      .then((response) => setData(response))
      .catch(() => {
        setRespondError(true);
        setData([]);
      })
      .finally(() => setLoading(false));
  }, [context, activeTabChanged, currentPage]);
  //-------------------------------------------------
  const genresByIds = (ids) =>
    ids
      .map((id) => genres.find((genre) => genre.id === id))
      .map((genre) => genre.name);
  //-------------------------------------------------
  return (
    <List
      size="large"
      grid={{
        gutter: 36,
        column: window.innerWidth >= 1440 ? 2 : 1,
      }}
      //-------------------------------------------------
      locale={{
        emptyText: respondError ? (
          <Alert сonnectionError={false} respondError={respondError} />
        ) : (
          <>No rated films</>
        ),
      }}
      //-------------------------------------------------
      loading={{
        spinning: loading,
        size: "large",
        className: "list_spin",
      }}
      //-------------------------------------------------
      dataSource={data.results}
      rowKey={(item) => item.id}
      renderItem={(item) => (
        <List.Item className="list__item">
          <Card
            poster={item.poster_path}
            title={item.original_title}
            date={item.release_date}
            genres={genresByIds(item.genre_ids)}
            overview={item.overview}
            voteAverage={item.vote_average.toFixed(1)}
            rating={item.rating}
            id={item.id}
          />
        </List.Item>
      )}
      //-------------------------------------------------
      pagination={{
        className: "list__pagination",
        defaultPageSize: 20,
        total: data.total_results,
        current: currentPage,
        onChange: setCurrentPage,
        showSizeChanger: false,
        hideOnSinglePage: true,
      }}
    />
  );
};
export default _RatedList;
