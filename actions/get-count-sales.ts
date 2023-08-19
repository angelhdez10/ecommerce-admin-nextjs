import prismadb from "@/lib/prismadb";

export const getCountSales = async (storeId: string) => {
  const paidOrders = await prismadb?.order?.count({
    where: {
      isPaid: true,
      storeId,
    },
  });

  return paidOrders;
};
