import Header from "@/components/header";
import NewAccountSheet from "@/features/accounts";
type Props = {
  children: React.ReactNode;
};
const Layout = ({ children }: Props) => {
  return (
    <>
      <Header />
      <NewAccountSheet />
      <main className="px-5">{children}</main>
    </>
  );
};

export default Layout;
