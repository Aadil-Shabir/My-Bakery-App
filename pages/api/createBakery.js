const Airtable = require("airtable");
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_KEY
);

const table = base("bakeries");

console.log({ table });

const createBakery = async (req, res) => {
  if (req.method === "POST") {
    // find a record

    try {
      const findBakeryRecords = await table
        .select({ filterByFormula: `id="0"` })
        .firstPage();

      console.log({ findBakeryRecords });

      if (findBakeryRecords.length !== 0) {
        const records = findBakeryRecords.map((record) => {
          return {
            ...record.fields,
          };
        });
        res.send(records);
      } else {
        //create a record
        const createRecords = await table.create([
          {
            fields: {
              id: "1",
              name: "First Name",
              neighborhood: "First Neighborhood",
              address: "First Address",
              voting: 34,
              locality: "Pak",
              imgURL: "http://image.com",
            },
          },
        ]);

        const records = createRecords.map((record) => {
          return {
            ...record.fields,
          };
        });

        res.json({ records });
      }
    } catch (err) {
      console.log("Error Finding Bakery", err);
      res.status(500);
      res.json({ message: "Error Finding Bakery", err });
    }
  }
};

export default createBakery;