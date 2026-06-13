"use client";

import { EntityTable } from "../../../_components/EntityTable";
import { createProduct, deleteProduct, updateProduct } from "../actions";
import { productColumns, getProductFields, type ProductWithCategory } from "@/utils/ProductsFields";
import { type Category } from "@/lib/types";

interface ProductsTableProps {
    products: ProductWithCategory[];
    categories: Category[];
}

export function ProductsTable({ products, categories }: ProductsTableProps) {
    return (
        <EntityTable<ProductWithCategory>
            title="Product"
            items={products}
            columns={productColumns}
            fields={getProductFields(categories)}
            onCreate={createProduct}
            onUpdate={updateProduct}
            onDelete={deleteProduct}
        />
    );
}