interface Login {
    username: string;
    password: string;
}

interface Token {
    auth: boolean;
    token: string;
}

interface Signup {
    name: string;
    email: string;
    username: string;
    password: string;
    type: string;
}

interface User {
    id: string;
    name: string;
    email: string;
    username: string;
    account: string;
    type: string;
    balance: number;
    active: boolean;
}