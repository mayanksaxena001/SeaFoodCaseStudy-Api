interface Transact {
    from: string;
    name: string;
    id: string;
    supplier: string;
    quantity: number;
    value: number;
    sensorId: string;
    weight: string;
    place: string;
    latitude: string;
    longitude: string;
    date: Date;
    type: string;
    trackId: string;
    owner: string;
    suppliers: Supplier[];
}