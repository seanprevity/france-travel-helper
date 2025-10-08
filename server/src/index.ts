import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import "../drizzle/relations";
import userRoutes from "./routes/userRoutes";
import bookmarkRoutes from "./routes/bookmarkRoutes";
import cityRoutes from "./routes/cityRoutes";
import descriptionRoutes from "./routes/descriptionRoutes";

dotenv.config();

const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.get("/", (req, res) => {
  res.send("This is the home route.");
});

app.use("/users", userRoutes);
app.use("/bookmarks", bookmarkRoutes);
app.use("/cities", cityRoutes);
app.use("/descriptions", descriptionRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
