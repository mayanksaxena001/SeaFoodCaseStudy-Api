interface BinanceCred {
    api_key: String;
    api_secret: String;
    pairs: string;//fav pairs seperated by comma
    base_currency: String;
    canTrade: Boolean;
    use_server_time: Boolean;
    authenticated: Boolean;
}

interface AccountBalance {
    asset: String;
    free: String;
    locked: String;
    selected: boolean;
}

interface MyTrade {
    id: String;
    binance_id: String;
    order_id: String;
    client_order_id: String;
    symbol: String;
}

export { MyTrade, AccountBalance, BinanceCred }