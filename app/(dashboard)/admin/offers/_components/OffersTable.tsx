"use client";

import { offerColumns, offerFields } from "@/utils/OffersFields";
import { EntityTable } from "../../../_components/EntityTable";
import { createOffer, deleteOffer, updateOffer } from "../actions";
import { type Offer } from "@/lib/types";

interface OffersTableProps {
    offers: Offer[];
}

export function OffersTable({ offers }: OffersTableProps) {
    return (
        <EntityTable<Offer>
            title="Offer"
            items={offers}
            columns={offerColumns}
            fields={offerFields}
            onCreate={createOffer}
            onUpdate={updateOffer}
            onDelete={deleteOffer}
        />
    );
}