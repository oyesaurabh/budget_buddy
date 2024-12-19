import Header from "@/components/header";
import NewAccountSheet from "@/features/accounts";
import NewCategorySheet from "@/features/categories";
import NewTransactionSheet from "@/features/transactions";
type Props = {
  children: React.ReactNode;
};
const Layout = ({ children }: Props) => {
  return (
    <>
      <Header />
      <NewAccountSheet />
      <NewCategorySheet />
      <NewTransactionSheet />
      <main className="px-5">{children}</main>
    </>
  );
};

export default Layout;
