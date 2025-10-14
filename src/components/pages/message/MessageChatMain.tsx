import { Box, Typography, Avatar, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import React, { useEffect, useRef, useState, useLayoutEffect } from 'react';
import MessageChatInput from './MessageChatInput';
import { IMessage, MessageService } from '../../../api/services/message.service';
import { getSocket } from '../../../socket';
import { useDispatch, useSelector } from 'react-redux';
import { IConversation, MessageStatus } from '../../../api/services/conversation.service';
import { BASE_URL } from '../../../api/endpoints';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, } from "@mui/material";
import SkeletonMessage from '../../ui/SkeletonMessage';
import MessageChatList from './MessageChatList';
import { alertActions } from '../../store/alert-slice';
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

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
  const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; messageId?: string }>({
    open: false,
  });

  const [newMessageCount, setNewMessageCount] = useState(0);

  const dispatch = useDispatch();

  const fetchMessages = async (pageNum: number, append = false) => {
    try {
      setLoading(true);
      const messagePerPageLimit = 20;
      const res = await MessageService.getMessages(conversation.conversationId, pageNum, messagePerPageLimit);
      if (res.messages.length < messagePerPageLimit) setHasMore(false);
      setMessages((prev) => (append ? [...res.messages, ...prev] : res.messages));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = (smooth = true) => {
    messagesContainerRef.current?.scrollTo({
      top: messagesContainerRef.current.scrollHeight,
      behavior: smooth ? "smooth" : "auto",
    });
  };

  const checkIfNearBottom = () => {
    const container = messagesContainerRef.current;
    if (!container) return false;
    const threshold = 200; // px distance from bottom
    const position = container.scrollHeight - container.scrollTop - container.clientHeight;
    return position < threshold;
  };

  useEffect(() => {
    setMessages([]);
    setPage(1);
    setHasMore(true);
    setNewMessageCount(0);

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
      setMessages((prev) => {
        const isUserNearBottom = checkIfNearBottom();
        const updated = [...prev, msg];

        // Always scroll if current user sent the message
        if (msg.sender._id === currentUser._id || isUserNearBottom) {
          requestAnimationFrame(() => scrollToBottom());
          setNewMessageCount(0);
        } else {
          // Increment unread count if not at bottom
          setNewMessageCount((c) => c + 1);
        }

        return updated;
      });

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

    socket.on("messageDeleted", ({ messageId }) => {
      setMessages((prev) =>
        prev.map((m) =>
          m._id === messageId
            ? { ...m, text: "This message was deleted", isDeleted: true }
            : m
        )
      );
    });

    return () => {
      socket.emit('leaveConversation', conversation.conversationId);
      socket.off('newMessage');
      socket.off('messageStatusUpdated');
      socket.off('messageUpdated');
      socket.off('messageDeleted');
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
    if (loading) return;
    const container = messagesContainerRef.current;
    if (!container || !scrollRestoreRef.current) return;
    const { prevHeight, prevTop } = scrollRestoreRef.current;
    const newHeight = container.scrollHeight;
    container.scrollTop = newHeight - prevHeight + prevTop;
    scrollRestoreRef.current = null;
  }, [messages]);

  const handleScroll = () => {
    const container = messagesContainerRef.current;
    if (!container || !hasMore || loading) return;
    console.log(container.scrollTop, "+", container.clientHeight, "=", container.scrollTop + container.clientHeight, ">= ", container.scrollHeight);
    if (container.scrollTop < 200) {
      scrollRestoreRef.current = { prevHeight: container.scrollHeight, prevTop: container.scrollTop };
      const nextPage = page + 1;
      setPage(nextPage);
      fetchMessages(nextPage, true);
    }
    // If user scrolls down manually, hide new message bubble
    if (checkIfNearBottom()) {
      setNewMessageCount(0);
    }
  };

  const handleSend = async (text: string) => {
    try {
      await MessageService.sendMessage(conversation.conversationId, { text });
      // Scroll unconditionally for own messages
      requestAnimationFrame(() => scrollToBottom());
    } catch (err) {
      console.error('Send failed', err);
      dispatch(
        alertActions.showAlert({
          severity: "error",
          message: "conversation doesnt exist",
        })
      );
    }
  };

  const handleEdit = (msg: IMessage) => {
    setEditingMessage({ id: msg._id, text: msg.text });
  };

  const handleDelete = (msgId: string) => {
    setDeleteConfirm({ open: true, messageId: msgId });
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirm.messageId) return;
    try {
      await MessageService.deleteMessage(deleteConfirm.messageId);
      setMessages((prev) =>
        prev.map((m) =>
          m._id === deleteConfirm.messageId
            ? { ...m, text: "This message was deleted", isDeleted: true }
            : m
        )
      );
    } catch (err) {
      console.error("Delete failed", err);
    } finally {
      setDeleteConfirm({ open: false });
    }
  };

  const handleCancelDelete = () => {
    setDeleteConfirm({ open: false });
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

  return (
    <Box
      ref={containerRef}
      sx={{
        position: "relative",
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
        {loading && page >= 1 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {Array.from({ length: 5 }).map((_, idx) => (
              <SkeletonMessage key={idx} isMe={idx % 2 === 0} />
            ))}
          </Box>
        )}

        <MessageChatList
          messages={messages}
          editingMessageId={editingMessage?.id}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <div ref={messagesEndRef} />
      </Box>

      {/* Floating New Messages Button */}
      {newMessageCount > 0 && (
        <Box
          sx={{
            position: 'absolute',
            bottom: 200, // adjust based on input height
            left: '50%',
            transform: 'translateX(-50%)',
            bgcolor: 'primary.main',
            color: 'white',
            px: 2,
            py: 0.5,
            borderRadius: '20px',
            cursor: 'pointer',
            boxShadow: 3,
            transition: 'all 0.3s ease', // inline transition
            alignItems: 'center'
          }}
          onClick={() => {
            scrollToBottom();
            setNewMessageCount(0);
          }}
        >
          <span style={{ alignItems: "center", justifyContent: "center" }}>
          {newMessageCount} New Message{newMessageCount > 1 ? 's' : ''} 
          <ArrowDownwardIcon fontSize="small" />
          </span>
        </Box>
      )}

      <MessageChatInput
        onSend={handleSend}
        onEditSave={handleEditSave}
        editingMessage={editingMessage}
        onCancelEdit={handleCancelEdit}
      />

      <Dialog
        open={deleteConfirm.open}
        onClose={handleCancelDelete}
        aria-labelledby="delete-dialog-title"
      >
        <DialogTitle id="delete-dialog-title">Delete Message?</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            Are you sure you want to delete this message? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
};

export default MessageChatMain;
