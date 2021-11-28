import React from "react";
import { Box } from "@material-ui/core";
import { BadgeAvatar, ChatContent } from "../Sidebar";
import { makeStyles } from "@material-ui/core/styles";
import { setActiveChat } from "../../store/activeConversation";
import { openConversation } from "../../store/utils/thunkCreators";
import { connect } from "react-redux";
import { Avatar } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    borderRadius: 8,
    height: 80,
    boxShadow: "0 2px 10px 0 rgba(88,133,196,0.05)",
    marginBottom: 10,
    display: "flex",
    alignItems: "center",
    "&:hover": {
      cursor: "grab"
    }
  },
  unreadMessageCount:{
    height: 25,
    width: 25,
  }
}));

const Chat = (props) => {
  const classes = useStyles();
  const { conversation, userId } = props;
  const { otherUser } = conversation;
  
  const handleClick = async (conversation) => {
    await props.setActiveChat(conversation.otherUser.username);
    props.openConversation(conversation.id);
  };

  const showUnreadMessages = () => {
    const unreadMessageCount = conversation.messages.filter(message => !message.read && message.senderId !== userId).length;
    return (unreadMessageCount === 0)?"":<Avatar className={classes.unreadMessageCount}>{unreadMessageCount}</Avatar>;
  }

  return (
    <Box onClick={() => handleClick(conversation)} className={classes.root}>
      <BadgeAvatar
        photoUrl={otherUser.photoUrl}
        username={otherUser.username}
        online={otherUser.online}
        sidebar={true}
      />
      <ChatContent conversation={conversation} />
      {showUnreadMessages()}
    </Box>
  );
};

const mapStateToProps = (state) => {
  return {
    userId: state.user.id
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setActiveChat: (id) => {
      dispatch(setActiveChat(id));
    },
    openConversation:(conversation) => {
      dispatch(openConversation(conversation));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
