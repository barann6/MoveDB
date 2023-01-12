export default class MDBService {
  static #myApiKey = "api_key=dc70480f02792da99e54ab45abbfc5eb";

  static getGenres = async function () {
    const response = await fetch(
      `https://api.themoviedb.org/3/genre/movie/list?${this.#myApiKey}`
    );
    if (!response.ok) {
      throw new Error("getGenres error");
    }
    const _ = await response.json();
    return _.genres;
  };

  static getGuestId = async function () {
    const response = await fetch(
      `https://api.themoviedb.org/3/authentication/guest_session/new?${
        this.#myApiKey
      }`
    );
    if (!response.ok) {
      throw new Error("getGuestId error");
    }
    const _ = await response.json();
    return _.guest_session_id;
  };

  static getMovies = async function (searchRequest, page) {
    const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?${
        this.#myApiKey
      }&page=${page}&query=${searchRequest}`
    );
    if (!response.ok) {
      throw new Error("getMovies error");
    }
    return await response.json();
  };

  static getRatedMovies = async function (guestId) {
    const response = await fetch(
      `https://api.themoviedb.org/3/guest_session/${guestId}/rated/movies?${
        this.#myApiKey
      }`
    );
    if (!response.ok) {
      throw new Error("getRatedMovies error");
    }
    return await response.json();
  };

  static rateMovie = async function (guestId, movieId, number) {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}/rating?${
        this.#myApiKey
      }&guest_session_id=${guestId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
        body: `{"value":${number}}`,
      }
    );
    if (!response.ok) {
      throw new Error("rateMovie error");
    }
    return await response.json();
  };

  static deleteRating = async function (guestId, movieId) {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}/rating?${
        this.#myApiKey
      }&guest_session_id=${guestId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
      }
    );
    if (!response.ok) {
      throw new Error("deleteRating error");
    }
    return await response.json();
  };
}
