import React from "react";
import { Typography } from "@mui/material";

const NavbarLogo: React.FC = () => (
  <Typography
    variant="h6"
    sx={{
      color: (theme) => theme.palette.primary.main,
      fontWeight: 'bold',
      fontSize: '1.5rem',
      marginRight: "10px",
    }}
  >
    SocialConnect
  </Typography>
);

export default NavbarLogo;
