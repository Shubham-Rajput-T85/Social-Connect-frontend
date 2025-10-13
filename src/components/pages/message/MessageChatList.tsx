import React, { useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import { IMessage } from '../../../api/services/message.service';
import MessageChat from './MessageChat';
import { formatDate } from '../../../api/constants/constants';

interface Props {
  messages: IMessage[];
  editingMessageId?: string | null;
  onEdit: (msg: IMessage) => void;
  onDelete: (msgId: string) => void;
}

const MessageChatList: React.FC<Props> = ({ messages, editingMessageId, onEdit, onDelete }) => {

  // Group messages by date
  const groupedMessages = useMemo(() => {
    const grouped: { [date: string]: IMessage[] } = {};
    messages.forEach((msg) => {
      const dateKey = new Date(msg.createdAt).toDateString();
      if (!grouped[dateKey]) grouped[dateKey] = [];
      grouped[dateKey].push(msg);
    });
    return grouped;
  }, [messages]);

  return (
    <>
      {Object.keys(groupedMessages).map((dateKey) => (
        <React.Fragment key={dateKey}>
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 1 }}>
            <Typography
              variant="caption"
              sx={{ bgcolor: '#eee', px: 2, py: 0.5, borderRadius: 2, fontWeight: 500 }}
            >
              {formatDate(dateKey)}
            </Typography>
          </Box>
          {groupedMessages[dateKey].map((msg) => (
            <MessageChat
              key={msg._id}
              message={msg}
              onEdit={onEdit}
              onDelete={onDelete}
              isDimmed={!!editingMessageId && editingMessageId !== msg._id}
            />
          ))}
        </React.Fragment>
      ))}
    </>
  );
};

export default MessageChatList;
