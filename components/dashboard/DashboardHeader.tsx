export default function DashboardHeader() {
  return (
    <header className="bg-white border-b px-8 py-5 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-pink-500">
        User Dashboard
      </h1>

      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold">
          U
        </div>

        <div>
          <p className="font-semibold text-red-700">
            Welcome
          </p>

          <p className="text-sm text-gray-700">
            User
          </p>
        </div>
      </div>
    </header>
  );
}