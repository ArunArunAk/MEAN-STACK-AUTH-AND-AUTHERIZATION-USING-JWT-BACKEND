const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require('cors');
const userRoutes=require("./Routes/user")
const roleRoutes=require("./Routes/role") 
const permissionroute=require("./Routes/permission");
const cookieParser = require("cookie-parser");
const bodyParser = require('body-parser');



const app = express();
const port = 4800;
const password = encodeURIComponent("A2431k672286831268192lkjnlkffnvakhiua412das2531erae51762123#");
// const mongoDbUrl = `mongodb+srv://aru112342225nakdasarun223gs:${password}@cluster0.cgnglhb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const mongoDbUrl = `mongodb+srv://ar111u112345nakda33sarrrutytn4223gs:${password}@cluster0.cgnglhb.mongodb.net/Authservices?retryWrites=true&w=majority&appName=Cluster0`;

app.use(cors()) 


app.use(express.json()); 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser())
app.use("/users", userRoutes);
app.use("/api/role", roleRoutes);
app.use("/usersdetails", permissionroute);
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Internal Server Error');
});
 

 
 
async function connectToDatabase() {
  try {
    await mongoose.connect(mongoDbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true 
    });
    console.log("Connected to MongoDB Atlas");
  } catch (error) {
    console.error("Error connecting to MongoDB Atlas:", error);
  }
}

connectToDatabase();

 

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});




 
