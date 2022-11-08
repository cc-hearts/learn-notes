# css

[course address](https://www.udemy.com/course/advanced-css-and-sass/)

## 权限级别

```css
/* Selector Specificity: (0, 1, 2, 2) */
nav#nav div.pull-right .button {}
```

```css
/* selector Specificity: (0, 0, 0, 0) */
* {}
```

## 百分比的相对

- `length` 相对的是父元素的 size

- `padding、margin` 相对的都是父元素的宽度

- `em` 参考的是父元素的字体大小

- `rem` 相对于的是根元素的大小

## 属性继承的问题

`inherit`

> 继承的直接的计算值 而不是属性的声明值(例如: font-size: 0.8em 就是声明的值)
> 可以被继承的值 `font` 等

## BEM开发规范

> 层级选择最好不要超过 3 级
Block Element Modifier

```css
/* block 相当于一个命名空间 */
.block {}

/* element 相当于一个命名空间下面的子元素  */
.block__element {}

/* modifier 描述符的状态 */
.block__element--modifier {}
```

### BEM开发的推荐格式

```html
<style>
.form { }
.form--horizontal { }
.form__input { }
.form__submit { }
.form__submit--disabled { }
</style>
<!-- ... -->
<form class="form form--horizontal">
  <input class="form__input" />
  <button class="form__submit form__submit-disabled"></button>
</form>
```
