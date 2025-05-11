import './App.css';

import React from "react";
import { Grid, Paper, Container, Box, Typography } from "@mui/material";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";

import TopBar from "./components/TopBar";
import UserDetail from "./components/UserDetail";
import UserList from "./components/UserList";
import UserPhotos from "./components/UserPhotos";

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <TopBar />
        <Container maxWidth="xl" className="main-container">
          <Box className="main-topbar-buffer" />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={3}>
              <Paper className="main-grid-item">
                <UserList />
              </Paper>
            </Grid>
            
            <Grid item xs={12} sm={9}>
              <Paper className="main-grid-item">
                <Routes>
                  <Route path="/users/:userId" element={<UserDetail />} />
                  
                  <Route path="/photos/:userId" element={<UserPhotos />} />
                  
                  <Route path="/users" element={
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                      <Typography variant="h5" sx={{ p: 3, textAlign: 'center' }}>
                        Chào mừng đến với Ứng dụng Chia sẻ Ảnh!<br />
                        Chọn một người dùng từ danh sách để xem chi tiết.
                      </Typography>
                    </Box>
                  } />
                  
                  <Route path="/" element={<Navigate replace to="/users" />} />
                  
                  <Route path="*" element={
                    <Typography variant="h5" sx={{ p: 3, color: 'error.main' }}>
                      Không tìm thấy trang
                    </Typography>
                  } />
                </Routes>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </div>
    </Router>
  );
}

export default App;

