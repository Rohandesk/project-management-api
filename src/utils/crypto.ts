import bcrypt from "bcryptjs";

const SALT_ROUNDS = 12; // 10-12 is standard; higher means slower/more secure

export async function hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, SALT_ROUNDS);
}

export async function comparePassword(password: string, storedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, storedPassword);
}