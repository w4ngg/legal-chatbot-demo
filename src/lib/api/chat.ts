import { getPublicEnvironment } from "@/config/env";
import type {
  BackendErrorResponse,
  ChatErrorCode,
  ChatRequest,
  ChatResponse,
  ChatTransport,
  LegalCitation,
  SendChatOptions,
} from "@/lib/types/chat";

const REQUEST_TIMEOUT_MS = 120_000;

export class ChatApiError extends Error {
  constructor(
    public readonly code: ChatErrorCode,
    message: string,
    public readonly retryable: boolean,
    public readonly status?: number,
  ) {
    super(message);
    this.name = "ChatApiError";
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNullableString(value: unknown): value is string | null {
  return typeof value === "string" || value === null;
}

function parseCitation(value: unknown): LegalCitation {
  if (!isRecord(value)) {
    throw new ChatApiError(
      "malformed_response",
      "Phản hồi chứa nguồn trích dẫn không hợp lệ.",
      false,
    );
  }

  const {
    source_id: sourceId,
    document_id: documentId,
    document_name: documentName,
    article,
    source_url: sourceUrl,
  } = value;

  if (
    typeof sourceId !== "string" ||
    typeof documentId !== "string" ||
    !isNullableString(documentName) ||
    !isNullableString(article) ||
    !isNullableString(sourceUrl)
  ) {
    throw new ChatApiError(
      "malformed_response",
      "Phản hồi chứa nguồn trích dẫn không hợp lệ.",
      false,
    );
  }

  return {
    source_id: sourceId,
    document_id: documentId,
    document_name: documentName,
    article,
    source_url: sourceUrl,
  };
}

export function parseChatResponse(value: unknown): ChatResponse {
  if (!isRecord(value)) {
    throw new ChatApiError(
      "malformed_response",
      "Phản hồi từ hệ thống không đúng định dạng.",
      false,
    );
  }

  const {
    answer,
    citations,
    sufficient_evidence: sufficientEvidence,
    abstention_reason: abstentionReason,
    warnings,
    request_id: requestId,
  } = value;

  if (
    typeof answer !== "string" ||
    !Array.isArray(citations) ||
    typeof sufficientEvidence !== "boolean" ||
    !isNullableString(abstentionReason) ||
    !Array.isArray(warnings) ||
    !warnings.every((warning) => typeof warning === "string") ||
    typeof requestId !== "string"
  ) {
    throw new ChatApiError(
      "malformed_response",
      "Phản hồi từ hệ thống không đúng định dạng.",
      false,
    );
  }

  return {
    answer,
    citations: citations.map(parseCitation),
    sufficient_evidence: sufficientEvidence,
    abstention_reason: abstentionReason,
    warnings,
    request_id: requestId,
  };
}

function parseBackendError(value: unknown): BackendErrorResponse | null {
  if (!isRecord(value) || !isRecord(value.error)) {
    return null;
  }

  const { request_id: requestId, error } = value;
  if (
    typeof requestId !== "string" ||
    typeof error.code !== "string" ||
    typeof error.message !== "string" ||
    typeof error.retryable !== "boolean"
  ) {
    return null;
  }

  return {
    request_id: requestId,
    error: {
      code: error.code,
      message: error.message,
      retryable: error.retryable,
    },
  };
}

async function readJson(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    throw new ChatApiError(
      "malformed_response",
      "Phản hồi từ hệ thống không phải JSON hợp lệ.",
      false,
      response.status,
    );
  }
}

async function readOptionalJson(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

function publicMessageForStatus(status: number): string {
  if (status === 408 || status === 504) {
    return "Yêu cầu mất quá nhiều thời gian. Vui lòng thử lại.";
  }
  if (status >= 500) {
    return "Hệ thống trả lời hiện chưa sẵn sàng. Vui lòng thử lại sau.";
  }
  return "Không thể xử lý yêu cầu này. Vui lòng kiểm tra và thử lại.";
}

export class HttpChatClient implements ChatTransport {
  async send(
    request: ChatRequest,
    options: SendChatOptions = {},
  ): Promise<ChatResponse> {
    let apiBaseUrl: string;
    try {
      apiBaseUrl = getPublicEnvironment().apiBaseUrl;
    } catch (error) {
      throw new ChatApiError(
        "configuration",
        error instanceof Error
          ? error.message
          : "Frontend chưa được cấu hình địa chỉ backend.",
        false,
      );
    }

    const controller = new AbortController();
    const timeoutReason = new DOMException(
      "Request timeout",
      "TimeoutError",
    );
    const timeout = window.setTimeout(
      () => controller.abort(timeoutReason),
      REQUEST_TIMEOUT_MS,
    );
    const forwardAbort = () => controller.abort(options.signal?.reason);
    if (options.signal?.aborted) {
      controller.abort(options.signal.reason);
    }
    options.signal?.addEventListener("abort", forwardAbort, { once: true });

    try {
      const response = await fetch(`${apiBaseUrl}/v1/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
        signal: controller.signal,
      });

      if (!response.ok) {
        const payload = await readOptionalJson(response);
        const backendError = parseBackendError(payload);
        throw new ChatApiError(
          response.status >= 500 ? "server" : "request",
          publicMessageForStatus(response.status),
          backendError?.error.retryable ?? response.status >= 500,
          response.status,
        );
      }

      const payload = await readJson(response);
      const parsed = parseChatResponse(payload);
      options.onEvent?.({ type: "complete", response: parsed });
      return parsed;
    } catch (error) {
      if (error instanceof ChatApiError) {
        throw error;
      }
      if (options.signal?.aborted) {
        throw new ChatApiError(
          "aborted",
          "Đã dừng yêu cầu.",
          true,
        );
      }
      if (controller.signal.reason === timeoutReason) {
        throw new ChatApiError(
          "timeout",
          "Yêu cầu mất quá nhiều thời gian. Vui lòng thử lại.",
          true,
        );
      }
      throw new ChatApiError(
        "network",
        "Không thể kết nối tới hệ thống. Vui lòng thử lại.",
        true,
      );
    } finally {
      window.clearTimeout(timeout);
      options.signal?.removeEventListener("abort", forwardAbort);
    }
  }
}

export const chatClient: ChatTransport = new HttpChatClient();
