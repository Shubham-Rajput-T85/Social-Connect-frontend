import { Box, Typography, Avatar, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import React, { useEffect, useRef, useState } from 'react';
import MessageChat from './MessageChat';
import MessageChatInput from './MessageChatInput';
import { IMessage, MessageService } from '../../../api/services/message.service';
import { getSocket } from '../../../socket';
import { useSelector } from 'react-redux';
import { IConversation } from '../../../api/services/conversation.service';
import { BASE_URL } from '../../../api/endpoints';

interface Props {
  conversation: IConversation;
  onBack?: () => void;
}

const MessageChatMain: React.FC<Props> = ({ conversation, onBack }) => {
  const currentUser:IMessage['sender'] = useSelector((state: any) => state.auth.user);
  console.log("currentuser:",currentUser);
  
  const [messages, setMessages] = useState<IMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const [page, setPage] = useState(1);

  // Fetch messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await MessageService.getMessages(conversation.conversationId, page, 20);
        setMessages(res.messages);
      } catch (err) {
        console.error(err);
      }
    };
    fetchMessages();
  }, [conversation, page]);

  // Socket listeners
  useEffect(() => {
    const s = getSocket();
    s.on('newMessage', (newMsg: IMessage) => {
      if (newMsg.conversationId === conversation.conversationId) {
        setMessages((prev) => [...prev, newMsg]);
      }
    });

    s.on('messageStatusUpdated', ({ messageId, status }: any) => {
      setMessages((prev) =>
        prev.map((m) => (m._id === messageId ? { ...m, status } : m))
      );
    });

    return () => {
      s.off('newMessage');
      s.off('messageStatusUpdated');
    };
  }, [conversation]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  

  const handleSend = async (text: string) => {
    try {
      const res = await MessageService.sendMessage(conversation.conversationId, { text });
      console.log("response:",res.message);
      const resMessage: IMessage = {
        _id: res.message._id,
        conversationId: res.message.conversationId,
        sender: {
          _id: res.message.sender._id,
          name: res.message.sender.name,
          username: res.message.sender.username,
          profileUrl: res.message.sender.profileUrl
        },
        text: res.message.text,
        status: res.message.status,
        createdAt: res.message.status
      };
      setMessages((prev) => [...prev, resMessage])
      console.log("messages:",messages);
    } catch (err) {
      console.error('Send failed', err);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.paper',
        borderRadius: '10px',
        height: '80vh',
        width: '100%',
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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar src={ BASE_URL + conversation.user.profileUrl } />
          <Box>
            <Typography fontWeight={600}>{ conversation.user.username }</Typography>
            <Typography fontSize={12} color="text.secondary">
              { conversation.user.online ? `Online`: `Offline` }
            </Typography>
          </Box>
        </Box>

        {onBack && (
          <IconButton sx={{ display: { xs: 'inline-flex', md: 'none' } }} onClick={onBack}>
            <ArrowBackIcon />
          </IconButton>
        )}
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
          width: '100%',
        }}
      >
        {messages.map((msg) => (
          <MessageChat key={msg._id} message={msg} />
        ))}
        <div ref={messagesEndRef} />
      </Box>

      {/* Input */}
      <MessageChatInput onSend={handleSend} />
    </Box>
  );
};

export default MessageChatMain;
