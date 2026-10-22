export interface AdminState {
  isSuperAdmin?: boolean;
}

export interface ChangeRequest {
  id: number;
  restaurantId: number;
  requestedBy: number;
  payload: Record<string, unknown>;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  reviewedBy?: number | null;
  reviewedAt?: string | null;
  rejectReason?: string | null;
  createdAt: string;
}
