// 📁 app/page.jsx (Next.js entry point for App Router)


import Calendar from "@/components/Calendar";

export default function HomePage() {
  return (
    <main className="p-4 max-w-5xl mx-auto">
      <Calendar />
    </main>
  );
}
