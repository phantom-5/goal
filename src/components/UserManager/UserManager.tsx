import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Divider,
  Paper,
  IconButton,
  Tooltip,
  Collapse
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { addUser, setCurrentUser, deleteUser } from '../../redux/userSlice';
import { RootState } from '../../redux/store';
import PersonIcon from '@mui/icons-material/Person';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

export const UserManager = () => {
  const dispatch = useDispatch();
  const [newUsername, setNewUsername] = useState('');
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [expanded, setExpanded] = useState(true);
  
  const { users, currentUser } = useSelector((state: RootState) => state.user);
  
  const handleAddUser = () => {
    // Validate username
    if (!newUsername.trim()) {
      setError('Username cannot be empty');
      return;
    }
    
    // Check if username is unique
    const userExists = users.some(user => 
      user.username.toLowerCase() === newUsername.toLowerCase()
    );
    
    if (userExists) {
      setError('Username already exists. Please choose another one.');
      return;
    }
    
    // Add new user
    dispatch(addUser({ username: newUsername }));
    setNewUsername('');
    setError('');
    setOpenDialog(false);
  };
  
  const handleSelectUser = (userId: string) => {
    dispatch(setCurrentUser(userId));
  };
  
  const handleOpenDialog = () => {
    setNewUsername('');
    setError('');
    setOpenDialog(true);
  };
  
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setError('');
  };
  
  const handleDeleteClick = (userId: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent the click from selecting the user
    setUserToDelete(userId);
    setConfirmDeleteOpen(true);
  };
  
  const handleConfirmDelete = () => {
    if (userToDelete) {
      dispatch(deleteUser(userToDelete));
      setUserToDelete(null);
      setConfirmDeleteOpen(false);
    }
  };
  
  const handleCancelDelete = () => {
    setUserToDelete(null);
    setConfirmDeleteOpen(false);
  };

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };
  
  return (
    <Box sx={{ mb: 4 }}>
      <Paper elevation={2} sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: expanded ? 2 : 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton 
              onClick={toggleExpanded}
              size="small"
              sx={{ mr: 1 }}
              aria-label={expanded ? "collapse user section" : "expand user section"}
            >
              {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
              <PersonIcon sx={{ mr: 1 }} /> 
              Users
              {!expanded && currentUser && (
                <Typography variant="body2" sx={{ ml: 1, opacity: 0.7 }}>
                  ({currentUser.username})
                </Typography>
              )}
            </Typography>
          </Box>
          
          <Button
            variant="outlined"
            size="small"
            startIcon={<PersonAddIcon />}
            onClick={handleOpenDialog}
          >
            New User
          </Button>
        </Box>
        
        <Collapse in={expanded} timeout="auto">
          <Divider sx={{ mb: 2 }} />
          
          {currentUser ? (
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Current User:
              </Typography>
              <Typography variant="body1" fontWeight="bold">
                {currentUser.username}
              </Typography>
            </Box>
          ) : (
            <Alert severity="info" sx={{ mb: 2 }}>
              Please select a user or create a new one to track your progress.
            </Alert>
          )}
          
          {users.length > 0 ? (
            <List dense sx={{ bgcolor: 'background.paper', maxHeight: '200px', overflow: 'auto' }}>
              {users.map((user) => (
                <ListItem 
                  key={user.id}
                  disablePadding
                  secondaryAction={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {currentUser?.id === user.id && (
                        <Typography variant="caption" color="primary" sx={{ mr: 1 }}>
                          Active
                        </Typography>
                      )}
                      <Tooltip title="Delete User">
                        <IconButton 
                          edge="end" 
                          aria-label="delete"
                          onClick={(e) => handleDeleteClick(user.id, e)}
                          size="small"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  }
                >
                  <ListItemButton 
                    selected={currentUser?.id === user.id}
                    onClick={() => handleSelectUser(user.id)}
                  >
                    <ListItemText primary={user.username} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="body2" color="text.secondary" align="center" sx={{ my: 2 }}>
              No users yet. Create a new user to get started.
            </Typography>
          )}
        </Collapse>
      </Paper>
      
      {/* New User Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Create New User</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Username"
            type="text"
            fullWidth
            variant="outlined"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            error={!!error}
            helperText={error}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleAddUser} variant="contained">Create</Button>
        </DialogActions>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={confirmDeleteOpen}
        onClose={handleCancelDelete}
      >
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this user? All progress will be lost.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}; 