import { LiveList } from "@liveblocks/client";
import {
  RoomProvider,
  useUpdateMyPresence,
  useOthers,
  useList,
} from "../liveblocks.config.js";
import React, { useContext, useState } from "react";

const ChatContext = React.createContext();

function SomeoneIsTyping() {
  const someoneIsTyping = useOthers()
    .toArray()
    .some((user) => user.presence?.isTyping);

  if (someoneIsTyping)
    return (
      <span className="text-white px-4 py-1 rounded-2xl bg-gray-400">...</span>
    );
  else return null;
}

function combineUserIds(userId1, userId2) {
  let result = "";
  for (let i = 0; i < userId1.length; i++) {
    result += userId1.charCodeAt(i) + userId2.charCodeAt(i);
  }
  return result;
}

function ChatImplementation() {
  const others = useOthers();
  const [draft, setDraft] = useState("");
  const updateMyPresence = useUpdateMyPresence();
  const chat = useList("chat");
  const { you, other } = useContext(ChatContext);

  if (chat == null) {
    return <div className="text-center w-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen h-max bg-silver-400 w-screen">
      <div className="mx-auto py-10 sm:w-3/5">
        <div className="font-black uppercase pt-2 bg-gray-400 px-2">
          <h3>{other}</h3>
          <div className="font-bold text-sm">
            {others.count ? (
              <p className="text-green-800">ONLINE</p>
            ) : (
              <p className="text-red-800">OFFLINE</p>
            )}
          </div>
        </div>

        <div className="bg-gray-100 pt-2 pb-4 px-2 border border-gray-400 text-right">
          {chat.map((msg, index) => {
            return (
              <div
                key={index}
                className={`sm:px-10 mt-2 ${
                  msg.sender == you ? "text-right" : "text-left"
                }`}
              >
                <span
                  className={`text-white px-4 py-1 rounded-xl bg-black ${
                    msg.sender == you ? "bg-blue-500" : "bg-gray-400"
                  }`}
                >
                  {msg.text}
                </span>
              </div>
            );
          })}

          <div className="mt-4">
            <SomeoneIsTyping />
          </div>

          <input
            type="text"
            placeholder="enter message"
            className="mt-10 rounded-lg border border-black placeholder:text-black px-4 w-3/5"
            value={draft}
            onChange={(e) => {
              setDraft(e.target.value);
              updateMyPresence({ isTyping: true });
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                updateMyPresence({ isTyping: false });
                chat.push({ text: draft, sender: you });
                setDraft("");
              }
            }}
            onBlur={() => updateMyPresence({ isTyping: false })}
          />
        </div>
      </div>
    </div>
  );
}

export default function Chat(props) {
  const you = props.you;
  const other = props.other;
  const chatId = combineUserIds(you, other);

  return (
    <ChatContext.Provider value={{ you: you, other: other }}>
      <RoomProvider id={chatId} initialStorage={{ chat: new LiveList() }}>
        <ChatImplementation />
      </RoomProvider>
    </ChatContext.Provider>
  );
}
