import { useContext, useEffect, useState } from 'react';

import { Tag, Typography, Card, Rate } from 'antd';

import { truncate } from 'lodash';
import format from 'date-fns/format';

import placeholder from './placeholder.jpg';
import MDBService from '../../service/MDBService';
import Context from '../Context';

import './card.css';

const { Title, Text } = Typography;

const _Card = (prop) => {
  //--------------------------------------------------
  const guestId = useContext(Context);
  //--------------------------------------------------
  const [rating, setRating] = useState(false);

  useEffect(() => {
    if (!prop.rating) {
      MDBService.getAccountStates(guestId, prop.id)
        .then((rating) => setRating(rating))
        .catch(() => setRating(false));
    } else {
      setRating(prop.rating);
    }
  }, []);

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
    if (vote < 3) return 'low';
    if (vote < 5) return 'medium';
    if (vote < 7) return 'high';
    return 'very-high';
  };
  //--------------------------------------------------
  const poster = (
    <img
      className="card__poster"
      src={`https://image.tmdb.org/t/p/w185${prop.poster}`}
      alt="Film poster"
      onError={(e) => {
        e.target.src = placeholder;
      }}
    />
  );

  const title = (
    <Title className="card__title" level={5}>
      {prop.title}
    </Title>
  );

  const voteAverage = (
    <Text
      className={`card__vote-average card__vote-average_${voteColor(
        prop.voteAverage
      )}`}>
      {prop.voteAverage}
    </Text>
  );

  const date = (
    <Text className="card__date" type="secondary">
      {prop.date ? format(new Date(prop.date), 'MMMM d, yyyy') : null}
    </Text>
  );

  const genres = (
    <div className="card__genres">
      {prop.genres.map((genre, i) => (
        <Tag className="card__genre-tag" key={i}>
          {genre}
        </Tag>
      ))}
    </div>
  );

  const overview = (
    <Text className="card__overview">
      {truncate(prop.overview, {
        length: 120,
        separator: ' ',
        omission: ' ...',
      })}
    </Text>
  );

  const rate = (
    <Rate
      className="card__rate"
      allowHalf
      count={10}
      defaultValue={0}
      value={rating}
      onChange={handleChangeRating}
    />
  );
  //--------------------------------------------------
  return (
    <Card hoverable className="card">
      {poster}
      {title}
      {voteAverage}
      {date}
      {genres}
      {overview}
      {rate}
    </Card>
  );
};
export default _Card;
