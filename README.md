# Lv.2 과제 제출 양식

<aside>
💡 **코드 컨벤션 - 함께 협업하기 위해, 어떤 규칙을 정했나요?**
(예시) 변수명은 CamelCase로 한다.

</aside>

- 변수명/함수명 : Camel case  / ex) camleCase
- 스키마/DB명/import : Pacal Case /  ex) PacalCase
- 암묵적 전역변수는 사용하지 않습니다.
- const를 let보다 먼저 선언합니다.
- 예외처리 (과제로 받음)
- .perttierrc.json

```jsx
{
    "trailingComma": "es5",
    "tabWidth": 2,
    "semi": true,
    "singleQuote": true,
    "arrowParens": "always"
  }
```

<aside>
💡 **역할 분배 - 이번 과제의 역할 분배를 어떻게 했나요?**
(예시) 게시글 삭제 기능 - 선겸, 게시글 수정 기능 - 예지

</aside>

- 솔직히 말해서, 서로 완성한 다음에 코드 리뷰하며 배우기로 했습니다.
- ERD
    
    ![Screenshot 2023-09-03 at 12.26.49 AM.png](Lv%202%20%E1%84%80%E1%85%AA%E1%84%8C%E1%85%A6%20%E1%84%8C%E1%85%A6%E1%84%8E%E1%85%AE%E1%86%AF%20%E1%84%8B%E1%85%A3%E1%86%BC%E1%84%89%E1%85%B5%E1%86%A8%20a87aa12a32ea40ae870d63248a5d9dfb/Screenshot_2023-09-03_at_12.26.49_AM.png)
    

<aside>
💡 **내 페어(페어팀 X)**와 **함께 답변을 적어 제출해주세요.**

</aside>

1. `mongoose`에서 `prisma`로 변경했을 때, 많은 코드 변경이 있었나요? 있었다면 어떤 코드에서 변경사항이 많았나요?
    
    ```
    *스키마 모델이 작성하는 부분에서 간단해서 좋았어요
    *mongoose 스키마에서 prisma 스키마로 변경해서 모델을 작성하는 부분에 코드 변경이 많았다고 생각합니다. 스키마 모델 작성 후 api를 prisma로 변경할 때는 오히려 코드가 간결해져서 좋았습니다.
    ```
    
2. ERD를 먼저 작성 후 개발을 진행했을 때, 좋은점은 어떤것들이 있었나요?
    
    ```
    *이미 짜여져 있는 데이터 타입에 메소드만 수정함으로서 손쉽고 빠르게 백엔드를 구현할 수 있었습니다. 
    *ERD가 먼저 작성된 상태에서는 ERD 그대로 스키마의 코드를 작성해주면 됐기 때문에 편했습니다. 그리고 ERD 를 설계할 때 부터 api를 어떤식으로 구현하면 좋을지도 염두해두고 구성했기 때문에 api구현을 조금은 수월하게 진행 할 수 있었습니다.
    ```
    
3. **게시글 조회**와 **댓글 조회 API** Response를 어떻게 구성하였나요? 왜 그렇게 구성하였나요?
    
    ```
    //게시글 조회
    router.get("/", async (req, res) => {
      const posts = await prisma.posts.findMany({
            orderBy: {
              createdAt: 'desc'
            },
            select: {
              postId: true,
              user: true,
              title: true,
              createdAt: true
            }
      })
      return res.status(200).json({ data: posts });
    });
    
    조회는 특별한 제약없이 진행이 가능해야했습니다. 그래서 크게 에러 처리 해야하는 부분은 보이지 않았고 바로 mysql에서 조회한 후 가져온 데이터들을 반환해주는 식으로 구성했습니다. 생성 날짜별 내림차순 정렬을 진행할 때는 DB에서 데이터를 오면서 같이 처리하게 했는데, DB에서 정렬되지 않은 데이터를 가져와 js언어로 처리하는 것보다 DB에서 처리하는 게 속도가 더 빠르고 이 게시글 조회 api에서는 복잡한 조건의 query문이 필요한게 아니다 보니 코드적으로 간결해서 DB에서 처리하게 구성했습니다.
    ```
    
    ```
    **댓글 조회 부분 :** 
    **1. API Endpoint 정의**
    
    router.get("/posts/:postId/comments", async (req, res) => {
    HTTP 메서드 GET을 사용하고, /posts/:postId/comments 형태의 URL 패턴을 가진 API를 정의합니다.
    :postId는 URL에서 변수처럼 작동하여 클라이언트로부터 넘어온 값을 저장합니다.
    **2. Request Params 추출**
    
    const { postId } = req.params;
    req.params를 통해 URL에서 postId 값을 추출합니다.
    **3. Validation**
    
    if (!postId) {
      return res
        .status(400)
        .json({ message: "데이터 형식이 올바르지 않습니다." });
    }
    postId 값이 존재하지 않는 경우, HTTP 상태 코드 400을 반환하며 JSON 형태의 에러 메시지를 응답합니다.
    **4. Prisma Query**
    
    const comments = await prisma.comment.findMany({
      where: { postId: **Number(postId)** },
    });
    Prisma를 사용해서 해당 postId에 연관된 모든 댓글을 찾습니다.
    Number(postId)로 postId를 숫자 형태로 변환한 후, 이를 쿼리에 사용합니다.
    **5. Response**
    ```
    res.status(200).json({ data: comments });
    ```
    검색된 댓글(comments)을 HTTP 상태 코드 200과 함께 JSON 형태로 반환합니다.
    요약
    GET /posts/:postId/comments 형태의 URL을 갖는 API 엔드포인트를 정의합니다.
    URL에서 postId 값을 추출합니다.
    postId가 없으면, 400 Bad Request와 에러 메시지를 반환합니다.
    Prisma를 통해 해당 postId에 해당하는 댓글을 모두 검색합니다.
    검색된 댓글을 200 OK 상태와 함께 반환합니다.
    ```
