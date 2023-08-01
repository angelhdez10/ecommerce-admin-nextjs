import { format } from "date-fns";
import prismadb from "@/lib/prismadb";
import ProductClient from "./components/client";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { ProductsColumn } from "./components/columns";
import { formatter } from "@/lib/utils";

const ProductsPage = async ({ params }: { params: { storeId: string } }) => {
  const { userId } = auth();
  if (!userId) {
    redirect("/sign-in");
  }
  const products = await prismadb.product.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      category: true,
      size: true,
      color: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedCategories: ProductsColumn[] = products?.map((item) => ({
    id: item.id,
    name: item.name,
    isFeatured: item.isFeatured,
    isArchived: item.isArchived,
    category: item.category.name,
    color: item.color.value,
    size: item.size.value,
    price: formatter.format(item.price?.toNumber()),
    createdAt: format(item.createdAt, "MMMM dd, yyyy"),
  }));
  return (
    <div className="flex-col ">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductClient data={formattedCategories} />
      </div>
    </div>
  );
};

export default ProductsPage;
