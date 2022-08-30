# Liveblocks Simple Chat

### What is it

A chat implementation in React using the Liveblocks API.

### How to start

To start the demo clone the repo:
```
git clone https://github.com/elia-orsini/liveblocks-chat.git
```
move into the folder
```
cd liveblocks-chat
```
install the dependencies
```
npm i
```
update the `liveblocks.config.js` file with your API key (by signing on liveblocks).<br />
finally, run the demo
```
npm run dev
```

### Import it in your projects

To import it in your projects you would need to import the `Chat` component and call it in the following way:
```
<Chat you="your-user-id" other="other-user-id" />
```
in this case `your-user-id` is the user ID of the user accessing the chat while `other-user-id` is the receiver of the chat messages.
<br /><br /><br />
(if you copy the `Chat.jsx` file in your project, remember to copy the `liveblocks.config.js` file as well)
