import { Box, Tab, Tabs, useMediaQuery, useTheme } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { setActiveTab, TabValue } from '../../redux/tabSlice';
import { CONSTANTS } from '../../utils/CONSTANTS';
import { AlgorithmsTab } from '../AlgorithmsTab/AlgorithmsTab';
import { ArchitectTab } from '../ArchitectTab/ArchitectTab';
import { IoTTab } from '../IoTTab/IoTTab';
import { NetworkingTab } from '../NetworkingTab/NetworkingTab';
import { PrinciplesTab } from '../PrinciplesTab/PrinciplesTab';

export const TabContainer = () => {
  const dispatch = useDispatch();
  const activeTab = useSelector((state: RootState) => state.tab.activeTab);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleTabChange = (_event: React.SyntheticEvent, newValue: TabValue) => {
    dispatch(setActiveTab(newValue));
  };

  return (
    <Box sx={{ width: '100%', mt: 2 }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant={isMobile ? "scrollable" : "fullWidth"}
          scrollButtons={isMobile ? "auto" : undefined}
          centered={!isMobile}
          sx={{
            '& .MuiTab-root': {
              fontWeight: 'bold',
              fontSize: { xs: '0.875rem', sm: '1rem' },
              textTransform: 'none',
              px: { xs: 1, sm: 2 },
            },
          }}
        >
          <Tab label={CONSTANTS.TAB_LABELS.ALGORITHMS} value="algorithms" />
          <Tab label={CONSTANTS.TAB_LABELS.ARCHITECT} value="architect" />
          <Tab label={CONSTANTS.TAB_LABELS.IOT} value="iot" />
          <Tab label={CONSTANTS.TAB_LABELS.NETWORKING} value="networking" />
          <Tab label={CONSTANTS.TAB_LABELS.PRINCIPLES} value="principles" />
        </Tabs>
      </Box>
      <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
        {activeTab === 'algorithms' && <AlgorithmsTab />}
        {activeTab === 'architect' && <ArchitectTab />}
        {activeTab === 'iot' && <IoTTab />}
        {activeTab === 'networking' && <NetworkingTab />}
        {activeTab === 'principles' && <PrinciplesTab />}
      </Box>
    </Box>
  );
}; 