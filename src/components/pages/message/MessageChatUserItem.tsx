import { ListItemButton, ListItemAvatar, Avatar, ListItemText, Badge, Box } from '@mui/material';
import React from 'react';
import { BASE_URL } from '../../../api/endpoints';

interface User {
  id: string;
  name: string;
  profile: string;
  online: boolean;
  unreadCount: number;
}

interface Props {
  user: User;
  onClick: () => void;
}

const MessageChatUserItem: React.FC<Props> = ({ user, onClick }) => {
  console.log("user online or not: ",user.online);
  return (
    <ListItemButton onClick={onClick}>
      <ListItemAvatar>
        <Badge
          overlap="circular"
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          variant="dot"
          sx={{
            '& .MuiBadge-badge': {
              backgroundColor: user.online ? "#00FF00" : "#FFC107",
            },
          }}
        >
          <Avatar
            src={user.profile ? BASE_URL + user.profile : "/default-avatar.png"}
            alt={user.name}
            sx={{
              width: 48,
              height: 48,
              border: "2px solid #e0e0e0",
              objectFit: "cover",
            }}
          />
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
