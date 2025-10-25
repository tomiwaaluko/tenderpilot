// Shared TypeScript definitions used across server and client code.
// Keeping our data contracts in a single place helps avoid duplication
// and makes API responses easier to reason about.

export type TaskCandidate = {
  type: 'evidence_sort' | 'client_update';
  rationale: string;
  required_fields: string[];
  confidence: number;
};

export type SpecialistProposal = {
  task_type: TaskCandidate['type'];
  summary: string;
  actions: Array<{
    kind: 'draft_message' | 'extract_table' | 'fill_form';
    data: any;
  }>;
  citations?: Array<{ sourceId: string; quote?: string }>;
  risks?: string[];
  confidence: number;
};

export type DraftMessage = {
  to: string;
  subject?: string;
  body: string;
  style: 'empathetic' | 'professional';
};

export type EvidenceRow = {
  artifactId: string;
  provider?: string;
  date_of_service?: string;
  amount?: number;
  notes?: string;
};

export type ApprovalDecision = {
  taskId: string;
  approve: boolean;
  reviewer: string;
  comments?: string;
};
