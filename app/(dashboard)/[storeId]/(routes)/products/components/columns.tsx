"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import { Check } from "lucide-react";

export type ProductsColumn = {
  id: string;
  name: string;
  isFeatured: boolean;
  isArchived: boolean;
  category: string;
  color: string;
  size: string;
  createdAt: string;
};

export const columns: ColumnDef<ProductsColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },

  {
    accessorKey: "isFeatured",
    header: "Featured",
    cell: ({ row }) => row.original.isFeatured && <Check className="w-4 h-4" />,
  },
  {
    accessorKey: "isArchived",
    header: "Archived",
    cell: ({ row }) => row.original.isArchived && <Check className="w-4 h-4" />,
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "color",
    header: "Color",
    cell: ({ row }) => (
      <div className="flex items-center gap-x-2">
        <div
          className="w-4 h-4 rounded-full"
          style={{ backgroundColor: row.original.color }}
        />
        <p>{row.original.color}</p>
      </div>
    ),
  },
  {
    accessorKey: "size",
    header: "Size",
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
