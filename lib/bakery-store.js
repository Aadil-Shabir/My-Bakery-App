//Initialize Unsplash

import { createApi } from "unsplash-js";

const unsplashApi = createApi({
  accessKey: process.env.UNSPLASH_ACCESS_KEY,
});

const getUrlForBakeries = (latLong, query, radius, limit) => {
  return `https://api.foursquare.com/v3/places/search?query=${query}&ll=${latLong}&radius=${radius}&limit=${limit}`;
};

const getListOfBakeriesPhotos = async () => {
  const photos = await unsplashApi.search.getPhotos({
    query: "bakery",
    page: 1,
    perPage: 30,
  });

  const unsplashResponse = photos.response.results;

  return unsplashResponse.map((result) => result.urls["small"]);
};

export const fetchBakeries = async () => {
  const photos = await getListOfBakeriesPhotos();
  const options = {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: process.env.FOURSQUARE_API_KEY,
    },
  };

  const response = await fetch(
    getUrlForBakeries("33.6844%2C73.0479", "bakery", 100000, 6),
    options
  );
  const data = await response.json();
  return data.results.map((result, idx) => {
    return {
      id: result.fsq_id,
      address: result.location.address,
      name: result.name,
      locality: result.location.locality,
      imgUrl: photos.lenght > 0 ? photos[idx] : null,
    };
  });
};
