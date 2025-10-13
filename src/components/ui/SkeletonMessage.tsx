import { Box, Skeleton } from '@mui/material';
import React from 'react';

interface Props {
  isMe?: boolean; // left or right alignment
}

const SkeletonMessage: React.FC<Props> = ({ isMe = false }) => {
  // Random width to simulate real message bubble
  const bubbleWidth = Math.floor(Math.random() * 200) + 100;

  return (
    <Box sx={{ mb: 1 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: isMe ? 'flex-end' : 'flex-start',
        }}
      >
        <Box
          sx={{
            position: 'relative',
            p: 1.5,
            borderRadius: '10px',
            borderTopRightRadius: isMe ? '0px' : '10px',
            borderTopLeftRadius: isMe ? '10px' : '0px',
            bgcolor: isMe ? 'primary.light' : 'grey.300',
            color: isMe ? 'white' : 'text.primary',
            maxWidth: '80%',
            display: 'inline-block',
            wordBreak: 'break-word',
          }}
        >
          <Skeleton
            variant="rounded"
            width={bubbleWidth}
            height={20}
            sx={{ borderRadius: 2 }}
          />
          <Box sx={{ mt: 0.5, display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start', gap: 0.5 }}>
            <Skeleton variant="circular" width={12} height={12} />
            <Skeleton variant="text" width={30} height={12} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default SkeletonMessage;
