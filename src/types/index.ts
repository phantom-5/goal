// Types for the Algorithms data
export interface AlgorithmRange {
  [key: string]: {
    [category: string]: string[]
  }
}

// Types for the Architect data
export interface ArchitectTopic {
  range: string;
  category: string;
  topics: string[];
}

export interface ArchitectData {
  topics: ArchitectTopic[];
}

// Types for the Networking data (using the same structure as Architect)
export interface NetworkingData {
  topics: ArchitectTopic[]; // Reusing the ArchitectTopic structure
}

// Types for the IoT data
export interface IoTProtocols {
  [key: string]: string;
}

export interface IoTDataStorage {
  SQL: string;
  NoSQL: string;
}

export interface IoTSecurityManagement {
  Challenges: string[];
  "Data Storage": IoTDataStorage;
}

export interface IoTSubCategory {
  "Cloud Platforms": string[];
  Protocols: IoTProtocols;
  "Security & Data Management": IoTSecurityManagement;
  "IoT Gateways": string;
}

export interface IoTData {
  IoT: IoTSubCategory;
}

// Tab type
export type TabType = 'algorithms' | 'architect' | 'iot' | 'networking'; 