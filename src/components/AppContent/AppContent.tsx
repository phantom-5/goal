import { Container } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { AlgorithmsTab } from '../AlgorithmsTab/AlgorithmsTab';
import { ArchitectTab } from '../ArchitectTab/ArchitectTab';
import { IoTTab } from '../IoTTab/IoTTab';
import { NetworkingTab } from '../NetworkingTab/NetworkingTab';
import { PrinciplesTab } from '../PrinciplesTab/PrinciplesTab';

export const AppContent = () => {
  const activeTab = useSelector((state: RootState) => state.tab.activeTab);

  return (
    <Container sx={{ py: 4 }}>
      {activeTab === 'algorithms' && <AlgorithmsTab />}
      {activeTab === 'architect' && <ArchitectTab />}
      {activeTab === 'iot' && <IoTTab />}
      {activeTab === 'networking' && <NetworkingTab />}
      {activeTab === 'principles' && <PrinciplesTab />}
    </Container>
  );
}; 