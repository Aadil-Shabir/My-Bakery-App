import {
  getMinifiedRecords,
  table,
  findRecordByFilter,
} from "../../lib/airtable";

const createBakery = async (req, res) => {
  if (req.method === "POST") {
    // find a record

    const { id, name, neighborhood, locality, address, imgURL, voting } =
      req.body;

    try {
      if (id) {
        const records = await findRecordByFilter(id);

        if (records.length !== 0) {
          res.send(records);
        } else {
          //create a record
          if (id && name) {
            const createRecords = await table.create([
              {
                fields: {
                  id,
                  name,
                  neighborhood,
                  address,
                  voting,
                  locality,
                  imgURL,
                },
              },
            ]);

            const records = getMinifiedRecords(createRecords);

            res.json({ records });
          } else {
            res.status(400);
            res.json({ message: "ID or Name is/are missing" });
          }
        }
      } else {
        res.status(400);
        res.json({ message: "ID is missing" });
      }
    } catch (err) {
      console.log("Error Creating or Finding a Bakery", err);
      res.status(500);
      res.json({ message: "Error Creating or Finding a Bakery", err });
    }
  }
};

export default createBakery;
