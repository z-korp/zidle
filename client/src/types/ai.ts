export interface Action {
  id: number;
  action: string;
  timestamp: Date;
  status: "success" | "pending" | "error";
}

export interface Goal {
  id: string;
  description: string;
  status: 'ready' | 'active' | 'pending' | 'completed' | 'failed';
  progress: number;
  priority: number;
  horizon: 'short' | 'medium' | 'long';
  success_criteria: string[];
  required_resources: string[];
  estimated_difficulty: number;
}
