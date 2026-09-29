interface CitationMarkerProps {
  index: number;
  active: boolean;
  onSelect: () => void;
}

export function CitationMarker({
  index,
  active,
  onSelect,
}: CitationMarkerProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={active}
      aria-label={`Xem nguồn tham khảo ${index + 1}`}
      className={
        active
          ? "inline-flex h-7 min-w-8 items-center justify-center rounded-md border border-sky-300 bg-sky-100 px-2 text-xs font-semibold text-sky-800 outline-none transition focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
          : "inline-flex h-7 min-w-8 items-center justify-center rounded-md border border-slate-200 bg-white px-2 text-xs font-semibold text-slate-600 outline-none transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700 focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
      }
    >
      [{index + 1}]
    </button>
  );
}

