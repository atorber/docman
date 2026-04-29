import express from 'express';
import cors from 'cors';
import documentRoutes from './routes/document';
import diagnoseRoutes from './routes/diagnose';
import promptRoutes from './routes/prompt';
import prdReviewRoutes from './routes/prdReview';
import recordsRoutes from './routes/records';
import financeRoutes from './routes/finance';
import researchRoutes from './routes/research';

const app = express();
const PORT = process.env.PORT || 3001;

// 中间件
app.use(cors());
app.use(express.json());

// 路由
app.use('/api/documents', documentRoutes);
app.use('/api/diagnoses', diagnoseRoutes);
app.use('/api/prompt', promptRoutes);
app.use('/api/prd-review', prdReviewRoutes);
app.use('/api/records', recordsRoutes);
app.use('/api/finance', financeRoutes);
app.use('/api/research', researchRoutes);

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 启动服务
app.listen(PORT, () => {
  console.log(`文档诊断服务已启动: http://localhost:${PORT}`);
});

export default app;