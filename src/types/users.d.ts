type User = {
    userId: number,
    token: string
}

type FullUser = {
    firstName: string,
    lastName: string,
    email: string
}

type UserUpdate = {
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    currentPassword: string
}