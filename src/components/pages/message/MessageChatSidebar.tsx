import { Box, Typography, Avatar, Badge, List, ListItemButton, ListItemAvatar, ListItemText } from '@mui/material';
import React from 'react';
import MessageChatUserItem from './MessageChatUserItem';

interface User {
  id: string;
  name: string;
  avatar: string;
  online: boolean;
  unreadCount: number;
}

interface Props {
  onSelectUser: (id: string) => void;
}

const users: User[] = [
  { id: '1', name: 'John Doe', avatar: '/avatar1.jpg', online: true, unreadCount: 2 },
  { id: '2', name: 'Jane Smith', avatar: '/avatar2.jpg', online: false, unreadCount: 0 },
  
  // ...more dummy users
];

const MessageChatSidebar: React.FC<Props> = ({ onSelectUser }) => {
  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        borderRadius: "10px",
        overflowY: 'auto',
        height: '80vh',
        display: 'flex',
        flexDirection: 'column',
        width: '100%',    // important
        maxWidth: '100%', // constrain max width
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h6">Messages</Typography>
      </Box>
      <Box sx={{ flex: 1, overflowY: 'auto' }}>
      <List>
        {users.map(user => (
          <MessageChatUserItem key={user.id} user={user} onClick={() => onSelectUser(user.id)} />
        ))}
      </List>
      </Box>
    </Box>
  );
};

export default MessageChatSidebar;
