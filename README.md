# Trợ lý hỗ trợ pháp luật — frontend

Frontend demo cho Vietnamese Legal RAG, xây dựng bằng Next.js App Router,
TypeScript và Tailwind CSS. Giao diện chỉ hiển thị dữ liệu thuộc public contract
của API; không hiển thị model, retrieval score hay thông tin hạ tầng nội bộ.

## Chạy local

Yêu cầu Node.js 20.9 trở lên.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Mở `http://localhost:3000`. FastAPI mặc định được gọi tại
`http://localhost:8000` theo `.env.local`:

```dotenv
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

Biến này là URL public, không phải secret. Không đặt API key của LLM hoặc bất kỳ
credential nào trong biến `NEXT_PUBLIC_*`.

## API contract

Frontend gửi:

```http
POST /v1/chat
Content-Type: application/json

{"question":"..."}
```

Response được validate ở runtime trước khi render. UI hỗ trợ câu trả lời, nguồn
trích dẫn, cảnh báo, trường hợp không đủ bằng chứng và lỗi có cấu trúc. Mỗi lượt
chat là một request độc lập; hội thoại chỉ tồn tại trong bộ nhớ của tab hiện tại.

Nút **Dừng** hủy request bằng `AbortController`. Client cũng có timeout 120 giây
và phân biệt lỗi mạng, timeout, response sai schema, 4xx và 5xx.

## CORS của FastAPI

Backend phải cho phép chính xác các origin sử dụng frontend, ví dụ:

```python
allow_origins=[
    "http://localhost:3000",
    "https://legal-frontend.example.vercel.app",
]
```

Không dùng wildcard `*` ở production. Khi có Vercel production domain cuối cùng,
thêm đúng domain đó vào CORS rồi kiểm tra preflight và `POST /v1/chat`.

## Deploy Vercel

1. Import repository này vào Vercel.
2. Khai báo `NEXT_PUBLIC_API_BASE_URL` bằng HTTPS URL của FastAPI cho Production
   và Preview nếu cần.
3. Redeploy sau khi đổi biến môi trường vì biến `NEXT_PUBLIC_*` được nhúng vào
   client bundle tại build time.
4. Cập nhật CORS backend để cho phép domain Vercel tương ứng.

Muốn đổi backend chỉ cần đổi biến môi trường và build/deploy lại frontend; không
cần sửa source code.

## Cấu trúc

```text
src/
├── app/                     # App Router, metadata và global styles
├── components/
│   ├── chat/                # Hội thoại, input, loading và messages
│   └── citations/           # Citation markers và source details
├── config/env.ts            # Public runtime/build configuration
└── lib/
    ├── api/chat.ts          # HTTP transport, validation, error mapping
    └── types/chat.ts        # API và UI contracts
```

`ChatTransport` tách UI khỏi cách vận chuyển dữ liệu. Bản hiện tại dùng một JSON
response hoàn chỉnh. Có thể thêm implementation dùng SSE/`ReadableStream` và phát
`ChatStreamEvent` mà không phải thay contract của toàn bộ giao diện. Các trạng
thái loading hiện tại chỉ là ước lượng UX, không giả làm event từ backend.

## Kiểm tra trước deploy

```bash
npm run lint
npm run build
```
