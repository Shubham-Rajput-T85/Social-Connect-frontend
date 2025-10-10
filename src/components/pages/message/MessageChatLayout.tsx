import { Box, Typography } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import MessageChatSidebar from './MessageChatSidebar';
import MessageChatMain from './MessageChatMain';
import { IConversation } from '../../../api/services/conversation.service';
import { getSocket } from '../../../socket';

const MessageChatLayout: React.FC = () => {
  const [selectedConversation, setSelectedConversation] = useState<IConversation | null>(null);

  // A ref function to increment unread count in sidebar
  const incrementUnreadRef = useRef<((conversationId: string) => void) | null>(null);

  // Register unread increment function from sidebar
  const registerUnreadIncrement = (fn: (conversationId: string) => void) => {
    incrementUnreadRef.current = fn;
  };

  // Listen to socket notification for unread count updates
  useEffect(() => {
    const socket = getSocket();
  
    socket.on('newMessageNotification', (notification) => {
      console.log('Chat notification received:', notification);
      incrementUnreadRef.current?.(notification.conversationId);
    });
  
    return () => {
      socket.off('newMessageNotification');
    };
  }, []);
  

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: selectedConversation?.conversationId ? '1fr' : '1fr', // Mobile: toggle
          md: '1fr 3fr', // Desktop: side-by-side
        },
        height: '100%',
        gap: 2,
      }}
    >
      {/* Sidebar */}
      <Box
        sx={{
          display: {
            xs: selectedConversation?.conversationId ? 'none' : 'block',
            md: 'block',
            width: '100%',
          },
        }}
      >
        <MessageChatSidebar
          onSelectConversation={setSelectedConversation}
          registerUnreadIncrement={registerUnreadIncrement}
        />
      </Box>

      {/* Main Chat */}
      <Box
        sx={{
          display: {
            xs: selectedConversation?.conversationId ? 'block' : 'none',
            md: 'block',
            width: '100%',
          },
        }}
      >
        {selectedConversation ? (
          <MessageChatMain
            conversation={selectedConversation}
            onBack={() => setSelectedConversation(null)}
          />
        ) : (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              bgcolor: 'background.paper',
              borderRadius: '10px',
              height: '80vh',
              width: '100%',
              overflow: 'hidden',
            }}
          >
            <Typography variant="body1">Click on a user to open chat</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default MessageChatLayout;
