export default async function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-background">
      <div className="w-full max-w-7xl flex flex-col md:flex-row items-stretch justify-between mx-auto">
        {children}
      </div>
    </main>
  );
}