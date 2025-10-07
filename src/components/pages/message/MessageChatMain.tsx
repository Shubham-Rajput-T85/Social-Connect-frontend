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

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);

  // for scroll preservation
  const scrollRestoreRef = useRef<{ prevHeight: number; prevTop: number } | null>(null);

  // ✅ Format date without 3rd party libs
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";

    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // ✅ Fetch messages
  const fetchMessages = async (pageNum: number, append = false) => {
    try {
      setLoading(true);
      const res = await MessageService.getMessages(conversation.conversationId, pageNum, 20);

      if (res.messages.length < 20) {
        setHasMore(false);
      }

      if (append) {
        setMessages((prev) => [...res.messages, ...prev]);
      } else {
        setMessages(res.messages);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    setMessages([]);
    setPage(1);
    setHasMore(true);
  
    const load = async () => {
      await fetchMessages(1, false);
      // Scroll to bottom after messages loaded
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
    socket.emit("joinConversation", conversation.conversationId);

    socket.on("newMessage", (msg: IMessage) => {
      setMessages((prev) => [...prev, msg]);
      console.log("msg.sender._id:",msg.sender._id);
      console.log("currentUser._id:",currentUser._id);
      console.log(msg.sender._id !== currentUser._id);
      // Mark delivered for receiver automatically
      if (msg.sender._id !== currentUser._id) {
        MessageService.updateStatus(msg._id,{ status:MessageStatus.DELIVERED });
      }
    });

    socket.on("messageStatusUpdated", ({ messageId, status }) => {
      setMessages((prev) =>
        prev.map((m) => (m._id === messageId ? { ...m, status } : m))
      );
    });

    return () => {
      socket.emit("leaveConversation", conversation.conversationId);
      socket.off("newMessage");
      socket.off("messageStatusUpdated");
    };
  }, [conversation.conversationId]);
  

  // ✅ Restore scroll after new messages are prepended
  useLayoutEffect(() => {
    const container = messagesContainerRef.current;
    if (!container || !scrollRestoreRef.current) return;

    const { prevHeight, prevTop } = scrollRestoreRef.current;
    const newHeight = container.scrollHeight;

    // restore scroll position
    container.scrollTop = newHeight - prevHeight + prevTop;

    // clear restore data
    scrollRestoreRef.current = null;
  }, [messages]);

  // ✅ Infinite scroll with scroll preservation
  const handleScroll = async () => {
    const container = messagesContainerRef.current;
    if (!container || !hasMore || loading) return;

    if (container.scrollTop === 0) {
      // store current scroll before loading
      scrollRestoreRef.current = {
        prevHeight: container.scrollHeight,
        prevTop: container.scrollTop,
      };

      const nextPage = page + 1;
      setPage(nextPage);
      await fetchMessages(nextPage, true);
    }
  };

  // ✅ Handle Send Message
  const handleSend = async (text: string) => {
    try {
      const res = await MessageService.sendMessage(conversation.conversationId, { text });
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
        createdAt: res.message.createdAt
      };
      // setMessages((prev) => [...prev, resMessage]);
    } catch (err) {
      console.error('Send failed', err);
    }
  };

  // ✅ Render messages grouped by date
  const renderMessagesWithDates = () => {
    const grouped: { [date: string]: IMessage[] } = {};

    messages.forEach((msg) => {
      const dateKey = new Date(msg.createdAt).toDateString();
      if (!grouped[dateKey]) grouped[dateKey] = [];
      grouped[dateKey].push(msg);
    });

    return Object.keys(grouped).map((dateKey) => (
      <React.Fragment key={dateKey}>
        {/* Date Divider */}
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 1 }}>
          <Typography
            variant="caption"
            sx={{
              bgcolor: "#eee",
              px: 2,
              py: 0.5,
              borderRadius: 2,
              fontWeight: 500,
            }}
          >
            {formatDate(dateKey)}
          </Typography>
        </Box>
        {grouped[dateKey].map((msg) => (
          <MessageChat key={msg._id} message={msg} />
        ))}
      </React.Fragment>
    ));
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

      {/* Messages */}
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
          maxWidth:"85vh"
        }}
      >
        {loading && page > 1 && (
          <Box sx={{ textAlign: 'center', my: 1 }}>
            <Typography variant="caption" color="text.secondary">Loading...</Typography>
          </Box>
        )}
        {renderMessagesWithDates()}
        <div ref={messagesEndRef} />
      </Box>

      {/* Input */}
      <MessageChatInput onSend={handleSend} />
    </Box>
  );
};

export default MessageChatMain;
