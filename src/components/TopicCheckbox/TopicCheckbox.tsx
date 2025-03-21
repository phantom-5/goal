import { Checkbox, FormControlLabel, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { updateUserTopicCompletion } from '../../redux/userSlice';

interface TopicCheckboxProps {
  category: string;
  topicId: string;
  label: string;
}

export const TopicCheckbox = ({ category, topicId, label }: TopicCheckboxProps) => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  
  // Check if the topic is completed for the current user
  const isCompleted = currentUser?.completedTopics?.[category]?.[topicId] || false;
  
  const handleToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (currentUser) {
      dispatch(updateUserTopicCompletion({
        category,
        topicId,
        completed: event.target.checked
      }));
    }
  };
  
  return (
    <FormControlLabel
      control={
        <Checkbox 
          checked={isCompleted}
          onChange={handleToggle}
          disabled={!currentUser}
        />
      }
      label={
        <Typography
          variant="body2"
          sx={{
            textDecoration: isCompleted ? 'line-through' : 'none',
            color: isCompleted ? 'text.secondary' : 'text.primary',
            fontWeight: isCompleted ? 'normal' : 'medium'
          }}
        >
          {label}
        </Typography>
      }
    />
  );
}; 