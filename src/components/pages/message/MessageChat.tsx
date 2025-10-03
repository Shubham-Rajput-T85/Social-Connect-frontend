import { Box, Typography } from '@mui/material';
import React from 'react';
import { IMessage } from '../../../api/services/message.service';
import { useSelector } from 'react-redux';

interface Props {
  message: IMessage;
}

const MessageChat: React.FC<Props> = ({ message }) => {
  const currentUserId = useSelector((state : any) => state.auth.user._id);
  // console.log("current user id:", currentUserId);
  
  const isMe = message.sender._id === currentUserId;
  // console.log("message sender :", message.sender._id);
  // console.log("isMe:",isMe);

  const date = message.createdAt ? new Date(message.createdAt) : new Date();
  const formatted = isNaN(date.getTime())
    ? ''
    : date.toLocaleString('en-US', { hour: 'numeric', minute: '2-digit' });

  return (
    <>
      <Typography
        variant="caption"
        sx={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start' }}
      >
        {formatted}
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start', width: '100%' }}>
        <Box
          sx={{
            position: 'relative',
            p: 1.5,
            borderRadius: '10px',
            borderTopRightRadius: isMe ? '0px' : '10px',
            borderTopLeftRadius: isMe ? '10px' : '0px',
            bgcolor: isMe ? 'primary.main' : 'grey.200',
            color: isMe ? 'white' : 'text.primary',
            maxWidth: '80vh',
            width: '80%',
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
            whiteSpace: 'pre-wrap',
          }}
        >
          <Typography variant="body2">{message.text}</Typography>

          {isMe && (
            <Typography
              variant="caption"
              sx={{ display: 'flex', justifyContent: 'flex-end', mt: 0.5 }}
            >
              {message.status === 'sent'
                ? '✓'
                : message.status === 'delivered'
                ? '✓✓'
                : '✓✓✔'}
            </Typography>
          )}
        </Box>
      </Box>
    </>
  );
};

export default MessageChat;
