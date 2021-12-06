import io from "socket.io-client";
import store from "./store";
import {
  setNewMessage,
  removeOfflineUser,
  addOnlineUser,
  trackConversation,
  setOtherUserLastReadMessage
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
  
  socket.on("read-message", (data) => {
    if(data.message){
      const state = store.getState();
      state.conversations.forEach((conversation, i) => {
        if(conversation.id === data.message.conversationId){
          store.dispatch(setOtherUserLastReadMessage(data.message));
        }
      })
    }
  });

  socket.on("new-message", (data) => {
    let state = store.getState();
    store.dispatch(setNewMessage(data.message, data.sender));
    for(let i=0; i < state.conversations.length; i++){
      if (state.conversations[i].id === data.message.conversationId && 
        state.conversations[i].otherUser.username === state.activeConversation){
        store.dispatch(openConversation(state.conversations[i]));
      }else if (state.conversations[i].id === data.message.conversationId){
        store.dispatch(trackConversation(data.message.conversationId));
      }
    }
  });
});


export default socket;
