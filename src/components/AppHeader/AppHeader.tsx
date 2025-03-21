import React from 'react';
import { AppBar, Container, Toolbar, Box, Typography, Tabs, Tab, IconButton, useTheme } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { setActiveTab } from '../../redux/tabSlice';
import { toggleTheme } from '../../redux/themeSlice';
import { TabValue } from '../../redux/tabSlice';

export const AppHeader = () => {
  const dispatch = useDispatch();
  const activeTab = useSelector((state: RootState) => state.tab.activeTab);
  const darkMode = useSelector((state: RootState) => state.theme.darkMode);
  const theme = useTheme();

  const handleTabChange = (event: React.SyntheticEvent, newValue: TabValue) => {
    dispatch(setActiveTab(newValue));
  };

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  // Define text color based on the theme mode
  const textColor = darkMode ? 'inherit' : 'black';

  return (
    <AppBar position="sticky" color="default" sx={{ boxShadow: 1 }}>
      <Container>
        <Toolbar disableGutters>
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ 
                mr: 4, 
                display: { xs: 'none', sm: 'flex' },
                color: textColor
              }}
            >
              Learning Plan
            </Typography>
            
            <Tabs 
              value={activeTab} 
              onChange={handleTabChange} 
              sx={{ 
                '& .MuiTab-root': { 
                  minWidth: 'auto', 
                  px: { xs: 1, sm: 2 },
                  color: darkMode ? 'inherit' : 'text.primary'
                } 
              }}
              textColor="inherit"
            >
              <Tab label="Algorithms" value="algorithms" />
              <Tab label="Architect" value="architect" />
              <Tab label="IoT" value="iot" />
              <Tab label="Networking" value="networking" />
              <Tab label="Principles" value="principles" />
            </Tabs>
          </Box>
          
          <IconButton 
            sx={{ 
              ml: 1,
              color: textColor
            }} 
            onClick={handleThemeToggle}
          >
            {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Toolbar>
      </Container>
    </AppBar>
  );
}; 