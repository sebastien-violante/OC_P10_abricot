import Header from "../../components/Header/Header"

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
     <Header />
        <main>
            {children}
        </main>
    </>
  );
}
