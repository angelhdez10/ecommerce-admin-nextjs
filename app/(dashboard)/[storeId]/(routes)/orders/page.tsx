import { format } from "date-fns";
import prismadb from "@/lib/prismadb";
import OrderClient from "./components/client";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { OrderColumn } from "./components/columns";
import { formatter } from "@/lib/utils";

const OrderPage = async ({ params }: { params: { storeId: string } }) => {
  const { userId } = auth();
  if (!userId) {
    redirect("/sign-in");
  }
  const orders = await prismadb.order.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  console.log(orders);

  const formattedOrders: OrderColumn[] = orders?.map((item) => ({
    id: item.id,
    isPaid: item.isPaid,
    phone: item.phone,
    adress: item.adress,
    products: item.orderItems
      .map((orderItem) => orderItem.product.name)
      ?.join(", "),
    totalPrice: formatter.format(
      item.orderItems.reduce((total, item) => {
        return total + Number(item?.product?.price);
      }, 0),
    ),
    createdAt: format(item.createdAt, "MMMM dd, yyyy"),
  }));
  return (
    <div className="flex-col ">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <OrderClient data={formattedOrders} />
      </div>
    </div>
  );
};

export default OrderPage;
