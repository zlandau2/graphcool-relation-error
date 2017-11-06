const algoliasearch = require("algoliasearch");

const client = algoliasearch(
  process.env["ALGOLIA_APP_ID"],
  process.env["ALGOLIA_API_KEY"],
);

const models = [
  {
    name: "Item",
    index: client.initIndex("ITEMS"),
  },
  {
    name: "Storage",
    index: client.initIndex("STORAGE"),
  },
];

module.exports = event => {
  if (!process.env["ALGOLIA_APP_ID"]) {
    console.log("Please provide a valid Algolia app id!");
    return { error: "Module not configured correctly." };
  }

  if (!process.env["ALGOLIA_API_KEY"]) {
    console.log("Please provide a valid Algolia api key!");
    return { error: "Module not configured correctly." };
  }

  for (const model of models) {
    const data = event.data[model.name];
    if (!data) {
      continue;
    }
    console.log("data is", data);
    const mutation = data.mutation;
    const node = data.node;
    const previousValues = data.previousValues;
    const index = model.index;

    // XXX: we are over saving here, only pull out the parts we care about..
    node._tags = ['user_' + node.user.id];
    // XXX: Some sort of tag should be associated with these objects for the
    // secured api key to only show them.
    switch (mutation) {
      case "CREATED":
        return index.addObject(node);
      case "UPDATED":
        return index.saveObject(node);
      case "DELETED":
        return index.deleteObject(previousValues.objectID);
      default:
        console.log("Unable to find mutation for event");
        return Promise.resolve();
    }
  }
};
