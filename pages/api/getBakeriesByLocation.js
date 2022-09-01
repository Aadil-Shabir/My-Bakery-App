import { fetchBakeries } from "../../lib/bakery-store";

const getBakeriesByLocation = async (req, res) => {
  //configure latLong and limit
  try {
    const { latLong, limit } = req.query;
    const response = await fetchBakeries(latLong, limit);
    res.status(200);
    res.json(response);
  } catch (err) {
    console.log("There is an Error", err);
    res.status(500);
    res.json({ message: "Oh no! Something went wrong", err });
  }
  //return
};

export default getBakeriesByLocation;
