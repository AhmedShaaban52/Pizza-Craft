import { type ColumnDef } from "@/app/(dashboard)/_components/EntityTable";
import { type ModalField } from "@/lib/types";

export type AdminOrder = {
  id: string;
  userId: string;
  stripeSessionId: string;
  stripePaymentIntent: string | null;
  status: string | null;
  total: string;
  createdAt: Date;
  updatedAt: Date;
};

export const orderColumns: ColumnDef<AdminOrder>[] = [
  {
    key: "id",
    label: "Order ID",
    render: (item) => `#PC-${item.id.slice(0, 4).toUpperCase()}`,
  },
  {
    key: "createdAt",
    label: "Date",
    render: (item) =>
      new Date(item.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
  },
  {
    key: "userId",
    label: "Customer",
    render: (item) => `${item.userId.slice(0, 12)}…`,
  },
  {
    key: "total",
    label: "Total",
    render: (item) => `$${Number(item.total).toFixed(2)}`,
  },
  {
    key: "status",
    label: "Status",
    type: "badge",
  },
];

export const OrderFields: ModalField[] = [
  {
    name: "status",
    label: "Order Status",
    type: "select",
    required: true,
    colSpan: 2,
    options: [
      { label: "Pending", value: "pending" },
      { label: "Paid", value: "paid" },
      { label: "Prepared", value: "prepared" },
      { label: "In Transit", value: "in_transit" },
      { label: "Delivered", value: "delivered" },
      { label: "Cancelled", value: "cancelled" },
      { label: "Refunded", value: "refunded" },
    ],
  },
];
