const express = require('express')
const mongoose = require('mongoose');

const app = express()
const port = 3000

app.get('/', (req, res) => {
   res.send('Hello World!')
})

mongoose.connect(
   `mongodb://user:password@mongodb:27017/my-temp-db?authSource=admin`,
   {
      useNewUrlParser: true,
      useUnifiedTopology: true,
   },
   (err) => {
      if (err) {
         console.error('FAILED TO CONNECT TO MONGODB');
         console.error(err);
      } else {
         console.log('CONNECTED TO MONGODB!! GET IN!!');
         app.listen(port);
      }
   }
);


