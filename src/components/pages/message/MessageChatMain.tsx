import { Avatar, Box, IconButton, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import React, { useEffect, useRef, useState } from 'react';
import MessageChat from './MessageChat';
import MessageChatInput from './MessageChatInput';

interface Message {
  id: string;
  text: string;
  sender: 'me' | 'them';
  timestamp: string;
  status: 'sent' | 'delivered' | 'seen';
}

interface Props {
  userId: string;
  onBack: () => void;
}

const dummyMessage = `Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.

Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.

Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.

Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.

Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.`;

const dummyMessages: Message[] = Array.from({ length: 20 }).map((_, i) => ({
  id: `${i}`,
  text: `This is message
   ${dummyMessage} 
   ${i + 1}`,
  sender: i % 2 === 0 ? 'me' : 'them',
  timestamp: new Date(Date.now() - i * 1000 * 60 * 60 * 4).toISOString(),
  status: 'seen',
}));

const MessageChatMain: React.FC<Props> = ({ userId, onBack }) => {
  const [messages, setMessages] = useState<Message[]>(dummyMessages);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
  }, [messages]);

  const isSameDay = (d1: Date, d2: Date) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (isSameDay(date, today)) return 'Today';
    if (isSameDay(date, yesterday)) return 'Yesterday';

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.paper',
        borderRadius: '10px',
        height: '80vh',
        width: "100%",
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          borderBottom: '1px solid #ddd',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Left: User Info */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar src="/avatar2.jpg" />
          <Box>
            <Typography fontWeight={600}>User Name</Typography>
            <Typography fontSize={12} color="text.secondary">
              Online
            </Typography>
          </Box>
        </Box>

        {/* Right: Back Button (Mobile Only) */}
        <IconButton
          onClick={onBack}
          sx={{ display: { xs: 'inline-flex', md: 'none' } }}
        >
          <ArrowBackIcon />
        </IconButton>
      </Box>

      {/* Messages */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          width:"100%"
        }}
      >
        {messages.map((msg, index) => {
          const msgDate = new Date(msg.timestamp);
          const showDateSeparator =
            index === 0 ||
            !isSameDay(new Date(messages[index - 1].timestamp), msgDate);

          return (
            <React.Fragment key={msg.id}>
              {showDateSeparator && (
                <Typography
                  variant="caption"
                  sx={{
                    textAlign: 'center',
                    color: 'text.secondary',
                    my: 1,
                    fontSize: '0.75rem',
                    fontWeight: 500,
                  }}
                >
                  {formatDate(msgDate)}
                </Typography>
              )}
              <MessageChat message={msg} />
            </React.Fragment>
          );
        })}
        <div ref={messagesEndRef} />
      </Box>

      {/* Input */}
      <MessageChatInput onSend={(msg) => setMessages([...messages, msg])} />
    </Box>
  );
};

export default MessageChatMain;
