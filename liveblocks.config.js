import { createClient } from "@liveblocks/client";
import { createRoomContext } from "@liveblocks/react";

const client = createClient({
  publicApiKey: "pk_test_YaS5GvNnw88ux-wIk_B7-_yY",
});

export const { RoomProvider, useOthers, useUpdateMyPresence, useList } = createRoomContext(client);