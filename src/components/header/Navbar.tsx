// import * as React from 'react';
// import {
//   AppBar,
//   Box,
//   Toolbar,
//   Typography,
//   Button,
//   IconButton,
//   Badge,
//   Menu,
//   MenuItem,
//   Modal,
//   InputBase,
// } from '@mui/material';

// import { styled } from '@mui/material/styles';
// import { useSelector, useDispatch } from 'react-redux';

// import MenuIcon from '@mui/icons-material/Menu';
// import LogoutIcon from '@mui/icons-material/Logout';
// import NotificationsIcon from '@mui/icons-material/Notifications';
// import SearchIcon from '@mui/icons-material/Search';
// import AccountCircle from '@mui/icons-material/AccountCircle';

// import { authActions } from "../store/auth-slice";
// import { alertActions } from '../store/alert-slice';

// // Styled search container
// const SearchContainer = styled('div')(({ theme }) => ({
//   position: 'relative',
//   borderRadius: theme.shape.borderRadius,
//   backgroundColor: '#f1f3f5',
//   '&:hover': {
//     backgroundColor: '#e9ecef',
//   },
//   width: '100%',
//   maxWidth: 400,
// }));

// const SearchIconWrapper = styled('div')(({ theme }) => ({
//   padding: theme.spacing(0, 2),
//   height: '100%',
//   position: 'absolute',
//   pointerEvents: 'none',
//   display: 'flex',
//   alignItems: 'center',
//   justifyContent: 'center',
//   color: theme.palette.text.secondary,
// }));

// const StyledInputBase = styled(InputBase)(({ theme }) => ({
//   color: 'inherit',
//   width: '100%',
//   paddingLeft: `calc(1em + ${theme.spacing(4)})`,
// }));

// export default function Navbar() {
//   const user = useSelector((state: any) => state.auth.user);
//   const dispatch = useDispatch();

//   const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
//   const [searchModalOpen, setSearchModalOpen] = React.useState(false);

//   const logoutHandler = async () => {
//     const response = await fetch("http://localhost:8080/auth/logout", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       credentials: "include",
//     });

//     if (!response.ok) {
//       let errorMessage = "Something went wrong";

//       try {
//         const errorData = await response.json();
      
//         if (errorData.errors && Array.isArray(errorData.errors)) {
//           errorMessage = errorData.errors
//             .map((err: any) => `${err.field}: ${err.message}`)
//             .join(" | ");
//         } else if (errorData.message) {
//           errorMessage = errorData.message;
//         }
//       } catch (e) {
//         errorMessage = "Server returned an unexpected error";
//       }

//       dispatch(
//         alertActions.showAlert({ severity: "error", message: errorMessage })
//       );
//       return;
//     }
//     dispatch(authActions.logout());
//   };

//   // Menu toggle for md and below
//   const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
//     setAnchorEl(event.currentTarget);
//   };
//   const handleMenuClose = () => {
//     setAnchorEl(null);
//   };

//   return (
//     <Box sx={{ flexGrow: 1 }}>
//       <AppBar
//         position="static"
//         sx={{
//           backgroundColor: '#FFFFFF',
//           color: 'text.primary',
//           boxShadow: (theme) => theme.shadows[2],
//         }}
//       >
//         <Toolbar sx={{ justifyContent: 'space-between' }}>
//           {/* Logo */}
//           <Typography
//             variant="h6"
//             sx={{
//               color: (theme) => theme.palette.primary.main,
//               fontWeight: 'bold',
//               fontSize: '1.5rem',
//               marginRight: "10px"
//             }}
//           >
//             SocialConnect
//           </Typography>

//           {/* Center Search Bar - only visible at sm and above */}
//           <Box
//             sx={{
//               flexGrow: 1,
//               display: { xs: 'none', sm: 'flex' },
//               justifyContent: 'center',
//             }}
//           >
//             <SearchContainer>
//               <SearchIconWrapper>
//                 <SearchIcon />
//               </SearchIconWrapper>
//               <StyledInputBase placeholder="Search…" inputProps={{ 'aria-label': 'search' }} />
//             </SearchContainer>
//           </Box>

//           {/* Right Section */}
//           {user && (
//             <Box
//               sx={{
//                 display: 'flex',
//                 alignItems: 'center',
//                 gap: 2,
//                 flexShrink: 0,
//               }}
//             >
//               {/* BELOW 600px (xs) -> Show 3 icons: Search, Notifications, Menu */}
//               <Box sx={{ display: { xs: 'flex', sm: 'none' }, gap: 1 }}>
//                 {/* Search Icon (opens modal) */}
//                 <IconButton onClick={() => setSearchModalOpen(true)}>
//                   <SearchIcon />
//                 </IconButton>

//                 {/* Notifications Icon */}
//                 <IconButton color="primary" aria-label="notifications">
//                   <Badge badgeContent={3} color="error">
//                     <NotificationsIcon />
//                   </Badge>
//                 </IconButton>

//                 {/* Menu Icon */}
//                 <IconButton onClick={handleMenuOpen}>
//                   <MenuIcon />
//                 </IconButton>
//               </Box>

//               {/* FROM sm TO md (>=600 && <=768): Menu icon only, no search bar */}
//               <Box sx={{ display: { xs: 'none', sm: 'flex', md: 'none', lg: 'none' } }}>
//                 {/* Notifications Icon */}
//                 <IconButton color="primary" aria-label="notifications">
//                   <Badge badgeContent={3} color="error">
//                     <NotificationsIcon />
//                   </Badge>
//                 </IconButton>
//                 <IconButton onClick={handleMenuOpen}>
//                   <MenuIcon />
//                 </IconButton>
//               </Box>

//               {/* ABOVE md (>768): Logout + Profile buttons, NO menu */}
//               <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1.5 }}>
//                 {/* Notifications Icon */}
//                 <IconButton color="primary" aria-label="notifications">
//                   <Badge badgeContent={3} color="error">
//                     <NotificationsIcon />
//                   </Badge>
//                 </IconButton>
//                 <Button
//                   variant="contained"
//                   color="primary"
//                   startIcon={<LogoutIcon />}
//                   onClick={logoutHandler}
//                   sx={{ borderRadius: '8px', textTransform: 'none' }}
//                 >
//                   Logout
//                 </Button>
//                 <IconButton sx={{ color: 'primary.main' }}>
//                   <AccountCircle fontSize="large" />
//                 </IconButton>
//               </Box>
//             </Box>
//           )}
//         </Toolbar>
//       </AppBar>

//       {/* Search Modal */}
//       <Modal open={searchModalOpen} onClose={() => setSearchModalOpen(false)}>
//         <Box
//           sx={{
//             position: 'absolute',
//             top: '20%',
//             left: '50%',
//             transform: 'translate(-50%, -20%)',
//             width: '80%',
//             bgcolor: 'background.paper',
//             boxShadow: 24,
//             p: 2,
//             borderRadius: 2,
//           }}
//         >
//           <SearchContainer>
//             <SearchIconWrapper>
//               <SearchIcon />
//             </SearchIconWrapper>
//             <StyledInputBase
//               autoFocus
//               placeholder="Search…"
//               inputProps={{ 'aria-label': 'search' }}
//             />
//           </SearchContainer>
//         </Box>
//       </Modal>

//       {/* Menu for Logout + Profile */}
//       <Menu
//         anchorEl={anchorEl}
//         open={Boolean(anchorEl)}
//         onClose={handleMenuClose}
//       >
//         <MenuItem>
//           <AccountCircle sx={{ mr: 1 }} /> Profile
//         </MenuItem>
//         <MenuItem onClick={logoutHandler}>
//           <LogoutIcon sx={{ mr: 1 }} /> Logout
//         </MenuItem>

//       </Menu>
//     </Box>
//   );
// }



/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



import React, { useState } from "react";
import { AppBar, Toolbar, Box, IconButton } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import NavbarLogo from "./NavbarLogo";
import NavbarSearch from "./NavbarSearch";
import NavbarActions from "./NavbarActions";

const Navbar: React.FC = () => {
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  return (
    <AppBar position="static" sx={{ backgroundColor: '#fff', color: 'text.primary', boxShadow: 2 }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <NavbarLogo />

        {/* Desktop Search */}
        <Box sx={{ flexGrow: 1, display: { xs: 'none', sm: 'flex' }, justifyContent: 'center' }}>
          <NavbarSearch onClose={function (): void {
          } } />
        </Box>

        {/* Mobile Icons */}
        <Box sx={{ display: { xs: 'flex', sm: 'none' }, gap: 1 }}>
          <IconButton onClick={() => setSearchModalOpen(true)}>
            <MenuIcon />
          </IconButton>
        </Box>

        {/* Actions */}
        <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
          <NavbarActions />
        </Box>
      </Toolbar>

      {/* Mobile Search */}
      <NavbarSearch onClose={function (): void { }} isMobile={true} openModal={searchModalOpen} onCloseModal={() => setSearchModalOpen(false)} />
    </AppBar>
  );
}

export default Navbar;
