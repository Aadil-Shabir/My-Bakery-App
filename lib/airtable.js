const Airtable = require("airtable");
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_KEY
);

const table = base("bakeries");

const getMinifiedRecord = (record) => {
  return {
    recordId: record.id,
    ...record.fields,
  };
};

const getMinifiedRecords = (records) => {
  return records.map((record) => getMinifiedRecord(record));
};

const findRecordByFilter = async (id) => {
  const findBakeryRecords = await table
    .select({
      filterByFormula: `id="${id}"`,
    })
    .firstPage();

  return getMinifiedRecords(findBakeryRecords);
};

export { table, getMinifiedRecords, findRecordByFilter };
