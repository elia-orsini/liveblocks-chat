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
    <div className="h-full bg-silver-800 w-screen">
      <div className="mx-auto max-h-screen h-screen bg-gray-100 sm:w-3/5 sm:border border-gray-400">
        <div className="w-full h-full">

        <div className="font-normal uppercase py-2 bg-gray-400 px-2 text-center">
          <h3>{other}</h3>
          <div className="font-semibold text-xs">
            {others.count ? (
              <p className="text-green-800">ONLINE</p>
            ) : (
              <p className="text-red-800">OFFLINE</p>
            )}
          </div>
        </div>

        <div className="h-5/6 overflow-y-auto snap-end bg-gray-100 pt-2 pb-4 px-2 text-right ">
            {chat.map((msg, index) => {
              return (
                <div
                key={index}
                className={`sm:px-10 mt-2 ${
                  msg.sender == you ? "text-right" : "text-left"
                }`}
                >
                  <span
                    className={`px-3 font-light py-1 rounded-xl bg-black ${
                      msg.sender == you ? "bg-blue-500 text-white rounded-br-none" : "bg-gray-300 text-black rounded-bl-none"
                    }`}
                    >
                    {msg.text}
                  </span>
                </div>
              );
            })}

          <div className="">
            <SomeoneIsTyping />
          </div>

          <div className="absolute right-0 bottom-4 sm:bottom-8 w-screen sm:w-3/5 sm:right-auto pr-3">
            <input
              type="text"
              placeholder="enter message"
              className="rounded-2xl placeholder:text-gray-400 placeholder:font-light px-3 w-4/5 sm:w-3/5"
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
