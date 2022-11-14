const express = require("express");
const axios = require("axios");
const Redis = require("ioredis");

const app = express();
const port = process.env.PORT || 3000;

let redisClient;

(async () => {
  redisClient = new Redis({
    host: "redis-server",
    port: "6379",
  });

  redisClient.on("error", (error) => console.error(`Error >>> : ${error}`));
  const cacheVisits = await redisClient.get("visits");
  if (!cacheVisits) redisClient.set("visits", 1);
})();

async function fetchApiData(species) {
  const apiResponse = await axios.get(
    `https://www.fishwatch.gov/api/species/${species}`
  );
  console.log("Request sent to the API");
  return apiResponse.data;
}

async function getSpeciesData(req, res) {
  const species = req.params.species;
  let results;
  let isCached = false;

  try {
    const cacheResults = await redisClient.get(species);
    if (cacheResults) {
      isCached = true;
      results = JSON.parse(cacheResults);
    } else {
      results = await fetchApiData(species);
      if (results.length === 0) {
        throw "API returned an empty array";
      }
      await redisClient.set(species, JSON.stringify(results));
    }

    res.send({
      fromCache: isCached,
      data: results,
    });
  } catch (error) {
    console.error(error);
    res.status(404).send("Data unavailable");
  }
}

app.get("/", async (req, res) => {
  const visits = await redisClient.get("visits");
  await redisClient.set("visits", parseInt(visits) + 1);
  res.json({ message: `Number of visits is: ` + visits });
});

app.get("/fish/:species", getSpeciesData);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
