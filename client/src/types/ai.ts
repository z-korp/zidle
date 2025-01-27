export interface Action {
  id: number;
  action: string;
  timestamp: Date;
  status: "success" | "pending" | "error";
}
