const LandingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="min-h-screen bg-[#111827] overflow-auto">
      <div className="w-full mx-auto">{children}</div>
    </main>
  );
};

export default LandingLayout;
