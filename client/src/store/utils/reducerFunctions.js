export const addMessageToStore = (state, payload) => {

  const { message, sender } = payload;
  // if sender isn't null, that means the message needs to be put in a brand new convo
  if (sender !== null) {
    const newConvo = {
      id: message.conversationId,
      otherUser: sender,
      messages: [message],
    };
    newConvo.latestMessageText = message.text;
    return [newConvo, ...state];
  }

  return state.map((convo) => {
    if (convo.id === message.conversationId) {
      const convoCopy = {...convo};
      convoCopy.messages.push(message);
      convoCopy.latestMessageText = message.text;
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const markMessagesAsRead = (state, payload) => {
  const { conversationId, senderId } = payload;
  return state.map((convo) => {
    if(convo.id === conversationId){
      const convoCopy = {...convo};
      convoCopy.messages.forEach((message, i) => {
        if(convoCopy.messages[i].senderId === senderId && !message.read){
          message.read = true;
        }        
      });
      return convoCopy;    
    }else{
      return convo;
    }
  });
}

export const trackReadMessages = (state, conversationId) => {
  if(conversationId === null){
    return state.map((convo) => {
      const unreadMessageCount = convo.messages.filter(message => !message.read && message.senderId === convo.otherUser.id).length;
      const userMessages = convo.messages.filter(message => message.read && message.senderId !== convo.otherUser.id);
      const convoCopy = {...convo, unreadMessageCount: unreadMessageCount, otherUserLastReadMessage: userMessages[userMessages.length - 1]};
      return convoCopy;
    });
  }else{
    return state.map((convo) => {
      if(convo.id === conversationId){
        const unreadMessageCount = convo.messages.filter(message => !message.read && message.senderId === convo.otherUser.id).length; 
        const userMessages = convo.messages.filter(message => message.read && message.senderId !== convo.otherUser.id);
        const convoCopy = {...convo, unreadMessageCount: unreadMessageCount, otherUserLastReadMessage: userMessages[userMessages.length - 1]};
        return convoCopy;
      }else{
        return convo;
      }
    });
  }
}

export const setLastReadMessage = (state, message) => {
  return state.map((convo) => {
    if(convo.id === message.conversationId){
      const convoCopy = {...convo};
      convoCopy.messages.forEach((element, i) => {
        if(convoCopy.messages[i].senderId === element.senderId && !element.read){
          element.read = true;
        }        
      });
      convoCopy.otherUserLastReadMessage = message;
      return convoCopy;
    }else{
      return convo;
    }
  }); 
}

export const addOnlineUserToStore = (state, id) => {
  return state.map((convo) => {
    if (convo.otherUser.id === id) {
      const convoCopy = { ...convo };
      convoCopy.otherUser.online = true;
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const removeOfflineUserFromStore = (state, id) => {
  return state.map((convo) => {
    if (convo.otherUser.id === id) {
      const convoCopy = { ...convo };
      convoCopy.otherUser.online = false;
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const addSearchedUsersToStore = (state, users) => {
  const currentUsers = {};

  // make table of current users so we can lookup faster
  state.forEach((convo) => {
    currentUsers[convo.otherUser.id] = true;
  });

  const newState = [...state];
  users.forEach((user) => {
    // only create a fake convo if we don't already have a convo with this user
    if (!currentUsers[user.id]) {
      let fakeConvo = { otherUser: user, messages: [] };
      newState.push(fakeConvo);
    }
  });

  return newState;
};

export const addNewConvoToStore = (state, recipientId, message) => {
  return state.map((convo) => {
    if (convo.otherUser.id === recipientId) {
      const convoCopy = {...convo};
      convoCopy.id = message.conversationId;
      convoCopy.messages.push(message);
      convoCopy.latestMessageText = message.text;
      return convoCopy;
    } else {
      return convo;
    }
  });
};


