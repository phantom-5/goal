import { useEffect, useState } from 'react';
import { Box, Card, CardContent, Divider, Grid, Typography, LinearProgress, Button } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { IoTData } from '../../types';
import { loadData } from '../../utils/reusableFns';
import { TopicCheckbox } from '../TopicCheckbox/TopicCheckbox';
import { RootState } from '../../redux/store';
import RefreshIcon from '@mui/icons-material/Refresh';
import { resetUserCategoryProgress } from '../../redux/userSlice';

export const IoTTab = () => {
  const dispatch = useDispatch();
  const [data, setData] = useState<IoTData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const completedTopics = currentUser?.completedTopics?.['iot'] || {};

  useEffect(() => {
    setLoading(true);
    const result = loadData('iot');
    if (result) {
      setData(result as IoTData);
    }
    setLoading(false);
  }, []);

  if (loading) {
    return <Typography align="center" sx={{ py: 5 }}>Loading...</Typography>;
  }

  if (!data) {
    return <Typography align="center" color="error" sx={{ py: 5 }}>Failed to load data</Typography>;
  }

  // Calculate overall completion percentage
  const calculateProgress = () => {
    // Create a flat structure of all items to track
    let allItems: { category: string; id: string; }[] = [];
    
    if (data && data.IoT) {
      Object.entries(data.IoT).forEach(([category, content]) => {
        if (Array.isArray(content)) {
          content.forEach((item, index) => {
            allItems.push({ category, id: `${category}-${index}` });
          });
        } else if (typeof content === 'object' && content !== null) {
          Object.entries(content).forEach(([subCategory, subContent]) => {
            if (Array.isArray(subContent)) {
              subContent.forEach((item, index) => {
                allItems.push({ category, id: `${category}-${subCategory}-${index}` });
              });
            } else if (typeof subContent === 'object' && subContent !== null) {
              Object.entries(subContent).forEach(([subSubCategory, subSubContent]) => {
                if (Array.isArray(subSubContent)) {
                  subSubContent.forEach((item, index) => {
                    allItems.push({ category, id: `${category}-${subCategory}-${subSubCategory}-${index}` });
                  });
                } else {
                  allItems.push({ category, id: `${category}-${subCategory}-${subSubCategory}` });
                }
              });
            } else {
              allItems.push({ category, id: `${category}-${subCategory}` });
            }
          });
        } else {
          allItems.push({ category, id: `${category}` });
        }
      });
    }
    
    let completed = 0;
    allItems.forEach(item => {
      if (completedTopics[item.id]) {
        completed++;
      }
    });
    
    return allItems.length > 0 ? (completed / allItems.length) * 100 : 0;
  };

  const handleReset = () => {
    if (currentUser && window.confirm('Are you sure you want to reset all progress for IoT?')) {
      dispatch(resetUserCategoryProgress('iot'));
    }
  };

  const progress = calculateProgress();

  const renderNestedData = (data: any, parentId: string = '') => {
    if (Array.isArray(data)) {
      return (
        <Box component="ul" sx={{ listStyle: 'none', pl: 1 }}>
          {data.map((item, index) => {
            const topicId = parentId ? `${parentId}-${index}` : `${index}`;
            return (
              <Box component="li" key={index} sx={{ mb: 0.5 }}>
                <TopicCheckbox 
                  category="iot"
                  topicId={topicId}
                  label={item}
                />
              </Box>
            );
          })}
        </Box>
      );
    } else if (typeof data === 'object') {
      return (
        <Box sx={{ pl: 2 }}>
          {Object.entries(data).map(([key, value]) => {
            const newParentId = parentId ? `${parentId}-${key}` : key;
            return (
              <Box key={key} sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                  {key}
                </Typography>
                {renderNestedData(value, newParentId)}
              </Box>
            );
          })}
        </Box>
      );
    } else {
      const topicId = parentId;
      return (
        <Box sx={{ pl: 2 }}>
          <TopicCheckbox 
            category="iot"
            topicId={topicId}
            label={data.toString()}
          />
        </Box>
      );
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="h6">Overall Progress</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
              {Math.round(progress)}%
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
          value={progress} 
          sx={{ height: 10, borderRadius: 1 }}
        />
      </Box>

      <Grid container spacing={3}>
        {Object.entries(data.IoT).map(([category, content]) => (
          <Grid item xs={12} md={6} key={category}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  {category}
                </Typography>
                <Divider sx={{ mb: 2 }} />
                {renderNestedData(content, category)}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}; 