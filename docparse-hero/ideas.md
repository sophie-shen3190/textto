# DocParse Hero 设计方案

## 方案一：精密仪器风（Precision Instrument）
- **Design Movement**: Swiss Grid + Scientific Dashboard
- **Core Principles**: 精密、可信赖、数据驱动、工程美学
- **Color Philosophy**: 主白底 #FAFAFA，主蓝 #1A56DB（深邃科技蓝），辅助色 #10B981（成功绿，用于精度数字），边框 #E5E7EB
- **Layout Paradigm**: 左侧文字+上传区，右侧垂直滚动的解析结果预览卡片；非对称两栏布局
- **Signature Elements**: 细线网格背景纹理；数字精度计数器动画；代码块展示 JSON 输出
- **Interaction Philosophy**: 拖拽上传时有精准的虚线框动画；结果卡片有轻微的 stagger 入场
- **Animation**: 数字从 0 滚动到 99.5%；卡片从右侧滑入
- **Typography**: IBM Plex Mono（代码/数字）+ Inter（正文）

## 方案二：极简纸张风（Paper Minimalism）
- **Design Movement**: Bauhaus + Editorial Design
- **Core Principles**: 留白即设计、内容优先、克制的色彩
- **Color Philosophy**: 纯白底，唯一强调色 #2563EB（蓝），大量留白
- **Layout Paradigm**: 居中单栏，文字极大，上传区悬浮在文字下方
- **Signature Elements**: 超大字号 H1；极细边框卡片
- **Interaction Philosophy**: 极简 hover 效果，几乎无动画
- **Animation**: 仅有 fade in
- **Typography**: Playfair Display（H1）+ Inter（正文）

## 方案三：控制台终端风（Terminal Console）⭐ 选定方案
- **Design Movement**: Developer Tool + Glassmorphism Light
- **Core Principles**: 专业、高效、开发者友好、科技感十足
- **Color Philosophy**: 
  - 背景：极浅灰 #F8FAFC（几乎白色）
  - 主色：深海蓝 #0F172A（文字/强调）
  - 品牌蓝：#2563EB（按钮/高亮）
  - 成功绿：#059669（精度数字/badge）
  - 代码区：#F1F5F9（浅蓝灰底）
  - 边框：#E2E8F0
- **Layout Paradigm**: 
  - 左侧 55%：标题文案 + 上传区（虚线拖拽框）+ 格式标签
  - 右侧 45%：模拟解析结果展示（Markdown/JSON Tab 切换）
  - 整体非对称，右侧卡片略高于左侧，产生层次感
- **Signature Elements**: 
  1. 右侧解析结果卡片带有 Tab 切换（Markdown / JSON）
  2. 顶部一行滚动的 badge："PDF · Word · Excel · PPT · Image · HTML · TXT"
  3. 精度数字 "99.5%" 用绿色大字突出
- **Interaction Philosophy**: 上传区 hover 时边框变蓝并有轻微 scale；结果卡片有代码高亮
- **Animation**: 入场时左侧文字从左 fade-in，右侧卡片从右 fade-in；数字 counter 动画
- **Typography**: Space Grotesk（H1/H2，有科技感的几何无衬线）+ Inter（正文）

## 选定方案：方案三 - 控制台终端风
理由：最符合"科技感和专业感十足"的要求，同时保持浅色主题，左右分栏布局完美契合"左侧上传、右侧案例展示"的需求。
