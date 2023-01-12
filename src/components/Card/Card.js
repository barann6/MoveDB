import { useContext, useState } from "react";

import { Tag, Typography, Image, Card, Col, Row, Rate } from "antd";

import { truncate } from "lodash";
import format from "date-fns/format";

import placeholder from "./placeholder.jpg";
import MDBService from "../../service/MDBService";
import Context from "../Context";

import "./card.css";

const { Title, Text } = Typography;

const _Card = (prop) => {
  //--------------------------------------------------
  const guestId = useContext(Context);
  //--------------------------------------------------
  const [rating, setRating] = useState(prop.rating);

  const handleChangeRating = (vote) => {
    if (vote === 0) {
      MDBService.deleteRating(guestId, prop.id);
    } else {
      MDBService.rateMovie(guestId, prop.id, vote);
    }
    setRating(vote);
  };
  //--------------------------------------------------
  const voteColor = (vote) => {
    if (vote < 3) return "low";
    if (vote < 5) return "medium";
    if (vote < 7) return "high";
    return "very-high";
  };
  //--------------------------------------------------
  const poster = (
    <Image
      src={`https://image.tmdb.org/t/p/w185${prop.poster}`}
      fallback={placeholder}
      alt="Film poster"
      preview={false}
      width={window.innerWidth >= 1440 ? 185 : 62}
      height={window.innerWidth >= 1440 ? 278 : 93}
    />
  );

  const title = (
    <Title level={5} className="card__title">
      {prop.title}
    </Title>
  );

  const voteAverage = (
    <Text
      className={`card__vote-average card__vote-average_${voteColor(
        prop.voteAverage
      )}`}
    >
      {prop.voteAverage}
    </Text>
  );

  const date = (
    <Text type="secondary" className="card__date">
      {prop.date ? format(new Date(prop.date), "MMMM d, yyyy") : null}
    </Text>
  );

  const genres = prop.genres.map((genre, i) => (
    <Tag key={i} className="card__genre-tag">
      {genre}
    </Tag>
  ));

  const overview = (
    <Text className="card__overview">
      {truncate(prop.overview, {
        length: 200,
        separator: " ",
        omission: " ...",
      })}
    </Text>
  );

  const rate = (
    <Rate
      allowHalf
      count={10}
      defaultValue={0}
      value={rating}
      onChange={handleChangeRating}
      className="card__rate"
    />
  );
  //--------------------------------------------------
  if (window.innerWidth >= 1440)
    return (
      <Card hoverable bodyStyle={{ padding: "0" }} className="card">
        <Row wrap={false}>
          <Col flex="183px">{poster}</Col>
          <Col flex="auto">
            <Row wrap={false} align="middle" justify="space-around">
              {title}
              {voteAverage}
            </Row>
            {date}
            <Row className="card__genres">{genres}</Row>
            {overview}
            {rate}
          </Col>
        </Row>
      </Card>
    );
  else
    return (
      <Card hoverable bodyStyle={{ padding: "0" }} className="card">
        <Row wrap={false}>
          <Col flex="62px">{poster}</Col>
          <Col flex="auto">
            <Row wrap={false} align="middle" justify="space-between">
              {title}
              {voteAverage}
            </Row>
            <Row>{date}</Row>
            <Row className="card__genres">{genres}</Row>
          </Col>
        </Row>
        <Row>{overview}</Row>
        <Row justify="end">{rate}</Row>
      </Card>
    );
};
export default _Card;
