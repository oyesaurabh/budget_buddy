import Header from "@/components/header";
import NewAccountSheet from "@/features/accounts";
import NewCategorySheet from "@/features/categories";
type Props = {
  children: React.ReactNode;
};
const Layout = ({ children }: Props) => {
  return (
    <>
      <Header />
      <NewAccountSheet />
      <NewCategorySheet />
      <main className="px-5">{children}</main>
    </>
  );
};

export default Layout;
