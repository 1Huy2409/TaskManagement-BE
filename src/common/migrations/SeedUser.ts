import type { MigrationInterface, QueryRunner } from "typeorm"
import { User } from "../entities/user.entity"
import { hashPassword, comparePassword } from "../utils/handlePassword"
export class SeedUsers1726851200000 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const userRepository = queryRunner.connection.getRepository(User)

        const users = [
            {
                fullname: "Nguyen Van A",
                username: "1Huy2409",
                email: "vana2409@gmail.com",
                password: await hashPassword('nhathuy2409')
            },
            {
                fullname: "Nguyen Van B",
                username: "1Huy2005",
                email: "vanb2409@gmail.com",
                password: await hashPassword('nhathuy2409')
            },
        ]

        for (const userData of users) {
            const existingUser = await userRepository.findOne({
                where: [
                    { username: userData.username },
                    { email: userData.email }
                ]
            })

            if (!existingUser) {
                const user = userRepository.create(userData)
                await userRepository.save(user)
                console.log(`Created user: ${userData.username}`)
            }
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // const userRepository = queryRunner.connection.getRepository(User)

        // // Xóa users đã seed (optional)
        // await userRepository.delete({
        //     username: ["admin", "johndoe", "janesmith"]
        // })
    }
}