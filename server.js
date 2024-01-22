// import app from './app.js';
// import { connectDbPool } from "./src/database/connection.database.js";
// import * as database from './src/database/database.js'
import * as db from './src/database/database.js'

import makeApp from './app.js'

const app = makeApp(db)

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});


