"use client";

import { useState } from "react";

import { EvidenceWarning } from "@/components/EvidenceWarning";
import { BalanceIcon, WarningIcon } from "@/components/icons";
import { CitationDetails } from "@/components/citations/CitationDetails";
import { CitationMarker } from "@/components/citations/CitationMarker";
import type { ChatResponse } from "@/lib/types/chat";

interface AssistantMessageProps {
  response: ChatResponse;
}

function AnswerText({ answer }: { answer: string }) {
  const paragraphs = answer
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <div className="space-y-3 text-[15px] leading-7 text-slate-700">
      {paragraphs.map((paragraph, index) => (
        <p key={`${index}-${paragraph.slice(0, 24)}`} className="whitespace-pre-wrap">
          {paragraph}
        </p>
      ))}
    </div>
  );
}

export function AssistantMessage({ response }: AssistantMessageProps) {
  const [selectedCitation, setSelectedCitation] = useState(
    response.citations.length > 0 ? 0 : -1,
  );

  return (
    <article className="w-full max-w-[760px]" aria-label="Câu trả lời của trợ lý">
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
        <span className="flex size-7 items-center justify-center rounded-lg bg-sky-50 text-sky-700 ring-1 ring-sky-100">
          <BalanceIcon className="size-4.5" />
        </span>
        Trợ lý pháp luật
      </div>

      {response.sufficient_evidence ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <AnswerText answer={response.answer} />
        </div>
      ) : (
        <EvidenceWarning
          reason={response.abstention_reason}
        />
      )}

      {response.citations.length > 0 ? (
        <section className="mt-4" aria-label="Nguồn tham khảo">
          <div className="flex flex-wrap items-center gap-2">
            <p className="mr-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
              Nguồn tham khảo
            </p>
            {response.citations.map((citation, index) => (
              <CitationMarker
                key={`${citation.source_id}-${citation.document_id}-${index}`}
                index={index}
                active={selectedCitation === index}
                onSelect={() => setSelectedCitation(index)}
              />
            ))}
          </div>
          {selectedCitation >= 0 ? (
            <div className="mt-2.5">
              <CitationDetails
                citation={response.citations[selectedCitation]}
                displayIndex={selectedCitation}
              />
            </div>
          ) : null}
        </section>
      ) : null}

      {response.warnings.length > 0 ? (
        <div className="mt-3 flex gap-2 rounded-lg bg-slate-100 px-3 py-2.5 text-xs leading-5 text-slate-600">
          <WarningIcon className="mt-0.5 size-4 shrink-0 text-slate-500" />
          <ul className="space-y-1">
            {response.warnings.map((warning, index) => (
              <li key={`${index}-${warning}`}>{warning}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </article>
  );
}
