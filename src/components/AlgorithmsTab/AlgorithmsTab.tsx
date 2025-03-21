import { useEffect, useState } from 'react';
import { Box, Card, CardContent, Divider, Grid, Typography, LinearProgress, Button } from '@mui/material';
import { useSelector } from 'react-redux';
import { AlgorithmRange } from '../../types';
import { loadData } from '../../utils/reusableFns';
import { TopicCheckbox } from '../TopicCheckbox/TopicCheckbox';
import { RootState } from '../../redux/store';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useDispatch } from 'react-redux';
import { resetUserCategoryProgress } from '../../redux/userSlice';

export const AlgorithmsTab = () => {
  const dispatch = useDispatch();
  const [data, setData] = useState<AlgorithmRange | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const completedTopics = currentUser?.completedTopics?.['algorithms'] || {};
  
  useEffect(() => {
    setLoading(true);
    const result = loadData('algorithms');
    if (result) {
      setData(result as AlgorithmRange);
    }
    setLoading(false);
  }, []);

  if (loading) {
    return <Typography align="center" sx={{ py: 5 }}>Loading...</Typography>;
  }

  if (!data) {
    return <Typography align="center" color="error" sx={{ py: 5 }}>Failed to load data</Typography>;
  }

  // Calculate completion percentage
  const calculateProgress = (range: string, categoryMap: { [category: string]: string[] }) => {
    let total = 0;
    let completed = 0;
    
    Object.entries(categoryMap).forEach(([category, algorithms]) => {
      algorithms.forEach((algorithm, index) => {
        const topicId = `${range}-${category}-${index}`;
        total++;
        if (completedTopics[topicId]) {
          completed++;
        }
      });
    });
    
    return total > 0 ? (completed / total) * 100 : 0;
  };

  // Calculate overall completion percentage across all algorithm ranges
  const calculateOverallProgress = () => {
    let total = 0;
    let completed = 0;
    
    Object.entries(data).forEach(([range, categoryMap]) => {
      Object.entries(categoryMap).forEach(([category, algorithms]) => {
        algorithms.forEach((algorithm, index) => {
          const topicId = `${range}-${category}-${index}`;
          total++;
          if (completedTopics[topicId]) {
            completed++;
          }
        });
      });
    });
    
    return total > 0 ? (completed / total) * 100 : 0;
  };

  const handleReset = () => {
    if (currentUser && window.confirm('Are you sure you want to reset all progress for Algorithms?')) {
      dispatch(resetUserCategoryProgress('algorithms'));
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
        {Object.entries(data).map(([range, categoryMap]) => {
          const progress = calculateProgress(range, categoryMap);
          
          return (
            <Grid item xs={12} md={6} lg={4} key={range}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 0 }}>
                      Week {range}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {Math.round(progress)}%
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={progress} 
                    sx={{ mb: 2, borderRadius: 1 }}
                  />
                  <Divider sx={{ mb: 2 }} />
                  {Object.entries(categoryMap).map(([category, algorithms]) => (
                    <Box key={category} sx={{ mb: 2 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        {category}
                      </Typography>
                      <Box component="ul" sx={{ listStyle: 'none', pl: 0 }}>
                        {algorithms.map((algorithm, index) => {
                          const topicId = `${range}-${category}-${index}`;
                          return (
                            <Box component="li" key={index} sx={{ mb: 0.5 }}>
                              <TopicCheckbox 
                                category="algorithms"
                                topicId={topicId}
                                label={algorithm}
                              />
                            </Box>
                          );
                        })}
                      </Box>
                    </Box>
                  ))}
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}; 