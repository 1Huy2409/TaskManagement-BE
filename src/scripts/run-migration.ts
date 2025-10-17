import { AppDataSource } from "@/config/db.config";

async function runMigrations() {
    try {
        await AppDataSource.initialize();
        console.log('Data Source đã được khởi tạo!');

        await AppDataSource.runMigrations();
        console.log('✅ Migrations đã chạy thành công!');

        await AppDataSource.destroy();
    } catch (error) {
        console.error('❌ Lỗi khi chạy migrations:', error);
        process.exit(1);
    }
}
runMigrations();