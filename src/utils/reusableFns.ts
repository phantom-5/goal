import { AlgorithmRange, ArchitectData, IoTData, NetworkingData, PrinciplesData } from '../types';
import algorithmsData from '../algo.json';
import architectData from '../architect.json';
import iotData from '../iot.json';
import networkingData from '../networking.json';
import principlesData from '../principles.json';

// Function to load data from JSON files
export const loadData = (category: string) => {
  try {
    switch (category) {
      case 'algorithms':
        return algorithmsData as AlgorithmRange;
      case 'architect':
        return architectData as ArchitectData;
      case 'iot':
        return iotData as IoTData;
      case 'networking':
        return networkingData as NetworkingData;
      case 'principles':
        return principlesData as PrinciplesData;
      default:
        return null;
    }
  } catch (error) {
    console.error(`Error loading ${category} data:`, error);
    return null;
  }
}; 