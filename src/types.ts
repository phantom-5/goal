export interface PrinciplesData {
  principles: {
    [category: string]: string[];
  };
}

export interface AlgorithmRange {
  [range: string]: { 
    [category: string]: string[] 
  };
}

export interface ArchitectData {
  topics: {
    range: string;
    category: string;
    topics: string[];
  }[];
}

export interface NetworkingData {
  topics: {
    range: string;
    category: string;
    topics: string[];
  }[];
}

export interface IoTData {
  IoT: {
    [category: string]: any;
  };
} 