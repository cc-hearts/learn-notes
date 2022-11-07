# css

[course address](https://www.udemy.com/course/advanced-css-and-sass/)

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
