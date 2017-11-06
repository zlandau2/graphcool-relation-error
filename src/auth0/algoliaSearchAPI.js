const algoliasearch = require("algoliasearch");
const client = algoliasearch(
  process.env["ALGOLIA_APP_ID"],
  process.env["ALGOLIA_API_KEY"],
);

export default async event => {
  if (!event.context.auth) {
    return { data: null };
  }
  const api = await client.generateSecuredApiKey(
    process.env["ALGOLIA_SEARCH_API_KEY"],
    { filters: "_tags:user_" + event.context.auth.nodeId },
  );

  return {
    data: {
      api,
    },
  };
};
