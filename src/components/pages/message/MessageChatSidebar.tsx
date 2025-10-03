import { Box, Typography, List } from '@mui/material';
import React, { useEffect, useState } from 'react';
import MessageChatUserItem from './MessageChatUserItem';
import { ConversationService, IConversation } from '../../../api/services/conversation.service';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

interface Props {
  onSelectUser: (id: string) => void;
}

const MessageChatSidebar: React.FC<Props> = ({ onSelectUser }) => {
  const [conversations, setConversations] = useState<IConversation[]>([]);
  const [loading, setLoading] = useState(true);

  const onlineUsers = useSelector((state: RootState) => state.onlineUsers.users);
  console.log(onlineUsers);
  console.log(onlineUsers.length);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true);
        const data = await ConversationService.getConversations();
        console.log(data);
        setConversations(data);
      } catch (error) {
        console.error("Error fetching conversations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, []);

  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        borderRadius: "10px",
        overflowY: 'auto',
        height: '80vh',
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h6">Messages</Typography>
      </Box>

      <Box sx={{ flex: 1, overflowY: 'auto' }}>
        {loading ? (
          <Typography sx={{ p: 2 }}>Loading...</Typography>
        ) : (
          <List>
            {conversations.map(conv =>{ 
            const isOnline = onlineUsers.includes(conv.user._id);
            console.log(`conv.user._id:${conv.user._id} ${isOnline}` );
            return(
              <MessageChatUserItem
                key={conv.conversationId}
                user={{
                  id: conv.user._id,
                  name: conv.user.username,
                  profile: conv.user.profileUrl,
                  online: isOnline,
                  unreadCount: conv.unreadCount,
                }}
                onClick={() => onSelectUser(conv.user._id)}
              />
            )}
            )}
          </List>
        )}
      </Box>
    </Box>
  );
};

export default MessageChatSidebar;
