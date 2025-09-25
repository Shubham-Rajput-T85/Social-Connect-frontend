import { Box, Typography } from '@mui/material';
import React from 'react';

export interface Message {
  id: string;
  text: string;
  sender: 'me' | 'them';
  timestamp: string;
  status: 'sent' | 'delivered' | 'seen';
}

interface Props {
  message: Message;
}

const MessageChat: React.FC<Props> = ({ message }) => {
  const isMe = message.sender === 'me';
  const date = new Date(message.timestamp);
  const formatted = date.toLocaleString('en-US', {
    // month: 'short',
    // day: 'numeric',
    // year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

  return (
    <>
      <Typography variant="caption"
        sx={{
          display: 'flex',
          justifyContent: isMe ? 'flex-end' : 'flex-start',
        }}>
        {formatted}
      </Typography>

      <Box
        sx={{
          display: 'flex',
          justifyContent: isMe ? 'flex-end' : 'flex-start',
        }}
      >
        <Box
          sx={{
            // maxWidth: '80%',
            p: 1.5,
            borderRadius: "10px",
            bgcolor: isMe ? 'primary.main' : 'grey.200',
            color: isMe ? 'white' : 'text.primary',
          }}
        >

          <Typography variant="body2">{message.text}</Typography>
          <Typography
            variant="caption"
            sx={{ display: 'flex', justifyContent: 'flex-end', mt: 0.5 }}
          >
            {isMe && (message.status === 'sent' ? '✓' : message.status === 'delivered' ? '✓✓' : '✓✓✔')}
          </Typography>
        </Box>
      </Box>
    </>
  );
};

export default MessageChat;
