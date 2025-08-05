const express = require('express');
const app = express();

const PORT = 3000;

app.use(express.json());

let posts = [
    {
        id: 1,
        displayId: 1,
        subject: "subject-1",
        desc: "desc-1",
        createdAt: "2025-08-01",
        status: "draft",
        likes: 0
    },
    {
        id: 2,
        displayId: 2,
        subject: "subject-2",
        desc: "desc-2",
        createdAt: "2025-08-01",
        status: "published",
        likes: 3
    },
    {
        id: 3,
        displayId: 3,
        subject: "subject-3",
        desc: "desc-3",
        createdAt: "2025-08-01",
        status: "archived",
        likes: 1
    }
];

let initId = 4;

app.get("/posts", (req, res) => {
    try {

        res.status(201).json({ message: "게시글 전체 조회 완료", posts })
    } catch (error) {
        console.error("게시글 전체 조회 중 오류", error)
        res.status(500).json({ message: "서버 오류" })
    }
})

app.get("/posts/:id", (req, res) => {
    try {
        const postId = Number(req.params.id);
        const index = posts.findIndex(b => b.id === postId)

        if (index === -1) {
            return res.status(404).json({ message: "게시글 없음" })
        }

        return res.status(201).json({
            message: "게시글 1개 조회 완료", post: posts[index]
        });
    } catch (error) {
        console.error("게시글 조회 중 오류", error);
        res.status(500).json({ message: "서버 오류" })
    }
})

app.post('/posts', (req, res) => {
    try {
        const { subject, desc } = req.body;

        if (
            typeof subject !== 'string' || subject.trim() === '' ||
            typeof desc !== 'string' || desc.trim() === ''
        ) {
            return res.status(400).json({ message: "subject, desc는 비워있지 않은 문자열이어야 합니다." });
        }

        const newPost = {
            id: initId++,
            displayId: posts.length + 1,
            subject: subject.trim(),
            desc: desc.trim(),
            createdAt: new Date().toISOString(),
            status: "draft",
        }

        posts.push(newPost)

        res.status(201).json({ message: "게시글 생성 완료", posts })
    } catch (error) {
        console.error("게시글 생성 중 오류", error);
        res.status(500).json({ message: "서버 오류" })
    }
})

app.put("/posts/:id", (req, res) => {
    try {
        const postId = Number(req.params.id)
        const index = posts.findIndex(b => b.id === postId)

        if (index === -1) {
            return res.status(404).json({ message: "게시글 없음" })
        }

        const updatePost = req.body;

        posts[index] = {
            ...posts[index],
            ...updatePost
        };

        return res.status(201).json({
            message: "게시글 1개 수정 완료",
            post: posts[index]
        });
    } catch (error) {
        console.error("게시글 1개 수정 중 오류", error)
        res.status(500).json({ message: "서버 오류" })
    }
})


app.patch("/posts/:id/status", (req, res) => {
    try {
        const postId = Number(req.params.id);
        const index = posts.findIndex(p => p.id === postId);

        if (index === -1) {
            return res.status(404).json({ message: "게시글 없음" });
        }

        const { status } = req.body;

        const ALLOWED = ["draft", "published", "archived"];

        if (!ALLOWED.includes(status)) {
            return res.status(400).json({
                message: `status는 ${ALLOWED.join(", ")} 중 하나여야 합니다.`
            });
        }

        posts[index] = {
            ...posts[index],
            status: status.trim()
        };

        res.status(201).json({ message: "게시글 상태 수정 완료", post: posts[index] })

    } catch (error) {
        console.error("게시글 상태 수정 중 오류", error)
        res.status(500).json({ message: "서버 오류" })
    }
})

app.delete("/posts/:id", (req, res) => {
    try {
        const postId = Number(req.params.id)
        const index = posts.findIndex(b => b.id === postId)
        if (index === -1) {
            return res.status(404).json({ message: "게시글 없음" })
        }


        posts.splice(index, 1)

        return res.status(201).json({ message: "게시글1개 삭제 완료", posts })
    } catch (error) {
        console.error("게시글 1개 삭제 중 오류", error)
        res.status(500).json({ message: "서버 오류" })
    }
})

