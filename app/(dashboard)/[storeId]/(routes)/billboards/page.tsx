import { format } from "date-fns"
import prismadb from "@/lib/prismadb";
import BillboardClient from "./components/client";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { BillboardColumn } from "./components/columns";

const BillboardPage = async ({ params }: { params: { storeId: string } }) => {
  const { userId } = auth();
  if (!userId) {
    redirect("/sign-in");
  }
  console.log(params.storeId);
  const billboards = await prismadb.billboard.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  console.log(billboards);

  const formattedBillboards: BillboardColumn[] = billboards?.map((item) => ({
    id: item.id,
    label: item.label,
    createdAt: format(item.createdAt, "MMMM dd, yyyy"),
  }));
  return (
    <div className="flex-col ">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardClient data={formattedBillboards} />
      </div>
    </div>
  );
};

export default BillboardPage;
