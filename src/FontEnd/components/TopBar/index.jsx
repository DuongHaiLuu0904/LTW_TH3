import React, { useState, useEffect } from "react";
import { AppBar, Toolbar, Typography, Button, Box, CircularProgress } from "@mui/material";
import { Link, useLocation } from "react-router-dom";

import fetchModel from "../../lib/fetchModelData";

import "./styles.css";

function TopBar() {
    const location = useLocation();
    const [contextInfo, setContextInfo] = useState("");
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {
        const pathParts = location.pathname.split('/');
        
        if (pathParts.length >= 3) {
            const userId = pathParts[2];
            
            if (userId) {
                setLoading(true);
                fetchModel(`/api/user/${userId}`)
                    .then((user) => {
                        if (user) {
                            if (pathParts[1] === 'users') {
                                setContextInfo(`Chi tiết của ${user.first_name} ${user.last_name}`);
                            } else if (pathParts[1] === 'photos') {
                                setContextInfo(`Ảnh của ${user.first_name} ${user.last_name}`);
                            }
                        }
                        setLoading(false);
                    })
                    .catch(error => {
                        console.error("Error fetching user:", error);
                        setContextInfo("");
                        setLoading(false);
                    });
            }
        } else if (location.pathname === '/users') {
            setContextInfo("Danh sách người dùng");
        } else {
            setContextInfo("");
        }
    }, [location]);
    
    return (
      <AppBar className="topbar-appBar" position="fixed">
        <Toolbar>
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ mr: 2, fontWeight: 'bold' }}
          >
            📷
          </Typography>
          
          <Typography 
            variant="h5" 
            color="inherit" 
            component="div"
            sx={{ flexGrow: 1 }}
          >
            Ứng dụng Chia sẻ Ảnh
          </Typography>
          
          {loading ? (
            <Box display="flex" alignItems="center" mr={2}>
              <CircularProgress size={20} color="inherit" />
            </Box>
          ) : contextInfo && (
            <Typography 
              variant="subtitle1" 
              color="inherit" 
              component="div"
              sx={{ mr: 2 }}
            >
              {contextInfo}
            </Typography>
          )}
          
          <Box>
            <Button 
              color="inherit" 
              component={Link} 
              to="/users"
            >
              Người dùng
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
    );
}

export default TopBar;

