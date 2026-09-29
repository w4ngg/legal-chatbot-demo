import { WarningIcon } from "@/components/icons";

interface EvidenceWarningProps {
  reason: string | null;
}

export function EvidenceWarning({ reason }: EvidenceWarningProps) {
  return (
    <section
      className="rounded-xl border border-amber-200 bg-amber-50/80 px-4 py-3.5 text-amber-950"
      role="status"
    >
      <div className="flex gap-3">
        <WarningIcon className="mt-0.5 size-5 shrink-0 text-amber-600" />
        <div className="min-w-0">
          <p className="font-medium">Không đủ căn cứ để trả lời chắc chắn.</p>
          {reason ? (
            <p className="mt-1 text-sm leading-6 text-amber-900/80">{reason}</p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
