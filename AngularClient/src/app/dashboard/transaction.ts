interface Transaction {
    to: string;
    from: string;
    supplier: string;
    id: string;
    assetName: string;
    amount: number;
    updatedAt: string;
    assetId: string;
    sensorId: string;
    status: string;
    action: string;
    fromUsername: string;
    toUsername: string;
}

interface UpdateTransactionModal {
    address: string,
    transactionId: string,
    sensorId: string,
    action: string
}

interface TransferTokenModal {
    to: string; // account address
    // holders:string[],
    value: number;
}

interface Account {
    fullName: string;
    account: string;
}