"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNewAccount } from "@/hooks/useNewAccount";
import { PlusIcon } from "lucide-react";
import { Payment, columns } from "./columns";
import { DataTable } from "@/components/data-table";

const data: Payment[] = [
  {
    id: "728ed52f",
    amount: 100,
    status: "pending",
    email: "am@example.com",
  },
  {
    id: "728ed52f",
    amount: 100,
    status: "pending",
    email: "bm@example.com",
  },
  {
    id: "728ed52f",
    amount: 100,
    status: "pending",
    email: "zm@example.com",
  },
  {
    id: "728ed52f",
    amount: 100,
    status: "pending",
    email: "jm@example.com",
  },
  {
    id: "728ed52f",
    amount: 100,
    status: "pending",
    email: "xm@example.com",
  },
];
const AccountPage = () => {
  const { onOpen } = useNewAccount();

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
          <DataTable columns={columns} data={data} filterKey="email" />
        </CardContent>
      </Card>
    </div>
  );
};
export default AccountPage;
