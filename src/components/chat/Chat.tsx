"use client";

import { useEffect, useRef, useState } from "react";

import { LegalDisclaimer } from "@/components/LegalDisclaimer";
import { BalanceIcon } from "@/components/icons";
import { AssistantMessage } from "@/components/chat/AssistantMessage";
import { ChatInput } from "@/components/chat/ChatInput";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { LoadingStages } from "@/components/chat/LoadingStages";
import { UserMessage } from "@/components/chat/UserMessage";
import { ChatApiError, chatClient } from "@/lib/api/chat";
import type { ChatTurn } from "@/lib/types/chat";

const GENERIC_ERROR = "Không thể xử lý yêu cầu lúc này. Vui lòng thử lại.";

function makeTurnId(): string {
  return globalThis.crypto?.randomUUID?.() ?? `turn-${Date.now()}`;
}

export function Chat() {
  const [turns, setTurns] = useState<ChatTurn[]>([]);
  const [activeTurnId, setActiveTurnId] = useState<string | null>(null);
  const controllerRef = useRef<AbortController | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const isRunning = activeTurnId !== null;

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [turns, activeTurnId]);

  useEffect(() => {
    return () => controllerRef.current?.abort();
  }, []);

  async function runRequest(question: string, existingTurnId?: string) {
    if (controllerRef.current) {
      return;
    }

    const turnId = existingTurnId ?? makeTurnId();
    const controller = new AbortController();
    controllerRef.current = controller;
    setActiveTurnId(turnId);

    if (existingTurnId) {
      setTurns((current) =>
        current.map((turn) =>
          turn.id === existingTurnId
            ? {
                id: turn.id,
                question: turn.question,
                status: "pending",
              }
            : turn,
        ),
      );
    } else {
      setTurns((current) => [
        ...current,
        { id: turnId, question, status: "pending" },
      ]);
    }

    try {
      const response = await chatClient.send(
        { question },
        { signal: controller.signal },
      );
      setTurns((current) =>
        current.map((turn) =>
          turn.id === turnId
            ? { ...turn, status: "completed", response }
            : turn,
        ),
      );
    } catch (error) {
      const apiError = error instanceof ChatApiError ? error : null;
      const cancelled = apiError?.code === "aborted";
      setTurns((current) =>
        current.map((turn) =>
          turn.id === turnId
            ? {
                ...turn,
                status: cancelled ? "cancelled" : "error",
                errorMessage: apiError?.message ?? GENERIC_ERROR,
              }
            : turn,
        ),
      );
    } finally {
      if (controllerRef.current === controller) {
        controllerRef.current = null;
        setActiveTurnId(null);
      }
    }
  }

  function handleSend(question: string): boolean {
    if (controllerRef.current) {
      return false;
    }
    void runRequest(question);
    return true;
  }

  function handleRetry(turn: ChatTurn) {
    void runRequest(turn.question, turn.id);
  }

  function handleStop() {
    controllerRef.current?.abort();
  }

  return (
    <div className="flex min-h-dvh flex-col bg-slate-50">
      <header className="sticky top-0 z-20 border-b border-slate-200/90 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-5xl items-center px-5 sm:px-8">
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-xl bg-sky-700 text-white shadow-sm">
              <BalanceIcon className="size-5" />
            </span>
            <div>
              <p className="text-sm font-semibold tracking-tight text-slate-900 sm:text-base">
                Trợ lý hỗ trợ pháp luật
              </p>
              <p className="text-xs text-slate-500">Tra cứu có dẫn nguồn</p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-5 sm:px-8">
        {turns.length === 0 ? (
          <section className="flex flex-1 flex-col items-center justify-center py-16 text-center">
            <div className="flex size-14 items-center justify-center rounded-2xl border border-sky-100 bg-sky-50 text-sky-700 shadow-sm">
              <BalanceIcon className="size-7" />
            </div>
            <h1 className="mt-5 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              Trợ lý hỗ trợ pháp luật
            </h1>
            <p className="mt-3 max-w-lg text-[15px] leading-7 text-slate-600">
              Hỗ trợ tra cứu và tổng hợp thông tin từ các văn bản pháp luật.
            </p>
            <div className="mt-6">
              <LegalDisclaimer />
            </div>
          </section>
        ) : (
          <section
            className="flex-1 space-y-8 py-8 sm:py-10"
            aria-label="Nội dung hội thoại"
          >
            {turns.map((turn) => (
              <div key={turn.id} className="space-y-5">
                <ChatMessage role="user">
                  <UserMessage question={turn.question} />
                </ChatMessage>
                <ChatMessage role="assistant">
                  {turn.status === "pending" ? (
                    <LoadingStages />
                  ) : turn.status === "completed" && turn.response ? (
                    <AssistantMessage response={turn.response} />
                  ) : (
                    <div
                      className="w-full max-w-md rounded-2xl border border-rose-200 bg-rose-50 px-4 py-4"
                      role="alert"
                    >
                      <p className="text-sm font-medium text-rose-900">
                        {turn.errorMessage ?? GENERIC_ERROR}
                      </p>
                      <button
                        type="button"
                        onClick={() => handleRetry(turn)}
                        disabled={isRunning}
                        className="mt-3 rounded-lg border border-rose-200 bg-white px-3 py-1.5 text-sm font-medium text-rose-800 outline-none transition hover:bg-rose-100 focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Thử lại
                      </button>
                    </div>
                  )}
                </ChatMessage>
              </div>
            ))}
            <div ref={endRef} />
          </section>
        )}
      </main>

      <footer className="sticky bottom-0 z-20 border-t border-slate-200/80 bg-slate-50/95 px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur sm:px-8">
        <div className="mx-auto w-full max-w-3xl">
          <ChatInput
            isRunning={isRunning}
            onSend={handleSend}
            onStop={handleStop}
          />
          <div className="mt-2.5">
            <LegalDisclaimer compact />
          </div>
        </div>
      </footer>
    </div>
  );
}

