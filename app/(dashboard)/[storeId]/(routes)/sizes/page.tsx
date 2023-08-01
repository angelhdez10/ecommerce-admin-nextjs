import { format } from "date-fns";
import prismadb from "@/lib/prismadb";
import SizeClient from "./components/client";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { SizeColumn } from "./components/columns";

const SizesPage = async ({ params }: { params: { storeId: string } }) => {
  const { userId } = auth();
  if (!userId) {
    redirect("/sign-in");
  }
  const sizes = await prismadb.size.findMany({
    where: {
      storeId: params.storeId,
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedCategories: SizeColumn[] = sizes?.map((item) => ({
    id: item.id,
    name: item.name,
    value: item.value,
    createdAt: format(item.createdAt, "MMMM dd, yyyy"),
  }));
  return (
    <div className="flex-col ">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SizeClient data={formattedCategories} />
      </div>
    </div>
  );
};

export default SizesPage;
