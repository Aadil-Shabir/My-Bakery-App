import {
  table,
  findRecordByFilter,
  getMinifiedRecords,
} from "../../lib/airtable";

const upvoteBakeryById = async (req, res) => {
  if (req.method === "PUT") {
    try {
      const { id } = req.body;

      if (id) {
        const records = await findRecordByFilter(id);

        if (records.length !== 0) {
          const record = records[0];
          const calculateVoting = parseInt(record.voting) + 1;

          // Update a record
          const updatedRecord = await table.update([
            {
              id: record.recordId,
              fields: {
                voting: calculateVoting,
              },
            },
          ]);

          if (updatedRecord) {
            const minifiedRecord = getMinifiedRecords(updatedRecord);
            res.json(minifiedRecord);
          }
        } else {
          res.json({ message: "Bakery Id doesn't exist", id });
        }
      } else {
        res.status(400);
        res.json({ message: "Id is missing" });
      }
    } catch (err) {
      res.status(500);
      res.json({ message: "Error Upvoting Bakery", err });
    }
  }
};

export default upvoteBakeryById;
