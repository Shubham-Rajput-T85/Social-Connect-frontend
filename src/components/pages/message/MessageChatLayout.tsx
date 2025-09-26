import { Box } from '@mui/material';
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
            maxWidth: '100%', // constrain max width
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
            maxWidth: '100%', // constrain max width
          },
        }}
      >
        {selectedUserId && (
          <MessageChatMain
            userId={selectedUserId}
            onBack={() => setSelectedUserId(null)} // Back button handler
          />
        )}
      </Box>
    </Box>
  );
};

export default MessageChatLayout;
