import express from 'express';
import cors from 'cors';
import diagnosisRoutes from "./routes/diagnosis.route";
import reportRoutes from "./routes/report.route";
import chatRouters from "./routes/chat.route";
import drugRoutes from "./routes/medicine.route";
import path from 'path';

const __dirname = path.resolve();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/diagnosis", diagnosisRoutes);
app.use("/api/report", reportRoutes);
app.use("/api/chat", chatRouters);
app.use("/api/medicine", drugRoutes);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'templates', 'index.html'));
});

app.get('/chat', (req, res) => {
  res.sendFile(path.join(__dirname, 'templates', 'chat.html'));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});