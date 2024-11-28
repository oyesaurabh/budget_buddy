"use client";

import { Button } from "@/components/ui/button";
import { useNewAccount } from "@/hooks/useNewAccount";

export default function Home() {
  const { onOpen } = useNewAccount();

  return (
    <>
      <Button onClick={onOpen}>click</Button>
    </>
  );
}
