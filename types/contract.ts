// types/contract.ts
export interface Contract {
  id: number;
  job_id: number;
  job_seeker_id: number;
  title: string;
  type: "fixed" | "hourly";
  total_amount?: number;
  hourly_rate?: number;
  status: "active" | "completed" | "terminated";
  start_date: string;
  end_date?: string;
}