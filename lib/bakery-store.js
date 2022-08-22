//Initialize Unsplash

import { createApi } from "unsplash-js";

const unsplashApi = createApi({
  accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY,
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

export const fetchBakeries = async (
  latLong = "33.6844%2C73.0479",
  limit = 6
) => {
  const photos = await getListOfBakeriesPhotos();
  const options = {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: process.env.NEXT_PUBLIC_FOURSQUARE_API_KEY,
    },
  };

  const response = await fetch(
    getUrlForBakeries(latLong, "bakery", 100000, limit),
    options
  );
  const data = await response.json();
  console.log(photos);
  return data.results.map((result, idx) => {
    return {
      id: result.fsq_id,
      address: result.location.address,
      name: result.name,
      locality: result.location.locality,
      imgUrl: photos.length > 0 ? photos[idx] : null,
    };
  });
};
