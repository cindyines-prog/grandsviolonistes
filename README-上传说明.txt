小提琴聆听 PWA — GitHub Pages 上传说明

1. 解压 ZIP。
2. 打开现有 GitHub 仓库，进入当前 index.html 所在的文件夹。
3. 上传 index.html、app.js、lessons.json、sw.js、manifest.webmanifest，以及整个 icons 文件夹（保持相对路径）。
4. Commit changes，等待 GitHub Pages 部署。
5. 手机与海外版小米平板分别用 Chrome 打开原网站，菜单中选择“安装应用”。

注意：不要只上传 ZIP；GitHub Pages 需要解压后的文件。
注意：如果原网站在仓库根目录，就把这些文件放在根目录。

每周增加课程：
- 编辑 lessons.json，按照已有 weeks 的结构追加一位演奏家（5个 days）。
- 修改 version 字段，例如 2026-10-19。
- 只上传更新后的 lessons.json 到同一目录即可。
- 已安装的 PWA 在线打开时会获取新课程，也可以点击“检查新课程”。
- 这一步不会自动撰写/发布课程：每周需提供新的课程数据并提交到 GitHub。

当前已包含13位演奏家、65课；全部可立即使用，孩子按自己的速度学习。
学习完成记录与笔记仅保存在各设备本地，不会自动跨设备同步。
独立7:30推送通知尚未配置；需要另外部署推送服务和定时任务。
外部 YouTube 视频需要网络。
如果安装选项未出现，先确认 Pages 已部署、用 HTTPS 打开、Chrome 已更新。
