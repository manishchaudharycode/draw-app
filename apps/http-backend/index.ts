import express from "express"
import cors from "cors"
import userRouter from "./routes/userRoute"

const PORT = 4000
const app = express()

app.use(express.json())
app.use(cors())


app.use("/api/v1", userRouter)

app.listen(PORT, ()=>{
    console.log("Sever port running: ", PORT);
})