# Sass

## function

```css
background-color: darken(<color>, 10%)
background-color: lighten(<color>, 10%)
```

## command

> dart-scss经过测试 不支持将变量编译成rgb的形势(在`linear-gradient` 中)

```shell
npx dart-sass sass-learn/css/main.scss sass-learn/css/dist/main.css # or
npx sass sass-learn/css/main.scss sass-learn/css/dist/main.css

npx sass sass-learn/css/index.scss sass-learn/css/dist/index.css
```

## @import 和 @use 区别

尽量使用`@use` 代替 `@import` `@import` 为全局的导入 可能会发生命名冲突等问题 `@use` 允许你只导入一次，即使你在样式中使用多个地方
> SASS框架将废除@import规则
