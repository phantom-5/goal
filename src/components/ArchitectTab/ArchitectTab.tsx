import { useEffect, useState } from 'react';
import { Box, Card, CardContent, Divider, Grid, Typography, LinearProgress, Button } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { ArchitectData } from '../../types';
import { loadData } from '../../utils/reusableFns';
import { TopicCheckbox } from '../TopicCheckbox/TopicCheckbox';
import { RootState } from '../../redux/store';
import RefreshIcon from '@mui/icons-material/Refresh';
import { resetUserCategoryProgress } from '../../redux/userSlice';

export const ArchitectTab = () => {
  const dispatch = useDispatch();
  const [data, setData] = useState<ArchitectData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const completedTopics = currentUser?.completedTopics?.['architect'] || {};

  useEffect(() => {
    setLoading(true);
    const result = loadData('architect');
    if (result) {
      setData(result as ArchitectData);
    }
    setLoading(false);
  }, []);

  if (loading) {
    return <Typography align="center" sx={{ py: 5 }}>Loading...</Typography>;
  }

  if (!data) {
    return <Typography align="center" color="error" sx={{ py: 5 }}>Failed to load data</Typography>;
  }

  // Calculate completion percentage for a topic group
  const calculateProgress = (topicGroup: any) => {
    let total = topicGroup.topics.length;
    let completed = 0;
    
    topicGroup.topics.forEach((topic: string, index: number) => {
      const topicId = `${topicGroup.range}-${index}`;
      if (completedTopics[topicId]) {
        completed++;
      }
    });
    
    return total > 0 ? (completed / total) * 100 : 0;
  };

  // Calculate overall completion percentage
  const calculateOverallProgress = () => {
    let total = 0;
    let completed = 0;
    
    data.topics.forEach((topicGroup) => {
      topicGroup.topics.forEach((topic, index) => {
        const topicId = `${topicGroup.range}-${index}`;
        total++;
        if (completedTopics[topicId]) {
          completed++;
        }
      });
    });
    
    return total > 0 ? (completed / total) * 100 : 0;
  };

  const handleReset = () => {
    if (currentUser && window.confirm('Are you sure you want to reset all progress for Architect?')) {
      dispatch(resetUserCategoryProgress('architect'));
    }
  };

  const overallProgress = calculateOverallProgress();

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="h6">Overall Progress</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
              {Math.round(overallProgress)}%
            </Typography>
            <Button 
              startIcon={<RefreshIcon />} 
              onClick={handleReset}
              color="secondary"
              size="small"
              variant="outlined"
            >
              Reset Progress
            </Button>
          </Box>
        </Box>
        <LinearProgress 
          variant="determinate" 
          value={overallProgress} 
          sx={{ height: 10, borderRadius: 1 }}
        />
      </Box>

      <Grid container spacing={3}>
        {data.topics.map((topicGroup, groupIndex) => {
          const progress = calculateProgress(topicGroup);
          
          return (
            <Grid item xs={12} md={6} lg={4} key={groupIndex}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 0 }}>
                      Week {topicGroup.range}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {Math.round(progress)}%
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={progress} 
                    sx={{ mb: 1, borderRadius: 1 }}
                  />
                  <Typography variant="subtitle1" color="primary">
                    {topicGroup.category}
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  <Box component="ul" sx={{ listStyle: 'none', pl: 0 }}>
                    {topicGroup.topics.map((topic, topicIndex) => {
                      const topicId = `${topicGroup.range}-${topicIndex}`;
                      return (
                        <Box component="li" key={topicIndex} sx={{ mb: 0.5 }}>
                          <TopicCheckbox 
                            category="architect"
                            topicId={topicId}
                            label={topic}
                          />
                        </Box>
                      );
                    })}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}; 