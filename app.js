// app.js
import express from "express";
import PostsRouter from "./routes/post.router.js";
import CommentRouter from "./routes/comments.router.js";

const app = express();
const PORT = 3017;

app.use(express.json());
app.use("/api", [PostsRouter, CommentRouter]);

app.listen(PORT, () => {
  console.log(PORT, "포트로 서버가 열렸어요!");
});
