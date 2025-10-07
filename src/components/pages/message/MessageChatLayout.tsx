import { Box, Typography } from '@mui/material';
import React, { useState } from 'react';
import MessageChatSidebar from './MessageChatSidebar';
import MessageChatMain from './MessageChatMain';
import { IConversation } from '../../../api/services/conversation.service';

const MessageChatLayout: React.FC = () => {
  const [selectedConversation, setSelectedConversation] = useState<IConversation | null>(null);
  console.log("selected conversation:",selectedConversation);
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: selectedConversation?.conversationId ? '1fr' : '1fr', // Mobile: show only 1 at a time
          md: '1fr 3fr', // Desktop: show both side by side
        },
        height: '100%',
        gap: 2,
      }}
    >
      {/* Sidebar */}
      <Box
        sx={{
          display: {
            xs: selectedConversation?.conversationId ? 'none' : 'block', // Hide on mobile when chat is open
            md: 'block',
            width: '100%',    // important
          },
        }}
      >
        <MessageChatSidebar onSelectConversation={setSelectedConversation} />
      </Box>

      {/* Chat */}
      <Box
        sx={{
          display: {
            xs: selectedConversation?.conversationId ? 'block' : 'none', // Show only when user selected
            md: 'block',
            width: '100%',    // important
          },
        }}
      >
        {selectedConversation && (
          <MessageChatMain
            conversation={selectedConversation}
            onBack={() => setSelectedConversation(null)} // Back button handler
          />
        )}
        {!selectedConversation?.conversationId && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: "center",
              alignItems: "center",
              bgcolor: 'background.paper',
              borderRadius: '10px',
              height: '80vh',
              width: "100%",
              overflow: 'hidden',
            }}
          >
            <Typography variant='body1'>click on user to open chat</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default MessageChatLayout;
