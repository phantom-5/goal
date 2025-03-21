import { AppBar, Box, IconButton, Toolbar, Typography, useTheme } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { toggleTheme } from '../../redux/themeSlice';
import { CONSTANTS } from '../../utils/CONSTANTS';

export const Header = () => {
  const dispatch = useDispatch();
  const darkMode = useSelector((state: RootState) => state.theme.darkMode);
  const theme = useTheme();

  // Define text color based on the theme mode
  const textColor = darkMode ? 'inherit' : 'black';

  return (
    <AppBar position="static" color={darkMode ? 'primary' : 'default'}>
      <Toolbar>
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ 
            flexGrow: 1,
            color: textColor
          }}
        >
          {CONSTANTS.APP_TITLE}
        </Typography>
        <Box>
          <IconButton
            onClick={() => dispatch(toggleTheme())}
            sx={{ color: textColor }}
            aria-label="toggle dark mode"
          >
            {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}; 