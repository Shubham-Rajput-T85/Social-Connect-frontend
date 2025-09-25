import { ListItemButton, ListItemAvatar, Avatar, ListItemText, Badge, Box } from '@mui/material';
import React from 'react';

interface User {
  id: string;
  name: string;
  avatar: string;
  online: boolean;
  unreadCount: number;
}

interface Props {
  user: User;
  onClick: () => void;
}

const MessageChatUserItem: React.FC<Props> = ({ user, onClick }) => {
  return (
    <ListItemButton onClick={onClick}>
      <ListItemAvatar>
        <Badge
          overlap="circular"
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          variant="dot"
          color={user.online ? 'success' : 'error'}
        >
          <Avatar src={user.avatar} />
        </Badge>
      </ListItemAvatar>
      <ListItemText
        primary={user.name}
        secondary={
          user.unreadCount > 0 ? (
            <Box component="span" sx={{ color: 'success.main', fontWeight: 'bold' }}>
              {user.unreadCount} new
            </Box>
          ) : null
        }
      />
    </ListItemButton>
  );
};

export default MessageChatUserItem;
