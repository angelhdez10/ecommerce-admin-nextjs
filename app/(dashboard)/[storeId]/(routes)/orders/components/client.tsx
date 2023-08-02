"use client";
import { Heading } from "@/components/ui/heading";
import { DataTable } from "@/components/ui/data-table";
import { OrderColumn, columns } from "./columns";

interface OrderClientProps {
  data: OrderColumn[];
}

const OrderClient: React.FC<OrderClientProps> = ({ data }) => {
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Orders (${data?.length})`}
          description="Manage orders for your store"
        />
      </div>
      <DataTable searchKey="createdAt" columns={columns} data={data} />
    </>
  );
};

export default OrderClient;
