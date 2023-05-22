const express=require('express')
const connectDB=require('./config/db')
const cors = require("cors");

const app=express()
app.use(express.json())
connectDB()
app.use(cors());

app.get('/',(req,res) => {
  res.send('websocket')
})
app.use("/api/users", require('./routes/api/user'));
app.use("/api/auth", require('./routes/api/auth'));
app.use("/api/profile", require('./routes/api/profile'));
app.use("/api/post", require("./routes/api/post"));


const PORT = process.env.PORT||5000

app.listen(PORT,()=>{
  console.log(`Port listening on ${PORT}`)
})