import { Box, Typography, IconButton, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import React, { useState } from 'react';
import { IMessage, MessageStatus } from '../../../api/services/message.service';
import { useSelector } from 'react-redux';

interface Props {
  message: IMessage;
  onEdit: (msg: IMessage) => void;
  onDelete: (msgId: string) => void;
  isDimmed: boolean;
}

const MessageChat: React.FC<Props> = ({ message, onEdit, onDelete, isDimmed }) => {
  const currentUserId = useSelector((state: any) => state.auth.user._id);
  const isMe = message.sender._id === currentUserId;

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const date = message.editedAt ? new Date(message.editedAt) : new Date(message.createdAt);
  const formatted = isNaN(date.getTime())
    ? ''
    : date.toLocaleString('en-US', { hour: 'numeric', minute: '2-digit' });

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    handleMenuClose();
    onEdit(message);
  };

  const handleDelete = () => {
    handleMenuClose();
    onDelete(message._id);
  };

  return (
    <Box
      sx={{
        opacity: isDimmed ? 0.3 : 1,
        transition: 'opacity 0.2s ease',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start', gap: 1 }}>
        <Typography variant="caption">{formatted} <b>{message.editedAt && "(edited)"}</b></Typography>
        {( isMe && !message.isDeleted ) && (
          <Typography
            variant="caption"
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              fontWeight: 'bold',
              color:
                message.status === MessageStatus.SENT
                  ? '#5F6368'
                  : message.status === MessageStatus.DELIVERED
                    ? '#212121'
                    : '#1E90FF',
            }}
          >
            {message.status === MessageStatus.SENT ? '✓' : '✓✓'}
          </Typography>
        )}
      </Box>

      <Box
        sx={{
          display: 'flex',
          justifyContent: isMe ? 'flex-end' : 'flex-start',
        }}
      >
        <Box
          sx={{
            position: 'relative',
            p: 1.5,
            borderRadius: '10px',
            borderTopRightRadius: isMe ? '0px' : '10px',
            borderTopLeftRadius: isMe ? '10px' : '0px',
            bgcolor: isMe ? 'primary.main' : 'grey.200',
            color: isMe ? 'white' : 'text.primary',
            maxWidth: '80%',
            flexWrap: 'wrap',
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
            whiteSpace: 'pre-wrap',
            '&:hover .menu-btn': { visibility: message.isDeleted ? 'hidden':'visible', color:"white" }, // show button on hover
          }}
        >
          <Typography variant="body2" sx={{ maxWidth: '60vh', flexWrap: 'wrap' }}>
            {message.text}
          </Typography>

          {/* Menu button inside bubble */}
          {isMe && (
            <>
              <IconButton
                size="small"
                className="menu-btn"
                onClick={handleMenuClick}
                sx={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  visibility: 'hidden',
                  padding: '2px',
                  zIndex: 2,
                }}
              >
                <MoreVertIcon fontSize="small" />
              </IconButton>

              <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
                <MenuItem onClick={handleEdit}>Edit</MenuItem>
                <MenuItem onClick={handleDelete}>Delete</MenuItem>
              </Menu>
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default MessageChat;
