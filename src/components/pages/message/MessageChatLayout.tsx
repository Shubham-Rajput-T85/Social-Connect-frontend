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
        gridTemplateColumns: { xs: '1fr', md: '1fr 3fr' },
        height: '100%',
        gap: 2,
      }}
    >
      <MessageChatSidebar onSelectUser={setSelectedUserId} />
      {selectedUserId ? (
        <MessageChatMain userId={selectedUserId} />
      ) : (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            bgcolor: 'background.paper',
            borderRadius: "10px",
          }}
        >
          Select a user to start chatting
        </Box>
      )}
    </Box>
  );
};

export default MessageChatLayout;
