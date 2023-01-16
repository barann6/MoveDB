export default class MDBService {
  static #baseURL = 'https://api.themoviedb.org/3/';

  static #baseRequestIMDB = async function (additionalUrl, payload = {}) {
    const response = await fetch(`${this.#baseURL}${additionalUrl}`, payload);
    if (!response.ok) {
      console.log(`...${additionalUrl} error`)
      throw new Error();
    }
    return await response.json();
  };

  static #myApiKey = 'api_key=dc70480f02792da99e54ab45abbfc5eb';
  static #accaunt = {
    id: '16218373',
    name: 'Dupen',
    password: 'LuBpMtRgc@E9m@u',
  };

  static getGenres = async function () {
    const response = this.#baseRequestIMDB(
      `genre/movie/list?${this.#myApiKey}`
    );
    return (await response).genres;
  };

  static getSessionId = async function () {
    const requestToken = this.#baseRequestIMDB(
      `authentication/token/new?${this.#myApiKey}`
    );
    const createSessionWithLogin = this.#baseRequestIMDB(
      `authentication/token/validate_with_login?${this.#myApiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
        body: `{
          "username": "${this.#accaunt.name}",
          "password": "${this.#accaunt.password}",
          "request_token":"${(await requestToken).request_token}"
        }`,
      }
    );
    const sessionId = this.#baseRequestIMDB(
      `authentication/session/new?${this.#myApiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
        body: `{"request_token":"${(await createSessionWithLogin).request_token}"}`,
      }
    );
    return (await sessionId).session_id;
  };

  static getMovies = async function (searchRequest, page) {
    const response = this.#baseRequestIMDB(
      `search/movie?${this.#myApiKey}&page=${page}&query=${searchRequest}`
    );
    return await response;
  };

  static getRatedMovies = async function (sessionId, page) {
    const response = this.#baseRequestIMDB(
      `account/${this.#accaunt.id}/rated/movies?${
        this.#myApiKey
      }&session_id=${sessionId}&sort_by=created_at.asc&page=${page}`
    );
    return await response;
  };

  static rateMovie = async function (sessionId, movieId, number) {
    const response = this.#baseRequestIMDB(
      `movie/${movieId}/rating?${this.#myApiKey}&session_id=${sessionId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
        body: `{"value":${number}}`,
      }
    );
    return await response;
  };

  static deleteRating = async function (sessionId, movieId) {
    const response = this.#baseRequestIMDB(
      `movie/${movieId}/rating?${this.#myApiKey}&session_id=${sessionId}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
      }
    );
    return await response;
  };

  static getAccountStates = async function (sessionId, movieId) {
    const response = this.#baseRequestIMDB(
      `movie/${movieId}/account_states?${
        this.#myApiKey
      }&session_id=${sessionId}`
    );
    return (await response).rated.value;
  };
}
