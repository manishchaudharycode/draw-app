import { WebSocketServer } from "ws";
import  jwt, { type JwtPayload }  from "jsonwebtoken";
import { JWT_SECRET } from "./config/config";

const PORT = 8080;
const wss = new WebSocketServer({
  port: PORT,
});

wss.on("connection", (ws, request) => {
   const url = request.url
   if (!url) {
    return 
   }
   const queryParams = new URLSearchParams(url.split('?')[1]);
   const token = queryParams.get('token') || ""
   const decoded = jwt.verify(token, JWT_SECRET)

   if (!decoded || !(decoded as JwtPayload).userId){
    ws.close();
    return
   }

   ws.on('message', function message(data) {
    ws.send('pong')
   })
});

console.log("Ws server running on port: ", PORT);
