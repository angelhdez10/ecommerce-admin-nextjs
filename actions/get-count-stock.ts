import prismadb from "@/lib/prismadb";

export const getCountStock = async (storeId: string) => {
  const productsAvailable = await prismadb?.product?.count({
    where: {
      isArchived: false,
      storeId,
    },
  });

  return productsAvailable;
};
