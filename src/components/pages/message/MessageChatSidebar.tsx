import { Box, Typography, List } from '@mui/material';
import React, { useEffect, useState, useCallback } from 'react';
import MessageChatUserItem from './MessageChatUserItem';
import { ConversationService, IConversation } from '../../../api/services/conversation.service';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

interface Props {
  onSelectConversation: (conversation: IConversation) => void;
  registerUnreadIncrement: (fn: (conversationId: string) => void) => void;
}

const MessageChatSidebar: React.FC<Props> = ({ onSelectConversation, registerUnreadIncrement }) => {
  const [conversations, setConversations] = useState<IConversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);

  const onlineUsers = useSelector((state: RootState) => state.onlineUsers.users);

  // Fetch all user conversations
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true);
        const data = await ConversationService.getConversations();
        setConversations(data);
      } catch (error) {
        console.error('Error fetching conversations:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchConversations();
  }, []);

  // Handle unread increment when notification arrives
  const incrementUnread = useCallback((conversationId: string) => {
    setConversations((prev) =>
      prev.map((conv) =>
        conv.conversationId === conversationId
          ? { ...conv, unreadCount: (conv.unreadCount || 0) + 1 }
          : conv
      )
    );
  }, []);

  // Register the unread increment function with layout
  useEffect(() => {
    registerUnreadIncrement(incrementUnread);
  }, [incrementUnread, registerUnreadIncrement]);

  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        borderRadius: '10px',
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
            {conversations.map((conv) => {
              const isOnline = onlineUsers.includes(conv.user._id);
              const isSelected = activeConvId === conv.conversationId;

              return (
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
                  onClick={() => {
                    setActiveConvId(conv.conversationId);
                    onSelectConversation(conv);
                    // Reset unread count when opened
                    setConversations((prev) =>
                      prev.map((c) =>
                        c.conversationId === conv.conversationId
                          ? { ...c, unreadCount: 0 }
                          : c
                      )
                    );
                  }}
                  selected={isSelected}
                />
              );
            })}
          </List>
        )}
      </Box>
    </Box>
  );
};

export default MessageChatSidebar;
