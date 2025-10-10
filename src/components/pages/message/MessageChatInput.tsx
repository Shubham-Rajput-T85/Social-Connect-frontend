import { Box, TextField, IconButton, Button } from '@mui/material';
import React, { useState, useEffect } from 'react';
import SendIcon from '@mui/icons-material/Send';
import CancelIcon from '@mui/icons-material/Cancel';

interface Props {
  onSend: (msg: string) => void;
  onEditSave: (msgId: string, newText: string) => void;
  editingMessage: { id: string; text: string } | null;
  onCancelEdit: () => void;
}

const MessageChatInput: React.FC<Props> = ({ onSend, onEditSave, editingMessage, onCancelEdit }) => {
  const [text, setText] = useState('');

  useEffect(() => {
    if (editingMessage) setText(editingMessage.text);
    else setText('');
  }, [editingMessage]);

  const handleSend = () => {
    if (!text.trim()) return;

    if (editingMessage) {
      onEditSave(editingMessage.id, text.trim());
    } else {
      onSend(text.trim());
    }
    setText('');
  };

  return (
    <Box sx={{ p: 2, display: 'flex', gap: 1, borderTop: '1px solid #ddd' }}>
      <TextField
        fullWidth
        placeholder={editingMessage ? 'Edit message...' : 'Type a message'}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
      />
      <IconButton color="primary" disabled={!text.trim()} onClick={handleSend}>
        <SendIcon />
      </IconButton>
      {editingMessage && (
      <IconButton color="error" onClick={onCancelEdit}>
        <CancelIcon />
      </IconButton>
      )}
    </Box>
  );
};

export default MessageChatInput;
