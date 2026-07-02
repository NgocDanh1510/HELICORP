const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export async function subscribeNewsletter(email: string) {
  try {
    const response = await fetch(`${apiUrl}/api/newsletter`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email })
    });

    return response.ok;
  } catch {
    return false;
  }
}
