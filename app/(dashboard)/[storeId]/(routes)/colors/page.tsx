import { format } from "date-fns";
import prismadb from "@/lib/prismadb";
import ColorClient from "./components/client";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { ColorsColumn } from "./components/columns";

const ColorsPage = async ({ params }: { params: { storeId: string } }) => {
  const { userId } = auth();
  if (!userId) {
    redirect("/sign-in");
  }
  const colors = await prismadb.color.findMany({
    where: {
      storeId: params.storeId,
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedCategories: ColorsColumn[] = colors?.map((item) => ({
    id: item.id,
    name: item.name,
    value: item.value,
    createdAt: format(item.createdAt, "MMMM dd, yyyy"),
  }));
  return (
    <div className="flex-col ">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ColorClient data={formattedCategories} />
      </div>
    </div>
  );
};

export default ColorsPage;
