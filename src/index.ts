import dotenv from "dotenv";
dotenv.config({
  path:'./env'
});
import connectDB from './Db/index';
import { app } from "./app";



const port: any = process.env.PORT || 8000;





connectDB()
.then(()=>{
  app.listen(port, () => {
    console.log(`Server is running on \nhttp://localhost:${port}`);
  });
})
.catch((error)=>{
  console.log("MongoDB Connection Failed");
})





app.get('/', (req, res) => {
  res.send('Hello, TypeScript with Express!');
});

