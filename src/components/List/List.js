import { useState, useEffect, Fragment } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { List, Input } from "antd";
import { debounce } from "lodash";

import MDBService from "../../service/MDBService";
import Alert from "../Alert";
import Card from "../Card";

import "./list.css";

const _List = ({ genres }) => {
  //-------------------------------------------------
  const [loading, setLoading] = useState(false);
  const [respondError, setRespondError] = useState(false);

  const [searchField, setSearchField] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [data, setData] = useState([]);

  useEffect(() => {
    const search = debounce(() => {
      window.scrollTo({ top: 0 });

      if (!searchField) {
        setData([]);
        setLoading(false);
      } else {
        MDBService.getMovies(searchField, currentPage)
          .then((json) => setData(json))
          .catch(() => {
            setRespondError(true);
            setData([]);
          })
          .finally(() => setLoading(false));
      }
    }, 600);

    setRespondError(false);
    setLoading(true);
    search();

    return () => search.cancel();
  }, [searchField, currentPage]);
  //-------------------------------------------------
  const genresByIds = (ids) =>
    genres
      ? ids
          .map((id) => genres.find((genre) => genre.id === id))
          .map((genre) => genre.name)
      : [];
  //-------------------------------------------------
  return (
    <List
      size="large"
      grid={{
        gutter: 36,
        column: window.innerWidth >= 1440 ? 2 : 1,
      }}
      //-------------------------------------------------
      header={
        <Input
          autoFocus
          allowClear
          size="large"
          placeholder="Type to search..."
          onChange={(e) => {
            setSearchField(e.target.value);
            setCurrentPage(1);
          }}
          value={searchField}
          className="list__input"
        />
      }
      //-------------------------------------------------
      locale={{
        emptyText: respondError ? (
          <Alert noConnection={false} respondError={respondError} />
        ) : searchField ? (
          <>
            <SearchOutlined />
            Nothing found
          </>
        ) : (
          <>
            <SearchOutlined />
            Type something above
          </>
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
            voteAverage={item.vote_average}
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
export default _List;
