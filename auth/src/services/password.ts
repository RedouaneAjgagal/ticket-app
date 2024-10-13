import bcrypt from "bcrypt";

export default class Password {
    static async toHash(password: string) {
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);
        return hashedPassword
    }
}