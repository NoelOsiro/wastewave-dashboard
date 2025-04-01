import { Toaster } from "sonner";

export default async function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-background">
      <div className="w-full flex flex-col md:flex-row items-stretch justify-between mx-auto">
        {children}
      </div>
      <Toaster richColors position="top-right" />
    </main>
  );
}