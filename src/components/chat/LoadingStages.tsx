"use client";

import { useEffect, useState } from "react";

import type { LoadingStageId } from "@/lib/types/chat";

const STAGES: Array<{ id: LoadingStageId; label: string }> = [
  { id: "search", label: "Đang tìm kiếm tài liệu liên quan..." },
  { id: "review", label: "Đang đánh giá các nguồn phù hợp..." },
  { id: "compose", label: "Đang tổng hợp câu trả lời..." },
];

interface LoadingStagesProps {
  confirmedStage?: LoadingStageId;
}

export function LoadingStages({ confirmedStage }: LoadingStagesProps) {
  const [simulatedIndex, setSimulatedIndex] = useState(0);

  useEffect(() => {
    if (confirmedStage) {
      return;
    }

    const reviewTimer = window.setTimeout(() => setSimulatedIndex(1), 1_600);
    const composeTimer = window.setTimeout(() => setSimulatedIndex(2), 4_800);
    return () => {
      window.clearTimeout(reviewTimer);
      window.clearTimeout(composeTimer);
    };
  }, [confirmedStage]);

  const activeIndex = confirmedStage
    ? Math.max(
        0,
        STAGES.findIndex((stage) => stage.id === confirmedStage),
      )
    : simulatedIndex;

  return (
    <div
      className="w-full max-w-md rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm"
      aria-live="polite"
      aria-label="Hệ thống đang xử lý yêu cầu"
    >
      <div className="flex items-center gap-2.5">
        <span className="relative flex size-2.5">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-sky-400 opacity-60 motion-reduce:animate-none" />
          <span className="relative inline-flex size-2.5 rounded-full bg-sky-600" />
        </span>
        <p className="text-sm font-medium text-slate-700">
          {STAGES[activeIndex].label}
        </p>
      </div>
      <div className="mt-3 flex gap-1.5" aria-hidden="true">
        {STAGES.map((stage, index) => (
          <span
            key={stage.id}
            className={
              index <= activeIndex
                ? "h-1 flex-1 rounded-full bg-sky-500 transition-colors duration-500"
                : "h-1 flex-1 rounded-full bg-slate-200 transition-colors duration-500"
            }
          />
        ))}
      </div>
      <p className="mt-2.5 text-xs leading-5 text-slate-400">
        Trạng thái hiển thị mang tính ước tính trong khi hệ thống xử lý.
      </p>
    </div>
  );
}
