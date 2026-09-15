import { Sequelize } from 'sequelize';
import mysql2 from 'mysql2/promise';

// Cấu hình kết nối MySQL với Sequelize
const DB_NAME = process.env.DB_NAME || 'swift_coffee_db';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASS = process.env.DB_PASS || '';
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || 3306;

export const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST,
  port: Number(DB_PORT),
  dialect: 'mysql',
  logging: false, // Set console.log if debugging SQL queries
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

// Tự động tạo database nếu chưa tồn tại
const ensureDatabase = async () => {
  try {
    const connection = await mysql2.createConnection({
      host: DB_HOST,
      port: Number(DB_PORT),
      user: DB_USER,
      password: DB_PASS,
    });
    await connection.execute(
      `CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
    );
    await connection.end();
    console.log(`✅ Database "${DB_NAME}" đã sẵn sàng.`);
  } catch (err) {
    // Bỏ qua nếu không tạo được (đã tồn tại hoặc lỗi khác)
  }
};

export const checkDbConnection = async () => {
  try {
    // Thử tạo DB trước
    await ensureDatabase();

    await sequelize.authenticate();
    console.log('✅ Kết nối MySQL Database thành công qua Sequelize.');
    await sequelize.sync({ alter: true }); // Tự động đồng bộ/cập nhật schema các bảng
    console.log('✅ Đồng bộ schema thành công (alter: true).');
  } catch (error) {
    console.warn('⚠️ Chưa kết nối được MySQL Server (Đang dùng chế độ dữ liệu tạm in-memory cho Payments/Orders):', error.message);
  }
};
