/**
 * Node modules
 */
import 'dotenv/config';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import express, { NextFunction, Request, Response } from 'express';

/**
 * Import configs
 */
import { connectDB } from './config/connectDB';

/**
 * Import Middlewares
 */
import { errorHandler } from './middlewares/errorHandler';

/**
 * Import Models (to ensure they are registered)
 */
import './models/userModel';
import './models/productModel';
import './models/petModel';
import './models/breedModel';
import './models/colorModel';
import './models/categoryModel';
import './models/orderModel';
import './models/paymentTransactionModel';

/**
 * Routes
 */
import authRoute from './routes/authRoute';
import userRoute from './routes/userRoute';
import productRoute from './routes/productRoute';
import petRoute from './routes/petRoute';
import breedRoute from './routes/breedRoute';
import colorRoute from './routes/colorRoute';
import categoryRoute from './routes/categoryRoute';
import uploadRoute from './routes/uploadRoute';
import staffRoutes from './routes/staffRoutes';
import orderRoute from './routes/orderRoute';
import paymentRoute from './routes/paymentRoute';

/**
 * App
 */
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN,
    credentials: true,
  }),
);
app.use(cookieParser());

app.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.json({
    message: 'Hello',
  });
});

/**
 * PORTS
 */
const PORT = process.env.PORT || 5000;
const BASE_PATH = process.env.BASE_PATH;

/**
 * Routes
 */
app.use(`${BASE_PATH}/auth`, authRoute);
app.use(`${BASE_PATH}/user`, userRoute);
app.use(`${BASE_PATH}/products`, productRoute);
app.use(`${BASE_PATH}/pets`, petRoute);
app.use(`${BASE_PATH}/breeds`, breedRoute);
app.use(`${BASE_PATH}/colors`, colorRoute);
app.use(`${BASE_PATH}/categories`, categoryRoute);
app.use(`${BASE_PATH}/upload`, uploadRoute);
app.use(`${BASE_PATH}/staff`, staffRoutes);
app.use(`${BASE_PATH}/orders`, orderRoute);
app.use(`${BASE_PATH}/payment`, paymentRoute);

/**
 * Error Handler
 */
app.use(errorHandler);

app.listen(PORT, async () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  await connectDB();
});
