import io from "socket.io-client";
import store from "./store";
import {
  setNewMessage,
  removeOfflineUser,
  addOnlineUser,
} from "./store/conversations";
import { openConversation } from "./store/utils/thunkCreators";

const socket = io(window.location.origin);

socket.on("connect", () => {
  console.log("connected to server");

  socket.on("add-online-user", (id) => {
    store.dispatch(addOnlineUser(id));
  });

  socket.on("remove-offline-user", (id) => {
    store.dispatch(removeOfflineUser(id));
  });

  socket.on("new-message", (data) => {
    let state = store.getState();
    store.dispatch(setNewMessage(data.message, data.sender));
    for(let i=0; i < state.conversations.length; i++){
      if (state.conversations[i].id === data.message.conversationId && 
        state.conversations[i].otherUser.username === state.activeConversation){
        store.dispatch(openConversation(state.conversations[i].id));
      }
    }
  });
});


export default socket;
