import React, { useState, useEffect } from "react";
import { 
  Typography, 
  Card, 
  CardContent, 
  CardMedia,
  Grid,
  Button,
  Divider,
  CardHeader,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Box,
  CircularProgress,
  Alert
} from "@mui/material";
import { Link, useParams, useNavigate } from "react-router-dom";

import "./styles.css";
import fetchModel from "../../lib/fetchModelData";

function UserPhotos() {
    const { userId } = useParams();
    const [user, setUser] = useState(null);
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    
    useEffect(() => {
        setLoading(true);
        
        const fetchUserDetails = fetchModel(`/api/user/${userId}`);
        
        const fetchUserPhotos = fetchModel(`/api/photosOfUser/${userId}`);
        
        Promise.all([fetchUserDetails, fetchUserPhotos])
            .then(([userData, photosData]) => {
                setUser(userData);
                if (photosData && photosData.photos) {
                    setPhotos(photosData.photos);
                } else if (Array.isArray(photosData)) {
                    setPhotos(photosData);
                } else {
                    console.warn('Unexpected photo data format:', photosData);
                    setPhotos([]);
                }
                setLoading(false);
            })
            .catch((err) => {
                setError("Failed to fetch user photos");
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

    const formatDate = (dateString) => {
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Date(dateString).toLocaleDateString(undefined, options);
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

    const handleUserClick = (commentUserId) => {
        navigate(`/users/${commentUserId}`);
    };

    return (
        <div className="user-photos-container">
            <Box className="user-photos-header">
                <Typography variant="h4" gutterBottom>
                    Ảnh của {user.first_name} {user.last_name}
                </Typography>
                
                <Button 
                    component={Link} 
                    to={`/users/${userId}`} 
                    variant="outlined" 
                    sx={{ mb: 3 }}
                >
                    Quay lại Hồ sơ
                </Button>
            </Box>

            {photos.length === 0 ? (
                <Typography variant="body1">Không tìm thấy ảnh cho người dùng này</Typography>
            ) : (
                <Grid container spacing={3}>
                    {photos.map((photo) => (
                        <Grid item xs={12} key={photo._id}>
                            <Card className="photo-card">
                                <CardHeader
                                    title={`Ảnh chụp vào ${formatDate(photo.date_time)}`}
                                />
                                <CardMedia
                                    component="img"
                                    image={`/images/${photo.file_name}`}
                                    alt={`Ảnh bởi ${user.first_name}`}
                                    className="photo-image"
                                />
                                
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Bình luận ({photo.comments ? photo.comments.length : 0})
                                    </Typography>
                                    
                                    {photo.comments && photo.comments.length > 0 ? (
                                        <List>
                                            {photo.comments.map((comment) => (
                                                <React.Fragment key={comment._id}>
                                                    <ListItem alignItems="flex-start" className="comment-item">
                                                        <ListItemAvatar>
                                                            <Avatar 
                                                                sx={{ 
                                                                    bgcolor: stringToColor(
                                                                        `${comment.user.first_name} ${comment.user.last_name}`
                                                                    ) 
                                                                }}
                                                                onClick={() => handleUserClick(comment.user._id)}
                                                                className="clickable-avatar"
                                                            >
                                                                {comment.user.first_name.charAt(0)}
                                                            </Avatar>
                                                        </ListItemAvatar>
                                                        <ListItemText
                                                            primary={
                                                                <Box component="span">
                                                                    <Typography
                                                                        component="span"
                                                                        variant="subtitle2"
                                                                        color="primary"
                                                                        className="comment-user-link"
                                                                        onClick={() => handleUserClick(comment.user._id)}
                                                                    >
                                                                        {comment.user.first_name} {comment.user.last_name}
                                                                    </Typography>
                                                                    <Typography
                                                                        component="span"
                                                                        variant="caption"
                                                                        sx={{ ml: 1 }}
                                                                    >
                                                                        {formatDate(comment.date_time)}
                                                                    </Typography>
                                                                </Box>
                                                            }
                                                            secondary={
                                                                <Typography
                                                                    variant="body2"
                                                                    color="text.primary"
                                                                    sx={{ mt: 1 }}
                                                                >
                                                                    {comment.comment}
                                                                </Typography>
                                                            }
                                                        />
                                                    </ListItem>
                                                    <Divider variant="inset" component="li" />
                                                </React.Fragment>
                                            ))}
                                        </List>
                                    ) : (
                                        <Typography variant="body2">Chưa có bình luận nào</Typography>
                                    )}
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </div>
    );
}

export default UserPhotos;

