import { Box } from '@mui/material';
import React from 'react';
import Sidebar from './Sidebar';
import FooterNav from '../footer/FooterNav';

const Page: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", sm: "1fr 5fr" },
        gap: 2,
        padding: 2,
        paddingBottom: { xs: 7, sm: 0 }, // add space for footer on mobile
        height: "100%",
      }}
    >
      {/* Sidebar only on sm and above */}
      <Box
        sx={{
          display: { xs: "none", sm: "block" },
        }}
      >
        <Sidebar />
      </Box>

      {/* Main Content */}
      <Box>
        {children}
      </Box>

      {/* Footer only on mobile */}
      <FooterNav />
    </Box>
  );
};

export default Page;
