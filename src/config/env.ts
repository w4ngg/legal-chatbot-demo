const publicApiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.trim() ?? "";

export interface PublicEnvironment {
  apiBaseUrl: string;
}

export function getPublicEnvironment(): PublicEnvironment {
  if (!publicApiBaseUrl) {
    throw new Error(
      "NEXT_PUBLIC_API_BASE_URL chưa được cấu hình cho frontend.",
    );
  }

  let parsed: URL;
  try {
    parsed = new URL(publicApiBaseUrl);
  } catch {
    throw new Error("NEXT_PUBLIC_API_BASE_URL không phải là URL hợp lệ.");
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new Error("NEXT_PUBLIC_API_BASE_URL phải sử dụng HTTP hoặc HTTPS.");
  }

  return {
    apiBaseUrl: publicApiBaseUrl.replace(/\/+$/, ""),
  };
}

