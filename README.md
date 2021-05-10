# BSY-LIVE-DEMO-REACT

## REACT + ANT-DESIGN + RxJS + BSY-LIVE-SDK

抱石云直播间

### 安装依赖

```
npm install
```

### 本地项目启动

```
npm run dev
```

### 项目构建

```
npm run build
```

### 用于测试环境

```
npm run build:test
```

### 使用方式

该项目有三种使用方式：
1. 将该项目整体打包，在目标项目中载入打包生成的js，进行调用并生成实例
2. 将该项目中的代码作为目标项目的组件进行整合
3. 参考该项目对bsy-live-sdk的调用方式和流程，在目标项目中自行编写符合自身需要的UI组件


### 修改主题色

修改[src/theme.less](src/theme.less)和[src/theme.styl](src/theme.styl)里的颜色变量即可，更进一步的自定义设置需要取对应的组件样式表中修改

**使用的SVG图片位于[/src/assets](src/assets)文件夹下，需要单独修改其中的文件中相关的颜色**

### 修改打包的ant-design样式前缀

修改[src/theme.less](src/theme.less)和[src/theme.styl](src/theme.styl)里的ant-prefix变量，并且修改[app.js](src/app.js)里的ConfigProvider组件的prefixCls变量即可

### 目录结构

```bash
├── README.md
├── babel.config.js
├── config
│   ├── env.js
│   ├── getHttpsConfig.js
│   ├── jest
│   │   ├── cssTransform.js
│   │   └── fileTransform.js
│   ├── modules.js
│   ├── paths.js
│   ├── pnpTs.js
│   ├── webpack.config.js
│   └── webpackDevServer.config.js
├── jsconfig.json
├── package.json
├── postcss.config.js
├── public
│   ├── favicon.ico
│   ├── img
│   │   ├── Logo.svg
│   │   └── img_logo.png
│   ├── index.html
│   ├── manifest.json
│   └── robots.txt
└── src
    ├── api
    │   ├── activity.js // IM活动、红包相关的api接口
    │   ├── ask.js // IM问答、答题相关的api接口
    │   ├── liveGoods.js // 直播货架相关的api接口
    │   ├── mic.js // 连麦（rtc）功能相关的api接口
    │   ├── upload.js // 上传图片的api接口
    │   └── user.js // 用户相关操作的api接口
    ├── app.js // 组件渲染主入口，如果需要作为整个项目运行的话将getApp中的App单独渲染即可
    ├── assets // 一些使用到的icon的svg，注意⚠️：它们的颜色是单独写在svg文件里的，如果要改的话建议直接修改，或者换成用别的方式进行引用
    ├── components
    │   ├── Addvert // 货架广告小浮窗组件
    │   │   ├── dom.js // 生成小浮窗dom的方法
    │   │   ├── index.js // 小浮窗对外暴露的调用方法
    │   │   └── index.styl
    │   ├── Container
    │   │   ├── Layout // 直播间主布局
    │   │   │   ├── index.js
    │   │   │   └── index.styl
    │   │   ├── MainContainer // 布局的左侧主内容容器（播放器、连麦视频等）
    │   │   │   ├── index.js
    │   │   │   └── index.styl
    │   │   └── SliderContainer // 布局右侧的IM内容容器（IM相关的所有功能，白板和视频的相关功能）
    │   │       ├── index.js
    │   │       └── index.styl
    │   ├── IM // IM相关的组件
    │   │   ├── Hooks // IM组件和页面所使用的通用逻辑Hooks
    │   │   │   ├── useChatRoom.js
    │   │   │   ├── useMessageItem.js
    │   │   │   ├── useMessageList.js
    │   │   │   ├── useRole.js
    │   │   │   └── useSendBox.js
    │   │   ├── InitialEntry // 教师和学生的IM组件共用的入口组件，包含通用逻辑
    │   │   │   └── index.js
    │   │   ├── Loading // IM的Loading组件（未使用）
    │   │   │   ├── index.js
    │   │   │   └── style.styl
    │   │   ├── NoDataTemplate // 没有数据时共用的占位组件
    │   │   │   ├── index.js
    │   │   │   ├── mstyle.styl
    │   │   │   └── style.styl
    │   │   ├── RoleControl // 按照初始化直播间时传入的用户角色来
    │   │   │   └── index.js
    │   │   └── Zan // 点赞组件
    │   │       └── index.js
    │   ├── ImgLoad // 图片预览组件
    │   │   ├── ImgLoad.js
    │   │   ├── index.module.less
    │   │   ├── readme.md
    │   │   └── showImage.js // 调用生成预览组件实例的方法
    │   ├── Loading // 整体直播间loading组件
    │   │   ├── index.js
    │   │   └── index.styl
    │   ├── Message // 仿antd实现的Message组件，用于展示操作的反馈信息
    │   │   ├── consts.js
    │   │   ├── index.js
    │   │   ├── index.module.less
    │   │   └── message.js // 仿照antd实现了四种类型的message方法，显示不同的icon
    │   ├── MobileDrawer // 移动端的底部弹出抽屉
    │   │   ├── index.js
    │   │   └── index.styl
    │   ├── Player // 播放器容器组件
    │   │   ├── Tips // 播放器容器的提示组件
    │   │   │   ├── index.js
    │   │   │   └── index.styl
    │   │   ├── index.js
    │   │   └── index.styl
    │   ├── PopUp // 通用弹出框组件，用以展示包含自定义内容的悬浮窗
    │   │   ├── PopUp.js // 悬浮窗组件，可以直接使用来渲染
    │   │   ├── index.module.less
    │   │   ├── showLiveDialog.js // 弹出方法，主要用在IM的红包、答题弹出，包含可以传入的onClose事件
    │   │   └── showPopUp.js // 弹出方法，较为底层，调用之后即可生成一个悬浮窗实例
    │   ├── RTCActBtn // RTC 问答 活动 详情按钮
    │   │   ├── index.js
    │   │   └── index.module.styl
    │   ├── RTCComponents // RTC组件
    │   │   ├── ActionBtn // 上台操作
    │   │   │   ├── index.js
    │   │   │   └── index.styl
    │   │   ├── Panel //  观看者面板
    │   │   │   ├── index.js
    │   │   │   └── index.styl
    │   │   ├── Teacher // 老师
    │   │   │   ├── index.js
    │   │   │   └── index.module.styl
    │   │   ├── Watcher // 观看者
    │   │   │   ├── index.js
    │   │   │   └── index.styl
    │   │   ├── index.js 
    │   │   ├── rtc.js // 互动直播上下台逻辑处理
    │   │   └── utils.js // 互动直播相关工具函数
    │   ├── RTCModal // RTC弹窗提示
    │   │   ├── Modal.js 
    │   │   ├── index.js
    │   │   └── index.module.styl
    │   └── WhiteBoard // 白板组件
    │       ├── index.js
    │       └── index.styl
    ├── consts
    │   ├── globalConst.js // 全局常量，目前仅用来存储直播间sdk实例client
    │   ├── index.js
    │   ├── roles.js // 角色相关常量
    │   ├── rtc.js // RTC相关常量
    │   ├── statusCode.js // 网络请求错误码
    │   ├── subjects.js // 用于跨页面触发事件的rxjs subject实例
    │   ├── tabList.js // 给老师和学生使用的默认tabList
    │   └── urls.js // 载入的sdk的url
    ├── context // 全局context
    │   ├── contextStore.js
    │   └── index.js
    ├── index.ejs // 打包后生成index.html，本地运行时作为根路径指向的文件打开
    ├── index.js // 打包后生成两个.js，是该项目的js主入口
    ├── index.less // 该项目的自定义样式
    ├── theme.less // 主题色所用的Less，修改主题色时修改该文件里的变量
    ├── theme.styl // 主题色所用的stylus，修改主题色时修改该文件里的变量
    ├── pages // 页面组件
    │   ├── IM // 学生端IM相关页面租金啊
    │   │   ├── Activity // 学生端IM红包（活动）页面
    │   │   │   ├── index.js
    │   │   │   ├── index.module.styl
    │   │   │   └── itemList.js 
    │   │   ├── Ask // 学生端答题页面
    │   │   │   ├── askItem.js
    │   │   │   ├── index.js
    │   │   │   ├── index.module.styl
    │   │   │   ├── mAskTemplate.js
    │   │   │   └── mItem.module.styl
    │   │   ├── AskWrapper // 学生端答题页面容器
    │   │   │   ├── consts.js
    │   │   │   └── index.js
    │   │   ├── ChatRoom // 学生端聊天页面
    │   │   │   ├── index.js
    │   │   │   └── index.module.styl
    │   │   ├── GroupActivity // 学生端群发红包页面
    │   │   │   ├── index.js
    │   │   │   ├── index.module.styl
    │   │   │   └── itemList.js
    │   │   ├── LiveGoods // 学生端货架页面
    │   │   │   ├── index.js
    │   │   │   └── index.module.styl
    │   │   ├── Loading // IM的Loading组件（未使用）
    │   │   │   ├── index.js
    │   │   │   └── index.module.styl
    │   │   ├── MessageList // IM的信息列表页面组件
    │   │   │   ├── MessageItem.js
    │   │   │   ├── index.js
    │   │   │   ├── index.module.styl
    │   │   │   ├── item.module.styl
    │   │   │   └── new-item.module.styl
    │   │   ├── RoleControl // 根据角色控制组件显示的组件
    │   │   │   └── index.js
    │   │   ├── SendBox // 聊天框组件
    │   │   │   ├── ToolBar // 工具栏组件
    │   │   │   │   ├── Emojis.js // emoji选择组件
    │   │   │   │   ├── EmojisM.js
    │   │   │   │   ├── Like.js // 点赞组件
    │   │   │   │   ├── Online.js // 展示在线人数组件
    │   │   │   │   ├── index.js
    │   │   │   │   └── index.module.styl
    │   │   │   ├── index.js
    │   │   │   └── index.module.styl
    │   │   ├── SpecialMessage // im特殊信息展示组件
    │   │   │   ├── index.js
    │   │   │   └── index.module.styl
    │   │   ├── common.styl
    │   │   ├── index.js
    │   │   └── index.module.styl
    │   ├── IMTeacher // 讲师、助教、班主任（以下统称教师）端的IM页面
    │   │   ├── Activity // 教师端红包组件
    │   │   │   ├── index.js
    │   │   │   ├── index.module.styl
    │   │   │   └── itemList.js
    │   │   ├── Ask // 教师端问答组件
    │   │   │   ├── askItem.js
    │   │   │   ├── index.js
    │   │   │   └── index.module.styl
    │   │   ├── ChatRoom // 教师端聊天室组件
    │   │   │   ├── index.js
    │   │   │   └── index.module.styl
    │   │   ├── Classes // 教师端在线人数查看组件
    │   │   │   ├── MemberItem.js
    │   │   │   ├── index.js
    │   │   │   └── index.module.styl
    │   │   ├── GroupActivity // 教师端群发红包组件
    │   │   │   ├── index.js
    │   │   │   ├── index.module.styl
    │   │   │   └── itemList.js
    │   │   ├── LiveGoods // 教师端货架组件
    │   │   │   ├── index.js
    │   │   │   ├── index.module.styl
    │   │   │   └── itemList.js
    │   │   ├── Loading // 教师端loading（未使用）
    │   │   │   ├── index.js
    │   │   │   └── index.module.styl
    │   │   ├── MaiXu // 教师端麦序管理组件（打开连麦后才会出现）
    │   │   │   ├── index.js
    │   │   │   ├── index.module.styl
    │   │   │   └── setting.js
    │   │   ├── MessageList // 教师端消息列表组件
    │   │   │   ├── MessageItem.js
    │   │   │   ├── index.js
    │   │   │   ├── index.module.styl
    │   │   │   ├── item.module.styl
    │   │   │   └── new-item.module.styl
    │   │   ├── SendBox // 教师端发送聊天信息组件
    │   │   │   ├── ToolBar // 工具栏组件
    │   │   │   │   ├── Emojis.js // 表情组件
    │   │   │   │   ├── EmojisM.js // 移动端表情组件
    │   │   │   │   ├── HighLight.js // 高亮真实信息（相对于脚本信息）组件
    │   │   │   │   ├── Image.js // 发送图片组件
    │   │   │   │   ├── Like.js // 点赞组件
    │   │   │   │   ├── Mute.js // 禁言组件
    │   │   │   │   ├── Online.js // 显示在线人数组件
    │   │   │   │   ├── index.js
    │   │   │   │   └── index.module.styl
    │   │   │   ├── index.js
    │   │   │   └── index.module.styl
    │   │   ├── SpecialMessage
    │   │   │   ├── index.js
    │   │   │   └── index.module.styl
    │   │   ├── StudentGoods
    │   │   │   ├── index.js
    │   │   │   └── index.module.styl
    │   │   ├── common.styl
    │   │   ├── index.js
    │   │   └── index.module.styl
    │   └── Index
    │       └── index.js
    ├── routes
    │   ├── index.js
    │   └── loadableComponent.js
    ├── store
    │   ├── configureStore.dev.js
    │   ├── configureStore.js
    │   ├── configureStore.prod.js
    │   ├── getters.js
    │   ├── index.js
    │   ├── loader.js
    │   ├── models
    │   │   ├── message.js // 消息相关redux model
    │   │   ├── mic.js // 连麦相关redux model
    │   │   ├── system.js // 系统相关redux model
    │   │   └── user.js // 直播间用户相关redux model
    │   └── utils.js
    └── utils
        ├── EventBus.js // 事件总线 
        ├── IMUtil.js // IM相关事件汇总
        ├── emojiMap.js // im聊天表情
        ├── env.js // 部署环境相关
        ├── index.js 
        ├── message.js // message组件用的相关方法
        ├── messageBuffer.js // 为了应对可能的大量消息做缓冲的方法
        ├── postMessage.js // 为了可能的跨页面消息传输准备的方法
        └── request.js // http请求方法


```
