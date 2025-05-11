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
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import "./styles.css";
import fetchModel from "../../lib/fetchModelData";

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    setLoading(true);
    fetchModel("/api/user/list")
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch users");
        setLoading(false);
        console.error(err);
      });
  }, []);
  
  const handleUserClick = (userId) => {
    navigate(`/users/${userId}`);
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
            <ListItem disablePadding>
              <ListItemButton onClick={() => handleUserClick(user._id)}>
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

