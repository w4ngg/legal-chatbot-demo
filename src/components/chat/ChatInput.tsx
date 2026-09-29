"use client";

import {
  type FormEvent,
  type KeyboardEvent,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import { ArrowUpIcon, StopIcon } from "@/components/icons";

const MAX_QUESTION_LENGTH = 4_000;

interface ChatInputProps {
  isRunning: boolean;
  onSend: (question: string) => boolean;
  onStop: () => void;
}

export function ChatInput({ isRunning, onSend, onStop }: ChatInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const normalizedValue = value.trim();
  const canSend = normalizedValue.length > 0 && !isRunning;

  useLayoutEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) {
      return;
    }
    textarea.style.height = "0px";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 176)}px`;
  }, [value]);

  function submit() {
    if (!canSend) {
      return;
    }
    if (onSend(normalizedValue)) {
      setValue("");
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    submit();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (
      event.key === "Enter" &&
      !event.shiftKey &&
      !event.nativeEvent.isComposing
    ) {
      event.preventDefault();
      submit();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full" aria-label="Gửi câu hỏi pháp luật">
      <div className="rounded-2xl border border-slate-300 bg-white p-2 shadow-[0_8px_30px_rgba(15,23,42,0.08)] transition focus-within:border-sky-400 focus-within:ring-3 focus-within:ring-sky-100">
        <label htmlFor="legal-question" className="sr-only">
          Nhập câu hỏi pháp luật
        </label>
        <textarea
          ref={textareaRef}
          id="legal-question"
          rows={1}
          maxLength={MAX_QUESTION_LENGTH}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Nhập câu hỏi pháp luật của bạn..."
          className="max-h-44 min-h-12 w-full resize-none overflow-y-auto bg-transparent px-3 py-2 text-[15px] leading-6 text-slate-800 outline-none placeholder:text-slate-400"
        />
        <div className="flex items-center justify-between gap-3 px-2 pb-1">
          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <span>Enter để gửi</span>
            <span aria-hidden="true">•</span>
            <span>Shift + Enter để xuống dòng</span>
            {value.length > 3_200 ? (
              <span className="ml-1 text-slate-500">
                {value.length}/{MAX_QUESTION_LENGTH}
              </span>
            ) : null}
          </div>
          {isRunning ? (
            <button
              type="button"
              onClick={onStop}
              className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700 outline-none transition hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
            >
              <StopIcon className="size-4" />
              Dừng
            </button>
          ) : (
            <button
              type="submit"
              disabled={!canSend}
              className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-sky-700 text-white outline-none transition hover:bg-sky-800 focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
              aria-label="Gửi câu hỏi"
            >
              <ArrowUpIcon className="size-5" />
            </button>
          )}
        </div>
      </div>
    </form>
  );
}

