import  express  from "express"
import cors from "cors"
import userRoute from "./routes/userRoute"

const PORT = 4000
const app = express()

app.use(express.json())

app.use(cors())

app.use("/api/v1", userRoute)

app.listen(PORT, ()=>{
    console.log("sever running port", PORT);
})