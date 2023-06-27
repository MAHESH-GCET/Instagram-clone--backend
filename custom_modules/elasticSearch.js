require("dotenv").config();
// Import Elasticsearch and other required modules
const { Client } = require("@elastic/elasticsearch");
// Create an Elasticsearch client
const client = new Client({
  node: `https://localhost:9200`,
  auth: {
    username: "elastic",
    password: process.env.elastic_password,
  },
  tls: {
    //  ca: fs.readFileSync('./http_ca.crt'),
    rejectUnauthorized: false,
  },
});

module.exports={client}
