const express = require("express");
const axios = require("axios");
const app = express();
const PORT = process.env.PORT || 5000;

// Define a route for proxying requests
app.get("/scrape", async (req, res) => {
  try {
    // Fetch data from the target website
    const response = await axios.get(
      "https://cdcmemphremagog.com/repertoire-des-organismes/"
    );
    // Set appropriate headers to allow cross-origin requests
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-Type", "application/json");
    // Forward the response from the target website to the client
    res.send(response.data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
