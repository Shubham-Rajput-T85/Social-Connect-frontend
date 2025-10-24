import { ListItemButton, ListItemAvatar, Avatar, ListItemText, Badge, Box } from '@mui/material';
import React, { useState } from 'react';
import { BASE_URL } from '../../../api/endpoints';
import StoryRing from '../../ui/StoryRing';
import StoryViewerModal from '../../story/StoryViewerModal';

interface User {
  id: string;
  name: string;
  username: string;
  profile: string;
  online: boolean;
  unreadCount: number;
  storyCount: number;
}

interface Props {
  user: User;
  onClick: () => void;
  selected?: boolean;
}

const MessageChatUserItem: React.FC<Props> = ({ user, onClick, selected }) => {
  const [openViewer, setOpenViewer] = useState(false);
  console.log("-----------------story count:--------",user);
  const handleViewStory = () => user.storyCount > 0 && setOpenViewer(true);
  return (
    <ListItemButton onClick={onClick}
      sx={{
        bgcolor: selected ? 'action.selected' : 'transparent',
        '&:hover': {
          bgcolor: 'action.hover',
        },
      }}
    >
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
          <StoryRing
            keepAddButton={false}
            storyCount={user.storyCount}
            onAddStory={() => {}}
            onViewStory={handleViewStory}>
            <Avatar
              src={user.profile ? BASE_URL + user.profile : "/default-avatar.png"}
              alt={user.username}
              sx={{
                width: 48,
                height: 48,
                border: "2px solid #e0e0e0",
                objectFit: "cover",
              }}
            />
          </StoryRing>
        </Badge>
      </ListItemAvatar>
      <ListItemText
        primary={user.username}
        secondary={
          user.unreadCount > 0 ? (
            <Box component="span" sx={{ color: 'success.main', fontWeight: 'bold' }}>
              {user.unreadCount} new
            </Box>
          ) : null
        }
      />
      {/* Story Viewer */}
      <StoryViewerModal
        open={openViewer}
        onClose={() => setOpenViewer(false)}
        userId={user.id}
      />
    </ListItemButton>
  );
};

export default MessageChatUserItem;
