"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency, formatNumber, sizeFormatter } from "@/lib/formatter";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";
import { CheckCircle2, CircleAlert, MoreVertical, XCircle } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useTransition } from "react";
import {
  deleteProduct,
  toggleProductAvailability,
} from "@/app/_actions/products";

const ProductsTable = ({ products, sort, order }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const toggleSort = (field) => {
    const isSameField = sort === field;
    const newOrder = isSameField && order === "asc" ? "desc" : "asc";

    const params = new URLSearchParams(searchParams);
    params.set("sort", field);
    params.set("order", newOrder);

    router.push(`?${params.toString()}`);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead
            className="flex gap-1 items-center cursor-pointer select-none"
            onClick={() => toggleSort("isAvailableForPurchase")}
          >
            <span className="sr-only">Available For Purchase</span>
            <CircleAlert className="stroke-amber-500" />
            {sort === "isAvailableForPurchase" && (order === "asc" ? "↑" : "↓")}
          </TableHead>
          <TableHead
            onClick={() => toggleSort("name")}
            className="cursor-pointer select-none"
          >
            Name {sort === "name" && (order === "asc" ? "↑" : "↓")}
          </TableHead>
          <TableHead
            onClick={() => toggleSort("priceInCents")}
            className="cursor-pointer select-none"
          >
            Price {sort === "priceInCents" && (order === "asc" ? "↑" : "↓")}
          </TableHead>
          <TableHead
            onClick={() => toggleSort("order")}
            className="cursor-pointer select-none"
          >
            Orders {sort === "order" && (order === "asc" ? "↑" : "↓")}
          </TableHead>
          <TableHead>Size</TableHead>
          <TableHead className="w-0">
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => {
          const fileSize = product.fileSize;
          const size = sizeFormatter(fileSize);

          return (
            <TableRow key={product.id}>
              <TableCell>
                {product.isAvailableForPurchase ? (
                  <CheckCircle2 className="stroke-green-800" />
                ) : (
                  <XCircle className="stroke-destructive" />
                )}
              </TableCell>
              <TableCell>{product.name}</TableCell>
              <TableCell>
                {formatCurrency(product.priceInCents / 100)}
              </TableCell>
              <TableCell>{formatNumber(product._count.orders)}</TableCell>
              <TableCell>{size}</TableCell>
              <TableCell>
                <TableDropDown product={product} />
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};
export default ProductsTable;

const TableDropDown = ({ product }) => {
  const [isAvailableForPurchasePending, startAvailableForPurchaseTransition] =
    useTransition();
  const [isDeletePending, startDeleteTransition] = useTransition();

  const onDeleteProduct = async () => {
    if (confirm(`Are you sure you want to delete ${product.name}`)) {
      startDeleteTransition(async () => {
        await deleteProduct(product.id);
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <MoreVertical />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <a download href={`/admin/products/${product.id}/download`}>
          <DropdownMenuItem className="cursor-pointer">
            Download
          </DropdownMenuItem>
        </a>

        <Link href={`/admin/products/${product.id}/edit`}>
          <DropdownMenuItem className="cursor-pointer">Edit</DropdownMenuItem>
        </Link>

        <DropdownMenuItem
          disabled={isAvailableForPurchasePending}
          onClick={() => {
            startAvailableForPurchaseTransition(async () => {
              await toggleProductAvailability(
                product.id,
                !product.isAvailableForPurchase
              );
            });
          }}
        >
          {product.isAvailableForPurchase ? "Deactivate" : "Activate"}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          disabled={isDeletePending}
          onClick={onDeleteProduct}
          className="text-destructive! hover:text-white! hover:bg-amber-700! "
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
