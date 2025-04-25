import UserModel from "./UserModel";

export async function getUserFromAuth(authHeader: string | undefined): Promise<UserModel | undefined> {
    if (!authHeader) return undefined;
    const auth = Buffer.from(authHeader.substring(6), 'base64').toString().split(':');
    const username = auth[0], password = auth[1];
    const users = await UserModel.findAll()
    return users.find((u) => u.username == username && u.password == password)
}