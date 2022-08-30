import { createClient } from "@liveblocks/client";
import { createRoomContext } from "@liveblocks/react";

const client = createClient({
  publicApiKey: "your-api",
});

export const { RoomProvider, useOthers, useUpdateMyPresence, useList } =
  createRoomContext(client);
