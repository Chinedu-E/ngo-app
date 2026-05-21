export async function submitForm<T>(
  endpoint: string,
  data: T,
): Promise<{ success: boolean; message: string }> {
  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.message ?? "Something went wrong. Please try again.");
  }

  return json;
}
