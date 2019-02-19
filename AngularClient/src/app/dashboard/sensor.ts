interface Sensor {
    id: string;
    name: string;
    address: string;
    trackId: string;
    status: string;
    updatedAt:Date;
    createdAt:Date;
    supplierName:string;
}

interface SensorModal {
    address: string;
    name: string;
}


interface Telemetry {
    id: string;
    sensorId: string;
    weight: number;
    temperature: number;
    latitude: string;
    longitude: string;
    place: string;
    updatedAt:string;
}