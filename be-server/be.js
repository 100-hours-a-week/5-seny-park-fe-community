import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
// commonJS로 변경하기
// const express = require("express");
// const cors = require("cors");
// const fs = require("fs");
// const path = require("path");
// const { fileURLToPath } = require("url");
// const bodyParser = require("body-parser");

// const usersRouter = require("./routes/users.router");
// const postsRouter = require("./routes/posts.router");

const PORT = 4000;

const app = express();
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.use(bodyParser.json());
// app.use("/users", usersRouter);
// app.use("/posts", postsRouter);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fileUsersPath = path.join(__dirname, "./models/users.model.json");

app.post("/users/signin", (req, res) => {
  const { email, password, nickname } = req.body;
  console.log(`Email: ${email}, Password: ${password}, Nickname: ${nickname}`);

  fs.readFile(fileUsersPath, "utf-8", (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send("사용자 정보를 읽어오는데 실패했습니다.");
    }

    const users = JSON.parse(data); // JSON 형식의 문자열을 객체로 변환
    console.log(users);
    const emailExists = users.some((user) => user.email === email); // 중복 이메일 체크
    const nicknameExists = users.some((user) => user.nickname === nickname); // 중복 닉네임 체크
    if (emailExists || nicknameExists) {
      return res.json({ emailExists, nicknameExists });
    }

    users.push({
      user_id: users.length + 1,
      email: email,
      password: password,
      nickname: nickname,
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: null,
      auth_token: null,
    });

    fs.writeFile(fileUsersPath, JSON.stringify(users), (err) => {
      if (err) {
        console.error(err);
        return;
      }
      res.status(201).json({ message: "회원가입성공" });
    });
  });
});

app.listen(PORT, () => {
  console.log(`앱이 포트 ${PORT}에서 실행 중입니다.`);
});