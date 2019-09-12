interface Entity {
    id: string;
    name: string;
    address: string;
    username: string;
    quantity: number;
    trackId: string;
    value: number;
    type: string;
    createdAt:string;
    updatedAt:string;
}

interface EntityModal {
    name: string,
    value: string,
    quantity: string
}

interface Supplier {
    address: string;
    name: string;
    type: string;
}