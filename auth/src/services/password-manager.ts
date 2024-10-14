import bcrypt from "bcrypt";

export default class PasswordManager {
    static async toHash(password: string) {
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);
        return hashedPassword
    }

    static async compare(password: string, hashedPassword: string) {
        const isCorrectPassword = await bcrypt.compare(password, hashedPassword);
        return isCorrectPassword;
    }
}