import { Box, Typography } from '@mui/material';
import React, { useState } from 'react';
import MessageChatSidebar from './MessageChatSidebar';
import MessageChatMain from './MessageChatMain';

const MessageChatLayout: React.FC = () => {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: selectedUserId ? '1fr' : '1fr', // Mobile: show only 1 at a time
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
            xs: selectedUserId ? 'none' : 'block', // Hide on mobile when chat is open
            md: 'block',
            width: '100%',    // important
          },
        }}
      >
        <MessageChatSidebar onSelectUser={setSelectedUserId} />
      </Box>

      {/* Chat */}
      <Box
        sx={{
          display: {
            xs: selectedUserId ? 'block' : 'none', // Show only when user selected
            md: 'block',
            width: '100%',    // important
          },
        }}
      >
        {selectedUserId && (
          <MessageChatMain
            userId={selectedUserId}
            onBack={() => setSelectedUserId(null)} // Back button handler
          />
        )}
        {!selectedUserId && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: "center",
              alignItems: "center",
              bgcolor: 'background.paper',
              borderRadius: '10px',
              height: '100%',
              width: "110%",
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
