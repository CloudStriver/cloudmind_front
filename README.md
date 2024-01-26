# 基本架构
├── node_modules/                  // 所有第三方模块，包括Vue.js本身、Vue插件、第三方JS库、CSS框架，根据package.json下载依赖
├── publish/                       // 静态资源目录(如图片)
└── src/
    ├── assets/                    // 静态资源目录(css，font，img)
    ├── components/                // 公共组件目录
    ├── router/                    // 路由配置目录
    ├── stores/                    // 状态管理目录，vue3使用pinia代替vuex
    ├── utlis/                     // 辅助函数目录
    ├── views/                     // 页面组件目录
    ├── App.vue                    // 根组件，vue页面资源的首加载项
    ├── main.ts                    // 入口ts文件，初始化vue实例
├── .eslintrc.cjs                  // 检测js代码风格
├── .prettierrc.json               // 代码格式化配置
├── env.d.ts                       // 环境变量文件
├── index.html                     // 首页html
├── tsconfig.app.json              // 用于dom的TypeScript编译器配置文件
├── tsconfig.json                  // 总的TypeScript编译器配置文件
├── tsconfig.node.json             // 用于node环境的TypeScript编译器配置文件
├── tsconfig.vitest.json           // 用于vite测试的TypeScript编译器配置文件
├── vite.config.ts                 // Vite配置文件，用于配置Vite的选项和插件。
├── vitest.config.ts               // Vite测试配置文件
├── package.json                   // 管理vue所有环境依赖项
└── yarn.lock                      // yarn自动生成的锁定文件，用于确保在不同环境中安装相同版本的依赖项，不要手动编辑


# 模板
<template>
    <div>
    </div>
</template>

<script setup lang="ts">
</script>

<style scoped lang="css">
</style>

# git管理
1. git checkout -b xxx
2. 写代码
3. git add .
4. git commit -m "xxx"
5. git push origin xxx
   
# 更新项目
1. git pull origin main

# 项目运行
1. yarn dev

# 规范
1. 目录、文件名使用单个字母或者短线分隔的小写字母命名规范
2. css的类名使用短线分隔的先小写字母命名规范，id使用小驼峰命名规范
3. 变量名、函数使用小驼峰命名规范