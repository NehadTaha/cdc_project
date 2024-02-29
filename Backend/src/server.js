const express = require("express");
const axios = require("axios");
const app = express();
const PORT = process.env.PORT || 5000;




// Start the server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
