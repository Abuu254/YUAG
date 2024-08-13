require('dotenv').config();
const app = require('./src/server');

const port = process.env.PORT || 80;

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});