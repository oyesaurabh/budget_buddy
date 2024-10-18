import Header from "@/components/header";

type Props = {
  children: React.ReactNode;
};
const Layout = ({ children }: Props) => {
  return (
    <>
      <Header />
      <main className="px-5">{children}</main>
    </>
  );
};

export default Layout;
