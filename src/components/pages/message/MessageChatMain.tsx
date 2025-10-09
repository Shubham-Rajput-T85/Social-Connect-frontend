import { Box, Typography, Avatar, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import React, { useEffect, useRef, useState, useLayoutEffect } from 'react';
import MessageChat from './MessageChat';
import MessageChatInput from './MessageChatInput';
import { IMessage, MessageService } from '../../../api/services/message.service';
import { getSocket } from '../../../socket';
import { useSelector } from 'react-redux';
import { IConversation, MessageStatus } from '../../../api/services/conversation.service';
import { BASE_URL } from '../../../api/endpoints';

interface Props {
  conversation: IConversation;
  onBack?: () => void;
}

const MessageChatMain: React.FC<Props> = ({ conversation, onBack }) => {
  const currentUser = useSelector((state: any) => state.auth.user);
  const onlineUsers = useSelector((state: any) => state.onlineUsers.users);
  const isUserOnline = onlineUsers.includes(conversation.user._id);

  const [messages, setMessages] = useState<IMessage[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [editingMessage, setEditingMessage] = useState<{ id: string; text: string } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const scrollRestoreRef = useRef<{ prevHeight: number; prevTop: number } | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);


  const fetchMessages = async (pageNum: number, append = false) => {
    try {
      setLoading(true);
      const res = await MessageService.getMessages(conversation.conversationId, pageNum, 20);
      if (res.messages.length < 20) setHasMore(false);
      setMessages((prev) => (append ? [...res.messages, ...prev] : res.messages));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMessages([]);
    setPage(1);
    setHasMore(true);

    const load = async () => {
      await fetchMessages(1, false);
      requestAnimationFrame(() => {
        messagesContainerRef.current?.scrollTo({
          top: messagesContainerRef.current.scrollHeight,
          behavior: 'auto',
        });
      });
    };
    load();
  }, [conversation]);

  useEffect(() => {
    const socket = getSocket();
    socket.emit('joinConversation', conversation.conversationId);

    socket.on('newMessage', (msg: IMessage) => {
      setMessages((prev) => [...prev, msg]);
      if (msg.sender._id !== currentUser._id) {
        MessageService.updateStatus(msg._id, { status: MessageStatus.SEEN });
      }
    });

    socket.on('messageUpdated', (updatedMessage: IMessage) => {
      setMessages((prev) =>
        prev.map((m) => (m._id === updatedMessage._id ? { ...m, ...updatedMessage } : m))
      );
      if (updatedMessage.sender._id !== currentUser._id) {
        MessageService.updateStatus(updatedMessage._id, { status: MessageStatus.SEEN });
      }
    });

    socket.on('messageStatusUpdated', ({ messageId, status }) => {
      setMessages((prev) => prev.map((m) => (m._id === messageId ? { ...m, status } : m)));
    });

    return () => {
      socket.emit('leaveConversation', conversation.conversationId);
      socket.off('newMessage');
      socket.off('messageStatusUpdated');
      socket.off('messageUpdated');
    };
  }, [conversation.conversationId]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        editingMessage &&
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setEditingMessage(null);
      }
    };
  
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [editingMessage]);

  useLayoutEffect(() => {
    const container = messagesContainerRef.current;
    if (!container || !scrollRestoreRef.current) return;
    const { prevHeight, prevTop } = scrollRestoreRef.current;
    const newHeight = container.scrollHeight;
    container.scrollTop = newHeight - prevHeight + prevTop;
    scrollRestoreRef.current = null;
  }, [messages]);

  const handleScroll = async () => {
    const container = messagesContainerRef.current;
    if (!container || !hasMore || loading) return;
    if (container.scrollTop < 200) {
      scrollRestoreRef.current = { prevHeight: container.scrollHeight, prevTop: container.scrollTop };
      const nextPage = page + 1;
      setPage(nextPage);
      await fetchMessages(nextPage, true);
    }
  };

  const handleSend = async (text: string) => {
    try {
      await MessageService.sendMessage(conversation.conversationId, { text });
    } catch (err) {
      console.error('Send failed', err);
    }
  };

  const handleEdit = (msg: IMessage) => {
    setEditingMessage({ id: msg._id, text: msg.text });
  };

  const handleDelete = (msgId: string) => {
    setMessages((prev) => prev.filter((m) => m._id !== msgId));
  };

  const handleEditSave = async (msgId: string, newText: string) => {
    try {
      const res = await MessageService.editMessage(msgId, { text: newText });
      setMessages((prev) => prev.map((m) => (m._id === msgId ? { ...m, text: res.message.text } : m)));
      setEditingMessage(null);
    } catch (err) {
      console.error('Edit failed', err);
    }
  };

  const handleCancelEdit = () => {
    setEditingMessage(null);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return date.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const renderMessagesWithDates = () => {
    const grouped: { [date: string]: IMessage[] } = {};
    messages.forEach((msg) => {
      const dateKey = new Date(msg.createdAt).toDateString();
      if (!grouped[dateKey]) grouped[dateKey] = [];
      grouped[dateKey].push(msg);
    });

    return Object.keys(grouped).map((dateKey) => (
      <React.Fragment key={dateKey}>
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 1 }}>
          <Typography
            variant="caption"
            sx={{ bgcolor: '#eee', px: 2, py: 0.5, borderRadius: 2, fontWeight: 500 }}
          >
            {formatDate(dateKey)}
          </Typography>
        </Box>
        {grouped[dateKey].map((msg) => (
          <MessageChat
            key={msg._id}
            message={msg}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isDimmed={!!editingMessage && editingMessage.id !== msg._id}
          />
        ))}
      </React.Fragment>
    ));
  };

  return (
    <Box
      ref={containerRef}
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
          <Avatar src={BASE_URL + conversation.user.profileUrl} />
          <Box>
            <Typography fontWeight={600}>{conversation.user.username}</Typography>
            <Typography fontSize={12} color="text.secondary">
              {isUserOnline ? `Online` : `Offline`}
            </Typography>
          </Box>
        </Box>
        {onBack && (
          <IconButton sx={{ display: { xs: 'inline-flex', md: 'none' } }} onClick={onBack}>
            <ArrowBackIcon />
          </IconButton>
        )}
      </Box>

      <Box
        ref={messagesContainerRef}
        onScroll={handleScroll}
        sx={{
          flex: 1,
          overflowY: 'auto',
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          maxWidth: '85vh',
        }}
      >
        {loading && page > 1 && (
          <Box sx={{ textAlign: 'center', my: 1 }}>
            <Typography variant="caption" color="text.secondary">
              Loading...
            </Typography>
          </Box>
        )}
        {renderMessagesWithDates()}
        <div ref={messagesEndRef} />
      </Box>

      <MessageChatInput
        onSend={handleSend}
        onEditSave={handleEditSave}
        editingMessage={editingMessage}
        onCancelEdit={handleCancelEdit}
      />
    </Box>
  );
};

export default MessageChatMain;
