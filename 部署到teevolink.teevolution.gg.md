# 把 TeevoLink v2 发布到 teevolink.teevolution.gg

域名不用改，还是：**https://teevolink.teevolution.gg**

做法：用 **同一个 Vercel 项目 + 同一个 GitHub 仓库**，把代码换成 `teevolink-v2` 里的内容，再部署一次。

---

## 方式一：直接替换原仓库（最常见）

1. 打开你 **线上 teevolink 用的 GitHub 仓库**（Vercel 里能看到仓库名）。
2. 用本文件夹 `teevolink-v2` 里的**全部文件**覆盖仓库（或删掉旧代码，只保留 v2）。
3. 提交并 push 到 GitHub（main 分支）。
4. 打开 [Vercel 控制台](https://vercel.com) → 找到 **teevolink** 项目 → 等自动部署完成。
5. 浏览器打开 **https://teevolink.teevolution.gg**，用 Chrome + 真鼠标测试。

**Vercel 构建设置（一般不用改）：**

| 项 | 值 |
|----|-----|
| Framework | Vite |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Install Command | `npm install` |

---

## 方式二：仓库在「Cyrus Cursor」子文件夹里

若 GitHub 根目录不是 `teevolink-v2`，在 Vercel → Project → Settings → General → **Root Directory** 填：

`teevolink-v2`

保存后重新 Deploy。

---

## 本机先测（可选）

```bash
cd teevolink-v2
npm install
npm run dev
```

打开 http://localhost:5173 测通后再 push 上线。

---

## 测试时注意

- 必须用 **Chrome 或 Edge**
- 必须 **HTTPS**（teevolink.teevolution.gg 已是 HTTPS，可以）
- 插上 Terra Pro，点连接，允许访问 HID 设备
- USB 编号已配置：**VID 0x3554，PID 0xF516**

---

## 上线后还是连不上？

1. Vercel 部署是否成功（绿色 Ready）
2. 浏览器强制刷新：Ctrl + F5
3. 确认鼠标/接收器已插入，且和 v1 是同一套硬件
