import { Box, Paper, Skeleton, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import PersonIcon from "@mui/icons-material/Person";
import MessageIcon from "@mui/icons-material/Message";

const SkeletonSidebar = () => {
  const placeholderLinks = [
    { icon: <HomeIcon /> },
    { icon: <PersonIcon /> },
    { icon: <MessageIcon /> },
  ];

  return (
    <Box>
      <Paper sx={{ padding: 2, mb: 2 }}>
        <Box sx={{ textAlign: "center" }}>
          {/* Avatar */}
          <Skeleton
            variant="circular"
            width={80}
            height={80}
            sx={{ margin: "auto" }}
          />

          {/* Name */}
          <Skeleton
            variant="text"
            width={100}
            height={25}
            sx={{ margin: "16px auto 8px auto" }}
          />

          {/* Bio */}
          <Skeleton
            variant="text"
            width={140}
            height={20}
            sx={{ margin: "0 auto 16px auto" }}
          />
        </Box>

        {/* Navigation Links */}
        <List>
          {placeholderLinks.map((item, index) => (
            <ListItem key={index} disablePadding>
              <ListItemButton sx={{ opacity: 0.6 }}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText>
                  <Skeleton variant="text" width={100} height={20} />
                </ListItemText>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default SkeletonSidebar;
