import express from "express";

import { prisma } from "../utils/prisma/index.js";

const router = express.Router(); // express.Router()를 이용해 라우터를 생성합니다.

/** 댓글 작성 API **/
router.post("/posts/:postId/comments", async (req, res) => {
  const { postId } = req.params;
  const { user, password, content } = req.body;

  // body 또는 params를 입력받지 못한 경우
  if (!user || !password || !content || !postId) {
    return res
      .status(400)
      .json({ message: "데이터 형식이 올바르지 않습니다." });
  }

  try {
    await prisma.comment.create({
      data: {
        user,
        password,
        content,
        postId: Number(postId),
      },
    });
    res.status(200).json({ message: "댓글을 생성하였습니다." });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "서버 오류" });
  }
});

/** 댓글 목록 조회 API **/
router.get("/posts/:postId/comments", async (req, res) => {
  const { postId } = req.params;

  if (!postId) {
    return res
      .status(400)
      .json({ message: "데이터 형식이 올바르지 않습니다." });
  }

  const comments = await prisma.comment.findMany({
    where: { postId: Number(postId) },
  });

  res.status(200).json({ data: comments });
});

/** 댓글 수정 API **/
router.put("/posts/:postId/comments/:commentId", async (req, res) => {
  const { postId, commentId } = req.params;
  const { password, content } = req.body;

  if (!postId || !commentId || !password || !content) {
    return res
      .status(400)
      .json({ message: "데이터 형식이 올바르지 않습니다." });
  }

  const comment = await prisma.comment.findUnique({
    where: { commentId: Number(commentId) },
  });

  if (!comment) {
    return res.status(404).json({ message: "댓글 조회에 실패하였습니다." });
  }

  if (comment.password !== password) {
    return res.status(401).json({ message: "비밀번호가 일치하지 않습니다." });
  }

  await prisma.comment.update({
    where: { commentId: Number(commentId) },
    data: { content },
  });

  res.status(200).json({ message: "댓글을 수정하였습니다." });
});

/** 댓글 삭제 API **/
router.delete("/posts/:postId/comments/:commentId", async (req, res) => {
  const { postId, commentId } = req.params;
  const { password } = req.body;

  if (!postId || !commentId || !password) {
    return res
      .status(400)
      .json({ message: "데이터 형식이 올바르지 않습니다." });
  }

  const comment = await prisma.comment.findUnique({
    where: { commentId: Number(commentId) },
  });

  if (!comment) {
    return res.status(404).json({ message: "댓글 조회에 실패하였습니다." });
  }

  if (comment.password !== password) {
    return res.status(401).json({ message: "비밀번호가 일치하지 않습니다." });
  }

  await prisma.comment.delete({
    where: { commentId: Number(commentId) },
  });

  res.status(200).json({ message: "댓글을 삭제하였습니다." });
});
export default router;
