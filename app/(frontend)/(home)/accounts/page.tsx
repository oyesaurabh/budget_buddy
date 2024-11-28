"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNewAccount } from "@/hooks/useNewAccount";
import { Loader2, PlusIcon } from "lucide-react";
import { columns } from "./columns";
import { DataTable } from "@/components/data-table";
import { useEffect, useState } from "react";
import { axiosService } from "@/services";
import { toast } from "sonner";

const AccountPage = () => {
  const { isOpen, onOpen } = useNewAccount();
  const [accountData, setAccountData] = useState([]);
  useEffect(() => {
    try {
      fetchAccounts();
    } catch (error: any) {
      toast.error("Something went wrong");
      console.error(error.message ?? "Something went wrong");
    }
  }, [isOpen]); //TODO, calls fetchAccounts each time we open or close accounts tab

  const fetchAccounts = async () => {
    const { status, data, message } = await axiosService.getAccounts();
    if (!status) throw new Error(message ?? "Something went wrong");
    setAccountData(data);
  };

  if (!accountData?.length) {
    return (
      <div className="max-w-screen-2xl mx-auto -mt-24">
        <Card className="border-none">
          <CardHeader className="gap-y-2 md:flex-row md:items-center md:justify-between"></CardHeader>
          <CardContent>
            <div className="h-[400px] w-full flex items-center justify-center">
              <Loader2 className="animate-spin" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  return (
    <div className="max-w-screen-2xl mx-auto -mt-24">
      <Card className="border-none">
        <CardHeader className="gap-y-2 md:flex-row md:items-center md:justify-between">
          <CardTitle>Accounts Page</CardTitle>
          <Button className="sm" onClick={onOpen}>
            <PlusIcon />
            Add New
          </Button>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={accountData} filterKey="name" />
        </CardContent>
      </Card>
    </div>
  );
};
export default AccountPage;
