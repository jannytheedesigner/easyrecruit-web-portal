export interface Payment {
  id: number
  contract_id: number
  amount: number
  status: "pending" | "completed" | "failed"
  payment_method: string
  transaction_id?: string
  created_at: string
}

export interface WalletBalance {
  balance: number
  currency: string
}

export interface WalletTransaction {
  id: number
  type: "credit" | "debit"
  amount: number
  description: string
  status: "pending" | "completed" | "failed"
  created_at: string
}
