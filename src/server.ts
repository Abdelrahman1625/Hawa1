import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import userRoutes from "./routes/userRoutes";
import driverRoutes from "./routes/driverRoutes";
import vehicleRoutes from "./routes/vehicleRoutes";
import adminRoutes from "./routes/adminRoutes";
import cashPaymentRoutes from "./routes/cashPaymentRoutes";
import profitPaymentRoutes from "./routes/profitPaymentRoutes";
import customerRoutes from "./routes/customerRoutes";
import rideRoutes from "./routes/rideRoutes";
import reviewRoutes from "./routes/reviewRoutes";
import authRoutes from "./routes/authRoutes";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/drivers", driverRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/admins", adminRoutes);
app.use("/api/cashPayments", cashPaymentRoutes);
app.use("/api/profitPayments", profitPaymentRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/rides", rideRoutes);
app.use("/api/reviews", reviewRoutes);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("🚀 Connected to MongoDB successfully");
  } catch (error) {
    console.error("❌ Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
