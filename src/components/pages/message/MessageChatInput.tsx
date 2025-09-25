import { Box, TextField, IconButton } from '@mui/material';
import React, { useState } from 'react';
import SendIcon from '@mui/icons-material/Send';

interface Props {
  onSend: (msg: any) => void;
}

const MessageChatInput: React.FC<Props> = ({ onSend }) => {
  const [text, setText] = useState('');

  const handleSend = () => {
    if (!text.trim()) return;
    const msg = {
      id: Date.now().toString(),
      text,
      sender: 'me',
      timestamp: new Date().toISOString(),
      status: 'sent',
    };
    onSend(msg);
    setText('');
  };

  return (
    <Box sx={{ p: 2, display: 'flex', gap: 1, borderTop: '1px solid #ddd' }}>
      <TextField
        fullWidth
        placeholder="Type a message"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
      />
      <IconButton color="primary" disabled={!text.trim()} onClick={handleSend}>
        <SendIcon />
      </IconButton>
    </Box>
  );
};

export default MessageChatInput;
