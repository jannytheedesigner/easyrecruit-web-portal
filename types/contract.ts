// types/contract.ts
export interface Contract {
  id: number;
  job_id: number;
  job_seeker_id: number;
  title: string;
  description?: string;
  type: "fixed" | "hourly";
  amount?: number;
  total_amount?: number;
  hourly_rate?: number;
  status: "active" | "completed" | "terminated" | "pending" | "cancelled";
  start_date: string;
  end_date?: string;
}
