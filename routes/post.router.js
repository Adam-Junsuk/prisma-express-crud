import express from 'express';

import { prisma } from '../utils/prisma/index.js';

const router = express.Router(); // express.Router()를 이용해 라우터를 생성합니다.

// 게시글 작성 API
router.post('/', async (req, res) => {
  const { user, password, title, content } = req.body;

  // 입력값 검증
  if (!user || !password || !title || !content) {
    return res
      .status(400)
      .json({ message: '데이터 형식이 올바르지 않습니다.' });
  }

  try {
    // Prisma를 이용한 게시글 생성
    const post = await prisma.post.create({
      data: {
        user,
        password,
        title,
        content,
      },
    });

    // 성공적으로 게시글이 생성된 경우
    return res.status(201).json({ message: '게시글을 생성하였습니다.' });
  } catch (error) {
    // 서버 내부 에러 처리
    console.error(error);
    return res.status(500).json({ message: '서버 에러' });
  }
});
// 전체 게시글 조회 - prisma
router.get('/', async (req, res, next) => {
  try {
    const posts = await prisma.post.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        postId: true,
        user: true,
        title: true,
        createdAt: true,
      },
    });
    res.status(200).json({ data: posts });
  } catch (error) {
    console.error('Error fetching posts:', error);
    next(error);
  }
});
// 게시글 상세 조회 - prisma
router.get('/:postId', async (req, res) => {
  const { postId } = req.params;

  // postId가 정수가 아닐 경우 예외 처리
  if (isNaN(postId)) {
    return res
      .status(400)
      .json({ message: '데이터 형식이 올바르지 않습니다.' });
  }

  try {
    const post = await prisma.post.findUnique({
      where: {
        postId: parseInt(postId),
      },
      select: {
        postId: true,
        user: true,
        title: true,
        content: true,
        createdAt: true,
      },
    });

    // 게시글이 없을 경우 예외 처리
    if (!post) {
      return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
    }

    res.status(200).json({ data: post });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '서버 에러' });
  }
});

// 게시글 삭제 API
router.delete('/:postId', async (req, res) => {
  const { postId } = req.params;
  const { password } = req.body;

  // postId와 password가 정확하게 입력되었는지 확인
  if (isNaN(postId) || !password) {
    return res
      .status(400)
      .json({ message: '데이터 형식이 올바르지 않습니다.' });
  }

  try {
    // postId로 게시글 조회
    const post = await prisma.post.findUnique({
      where: {
        postId: parseInt(postId),
      },
    });

    // postId에 해당하는 게시글이 없을 경우
    if (!post) {
      return res.status(404).json({ message: '게시글 조회에 실패하였습니다.' });
    }

    // 입력된 비밀번호와 게시글의 비밀번호가 일치할 경우
    if (post.password === password) {
      await prisma.post.delete({
        where: {
          postId: parseInt(postId),
        },
      });
      return res.json({ message: '게시글을 삭제하였습니다.' });
    } else {
      return res.status(403).json({ message: '비밀번호가 일치하지 않습니다.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '서버 오류입니다.' });
  }
});

/** 게시글 수정 API **/
router.put('/:postId', async (req, res) => {
  const { postId } = req.params;
  const { title, content, password } = req.body;

  // body 또는 params를 입력받지 못한 경우
  if (!postId || !title || !content || !password) {
    return res
      .status(400)
      .json({ message: '데이터 형식이 올바르지 않습니다.' });
  }

  try {
    const post = await prisma.post.findUnique({
      where: { postId: Number(postId) },
    });

    // postId에 해당하는 게시글이 존재하지 않을 경우
    if (!post) {
      return res.status(404).json({ message: '게시글 조회에 실패하였습니다.' });
    }

    // 입력된 비밀번호와 게시글의 비밀번호가 일치하는지 확인
    if (post.password !== password) {
      return res.status(401).json({ message: '비밀번호가 일치하지 않습니다.' });
    }

    // 게시글 수정
    await prisma.post.update({
      where: { postId: Number(postId) },
      data: { title, content },
    });

    return res.status(200).json({ message: '게시글을 수정하였습니다.' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: '서버 오류' });
  }
});

export default router;
