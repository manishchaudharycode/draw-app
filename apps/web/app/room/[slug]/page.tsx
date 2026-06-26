import axios from "axios";
import { BACKEND_URL } from "../../config";
import { ChatRoom } from "../../../components/ChatRoom";

async function getRoomId(slug: string) {
  try {
    const response = await axios.get(`${BACKEND_URL}/room/${slug}`);

    console.log("API Response:", response.data);

    return response.data.id;
  } catch (err) {
    console.error("getRoomId error:", err);
    return null;
  }
}

export default async function ChatRoom1({
  params,
}: {
  params: Promise<{
    slug: string;
  }>;
}) {
  const { slug } = await params;
  const roomId = await getRoomId(slug);
  if (roomId) return <ChatRoom id={roomId}></ChatRoom>;
  else
    <main
      style={{
        display: "flex",
        height: "100vh",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
      }}
    >
      No room found
    </main>;
}
