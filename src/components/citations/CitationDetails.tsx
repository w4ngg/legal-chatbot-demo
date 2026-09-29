import { DocumentIcon, ExternalLinkIcon } from "@/components/icons";
import type { LegalCitation } from "@/lib/types/chat";

interface CitationDetailsProps {
  citation: LegalCitation;
  displayIndex: number;
}

function safeSourceUrl(value: string | null): string | null {
  if (!value) {
    return null;
  }

  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:"
      ? value
      : null;
  } catch {
    return null;
  }
}

export function CitationDetails({
  citation,
  displayIndex,
}: CitationDetailsProps) {
  const title = citation.document_name?.trim() || citation.document_id;
  const sourceUrl = safeSourceUrl(citation.source_url);

  return (
    <div
      id={`citation-${displayIndex}`}
      className="rounded-xl border border-slate-200 bg-slate-50/80 p-4"
    >
      <div className="flex items-start gap-3">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white text-sky-700 shadow-sm ring-1 ring-slate-200">
          <DocumentIcon className="size-4.5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-sky-700">
            Nguồn [{displayIndex + 1}]
          </p>
          <p className="mt-1 break-words text-sm font-medium leading-6 text-slate-800">
            {title}
          </p>
          {citation.article ? (
            <p className="mt-1.5 text-sm text-slate-600">
              <span className="font-medium text-slate-700">Điều:</span>{" "}
              {citation.article}
            </p>
          ) : null}
          {sourceUrl ? (
            <a
              href={sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-sky-700 underline decoration-sky-200 underline-offset-4 transition hover:text-sky-900 hover:decoration-sky-500 focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
            >
              Xem văn bản gốc
              <ExternalLinkIcon className="size-4" />
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
}
