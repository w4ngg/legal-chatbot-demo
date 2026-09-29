export interface ChatRequest {
  question: string;
}

export interface LegalCitation {
  source_id: string;
  document_id: string;
  document_name: string | null;
  article: string | null;
  source_url: string | null;
}

export interface ChatResponse {
  answer: string;
  citations: LegalCitation[];
  sufficient_evidence: boolean;
  abstention_reason: string | null;
  warnings: string[];
  request_id: string;
}

export interface BackendErrorBody {
  code: string;
  message: string;
  retryable: boolean;
}

export interface BackendErrorResponse {
  request_id: string;
  error: BackendErrorBody;
}

export type ChatErrorCode =
  | "aborted"
  | "configuration"
  | "malformed_response"
  | "network"
  | "request"
  | "server"
  | "timeout";

export type ChatTurnStatus =
  | "pending"
  | "completed"
  | "error"
  | "cancelled";

export interface ChatTurn {
  id: string;
  question: string;
  status: ChatTurnStatus;
  response?: ChatResponse;
  errorMessage?: string;
}

export type ChatStreamEvent =
  | { type: "stage"; stage: LoadingStageId }
  | { type: "token"; token: string }
  | { type: "complete"; response: ChatResponse };

export type LoadingStageId = "search" | "review" | "compose";

export interface SendChatOptions {
  signal?: AbortSignal;
  onEvent?: (event: ChatStreamEvent) => void;
}

export interface ChatTransport {
  send(
    request: ChatRequest,
    options?: SendChatOptions,
  ): Promise<ChatResponse>;
}

