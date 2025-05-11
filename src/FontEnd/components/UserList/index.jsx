import React, { useState, useEffect } from "react";
import {
  Divider,
  List,
  ListItem,
  ListItemText,
  Typography,
  ListItemButton,
  Avatar,
  Box,
  CircularProgress,
  Chip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import PhotoIcon from '@mui/icons-material/Photo';
import CommentIcon from '@mui/icons-material/Comment';

import "./styles.css";
import fetchModel from "../../lib/fetchModelData";

function UserList() {
  const [users, setUsers] = useState([]);
  const [userStats, setUserStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    setLoading(true);
    
    // Fetch both user list and user statistics
    Promise.all([
      fetchModel("/api/user/list"),
      fetchModel("/api/stats/user-stats")
    ])
      .then(([userData, statsData]) => {
        setUsers(userData);
        setUserStats(statsData);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch users or stats");
        setLoading(false);
        console.error(err);
      });
  }, []);
  
  const handleUserClick = (userId) => {
    navigate(`/users/${userId}`);
  };
  
  const handleCommentClick = (userId, event) => {
    // Prevent the event from bubbling up to the parent ListItemButton
    event.stopPropagation();
    navigate(`/comments/${userId}`);
  };
  
  return (
    <div className="user-list-container">
      <Typography variant="h6" sx={{ p: 2 }}>
        Người dùng
      </Typography>
      <Divider />
      
      {loading ? (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Box p={2}>
          <Typography color="error">{error}</Typography>
        </Box>
      ) : (
        <List component="nav">
          {users.map((user) => (
          <React.Fragment key={user._id}>
            <ListItem disablePadding>              <ListItemButton onClick={() => handleUserClick(user._id)}>
                <Avatar 
                  sx={{ 
                    bgcolor: stringToColor(`${user.first_name} ${user.last_name}`),
                    mr: 2
                  }}
                >
                  {user.first_name.charAt(0)}
                </Avatar>
                <ListItemText 
                  primary={`${user.first_name} ${user.last_name}`} 
                  secondary={
                    <Box component="span" sx={{ display: 'block' }}>
                      <Typography variant="body2" component="span">
                        {user.occupation}
                      </Typography>
                      <Typography variant="caption" component="span" sx={{ display: 'block' }}>
                        {user.location}
                      </Typography>
                    </Box>
                  }
                />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {/* Photo count */}
                  <Chip
                    icon={<PhotoIcon />}
                    label={userStats[user._id]?.photoCount || 0}
                    size="small"
                    color="success"
                    sx={{ minWidth: '60px' }}
                  />
                  
                  {/* Comment count */}
                  <Chip
                    icon={<CommentIcon />}
                    label={userStats[user._id]?.commentCount || 0}
                    size="small"
                    color="error"
                    onClick={(e) => handleCommentClick(user._id, e)}
                    sx={{ minWidth: '60px', cursor: 'pointer' }}
                  />
                </Box>
              </ListItemButton>
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
      )}
    </div>
  );
}

function stringToColor(string) {
  let hash = 0;
  for (let i = 0; i < string.length; i++) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  return color;
}

export default UserList;

