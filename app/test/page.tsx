export default function TestPage() {
  async function sendTest() {
    await fetch("/api/telegram", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: "✅ Telegram API Test Successful!",
      }),
    });

    alert("Request sent!");
  }

  return (
    <div className="p-10">
      <button
        onClick={sendTest}
        className="bg-green-600 text-white px-5 py-3 rounded-lg"
      >
        Send Telegram Test
      </button>
    </div>
  );
}