import React, { useState, useEffect } from "react";
import {
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  Box,
  CircularProgress,
  Alert,
  List,
} from "@mui/material";
import { Link, useParams, useNavigate } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import "./styles.css";
import fetchModel from "../../lib/fetchModelData";

function UserComments() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);

    // Fetch both user details and their comments
    Promise.all([
      fetchModel(`/api/user/${userId}`),
      fetchModel(`/api/stats/user-comments/${userId}`)
    ])
      .then(([userData, commentsData]) => {
        setUser(userData);
        
        // Add photo owner user ID for proper navigation
        if (Array.isArray(commentsData)) {
          const enrichedComments = commentsData.map(comment => ({
            ...comment,
            photo_owner_id: comment.user_id // This might need adjustment based on actual data structure
          }));
          setComments(enrichedComments);
        } else {
          setComments([]);
        }
        
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch user comments");
        setLoading(false);
        console.error(err);
      });
  }, [userId]);
  const handlePhotoClick = (photo) => {
    // Navigate to the photo's user's photos page, which will display all photos including this one
    navigate(`/photos/${photo.user_id}`);
  };

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

  return (
    <div className="user-comments-container">
      <Box className="user-comments-header">
        <Typography variant="h4" gutterBottom>
          Bình luận của {user.first_name} {user.last_name}
        </Typography>

        <Button
          component={Link}
          to={`/users/${userId}`}
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          sx={{ mb: 3 }}
        >
          Quay lại Hồ sơ
        </Button>
      </Box>      {comments.length === 0 ? (
        <Typography variant="body1">Không tìm thấy bình luận cho người dùng này</Typography>
      ) : (
        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
          {comments.map((comment) => (
            <React.Fragment key={comment.comment_id}>              <Card 
                sx={{ 
                  mb: 2, 
                  cursor: 'pointer',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4
                  }
                }} 
                onClick={() => handlePhotoClick(comment)}
              >
                <Box sx={{ display: 'flex' }}>
                  <CardMedia
                    component="img"
                    sx={{ 
                      width: 140, 
                      height: 140, 
                      objectFit: 'cover',
                      borderRight: '1px solid rgba(0, 0, 0, 0.12)'
                    }}
                    image={`/images/${comment.file_name}`}
                    alt="Photo"
                  />
                  <CardContent sx={{ flex: '1 0 auto' }}>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        mb: 2,
                        fontStyle: 'italic',
                        '&::before': {
                          content: '""',
                          marginRight: '4px'
                        },
                        '&::after': {
                          content: '""',
                          marginLeft: '4px'
                        }
                      }}
                    >
                      "{comment.comment}"
                    </Typography>
                    <Box 
                      sx={{ 
                        display: 'flex', 
                        justifyContent: 'flex-end',
                        alignItems: 'center'
                      }}
                    >
                      <Typography variant="caption" color="text.secondary">
                        {formatDate(comment.date_time)}
                      </Typography>
                    </Box>
                  </CardContent>
                </Box>
              </Card>
            </React.Fragment>
          ))}
        </List>
      )}
    </div>
  );
}

export default UserComments;
