import { Box, Typography, List } from '@mui/material';
import React, { useEffect, useState } from 'react';
import MessageChatUserItem from './MessageChatUserItem';
import { ConversationService, IConversation } from '../../../api/services/conversation.service';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

interface Props {
  onSelectConversation: (conversation: IConversation) => void;
}

const MessageChatSidebar: React.FC<Props> = ({ onSelectConversation }) => {
  const [conversations, setConversations] = useState<IConversation[]>([]);
  const [loading, setLoading] = useState(true);

  const onlineUsers = useSelector((state: RootState) => state.onlineUsers.users);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true);
        const data = await ConversationService.getConversations();
        setConversations(data);
      } catch (error) {
        console.error("Error fetching conversations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, []);

  const [activeConvId, setActiveConvId] = useState<string | null>(null);

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
            const isSelected = activeConvId === conv.conversationId;
            console.log(`conv.user._id:${conv.user._id} ${isOnline}` );
            return(
              <MessageChatUserItem
                key={conv.conversationId}
                user={{
                  id: conv.user._id,
                  name: conv.user.name,
                  username: conv.user.username,
                  profile: conv.user.profileUrl,
                  online: isOnline,
                  unreadCount: conv.unreadCount,
                }}
                onClick={() =>{
                  setActiveConvId(conv.conversationId);
                  onSelectConversation(conv);
                } 
              }
              selected={isSelected}
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
