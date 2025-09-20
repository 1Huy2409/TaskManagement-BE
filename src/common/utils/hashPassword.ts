import * as bcrypt from "bcrypt";
export const hashPassword = async (rawPassword: string): Promise<string> => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(rawPassword, salt);
    return hash;
}
export const comparePassword = async (inputPassword: string, hashPassword: string): Promise<boolean> => {
    const result: boolean = await bcrypt.compare(inputPassword, hashPassword);
    return result;
}