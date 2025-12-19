//  ヘルパー関数: API呼び出し

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

export async function apiFetch(
  endpoint: string,
  options?: RequestInit
): Promise<Response> {
  return fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    credentials: "include",
  });
}