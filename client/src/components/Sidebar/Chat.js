import React, { useEffect } from "react";
import { Box } from "@material-ui/core";
import { BadgeAvatar, ChatContent } from "../Sidebar";
import { makeStyles } from "@material-ui/core/styles";
import { setActiveChat } from "../../store/activeConversation";
import { openConversation } from "../../store/utils/thunkCreators";
import { readMessagetracker } from "../../store/conversations";
import { connect } from "react-redux";
import { Badge } from "@material-ui/core";

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
  }
}));

const Chat = (props) => {
  const classes = useStyles();
  const { conversation } = props;
  const { otherUser } = conversation;
    
  const handleClick = async (conversation) => {
    await props.setActiveChat(conversation.otherUser.username);
    props.openConversation(conversation);
  };

  return (
    <Box onClick={() => handleClick(conversation)} className={classes.root}>
      <BadgeAvatar
        photoUrl={otherUser.photoUrl}
        username={otherUser.username}
        online={otherUser.online}
        sidebar={true}
      />
      <ChatContent conversation={conversation} />
      <Badge badgeContent={conversation.unreadMessageCount} color="primary"/>
    </Box>
  );
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

export default connect(null, mapDispatchToProps)(Chat);
