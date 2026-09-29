export function LegalDisclaimer({ compact = false }: { compact?: boolean }) {
  return (
    <p
      className={
        compact
          ? "text-center text-[11px] leading-4 text-slate-500"
          : "mx-auto max-w-xl text-center text-sm leading-6 text-slate-500"
      }
    >
      Thông tin được cung cấp chỉ nhằm mục đích tham khảo và không thay thế tư
      vấn pháp lý chuyên nghiệp.
    </p>
  );
}

