import React, { useState, useEffect } from "react";
import { 
  Typography, 
  Card, 
  CardContent, 
  Button,
  Grid,
  Divider,
  Avatar,
  Box,
  Paper,
  Chip,
  CircularProgress,
  Alert
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";

import "./styles.css";
import fetchModel from "../../lib/fetchModelData";

function UserDetail() {
    const { userId } = useParams();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    
    useEffect(() => {
        setLoading(true);
        fetchModel(`/api/user/${userId}`)
            .then((data) => {
                setUser(data);
                setLoading(false);
            })
            .catch((err) => {
                setError("Failed to fetch user details");
                setLoading(false);
                console.error(err);
            });
    }, [userId]);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" p={4}>
                <CircularProgress />
            </Box>
        );
    }
    
    if (error) {
        return (
            <Alert severity="error" sx={{ p: 2 }}>
                {error}
            </Alert>
        );
    }

    if (!user) {
        return (
            <Typography variant="h6" color="error" sx={{ p: 3 }}>
                Không tìm thấy người dùng
            </Typography>
        );
    }

    const handleViewPhotos = () => {
        navigate(`/photos/${userId}`);
    };

    const getInitials = (firstName, lastName) => {
        return `${firstName.charAt(0)}${lastName.charAt(0)}`;
    };

    const stringToColor = (string) => {
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
    };

    return (
        <div className="user-detail-container">
            <Paper elevation={0} className="user-detail-header">
                <Avatar 
                    sx={{ 
                        width: 80, 
                        height: 80, 
                        bgcolor: stringToColor(`${user.first_name} ${user.last_name}`),
                        fontSize: '2rem'
                    }}
                >
                    {getInitials(user.first_name, user.last_name)}
                </Avatar>
                <Box className="user-detail-header-info">
                    <Typography variant="h4" component="h1" gutterBottom>
                        {user.first_name} {user.last_name}
                    </Typography>
                    <Chip 
                        label={user.occupation} 
                        variant="outlined" 
                        size="small" 
                        sx={{ mr: 1 }}
                    />
                    <Chip 
                        label={user.location} 
                        variant="outlined" 
                        size="small"
                    />
                </Box>
            </Paper>
            
            <Card sx={{ mt: 3 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Giới thiệu
                    </Typography>
                    <Typography variant="body1" paragraph>
                        {user.description}
                    </Typography>
                    
                    <Divider sx={{ my: 2 }} />
                    
                    <Grid container justifyContent="flex-end">
                        <Button 
                            variant="contained" 
                            color="primary"
                            onClick={handleViewPhotos}
                        >
                            Xem Ảnh
                        </Button>
                    </Grid>
                </CardContent>
            </Card>
        </div>
    );
}

export default UserDetail;

