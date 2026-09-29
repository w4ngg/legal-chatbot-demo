import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Trợ lý hỗ trợ pháp luật",
  description:
    "Trợ lý hỏi đáp pháp luật Việt Nam với câu trả lời dựa trên nguồn tham khảo.",
};

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#f8fafc",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="vi" className="h-full bg-slate-50 antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
