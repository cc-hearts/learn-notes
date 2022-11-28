## 类装饰器

```js
@classDecorator
class Building {
  constructor() {
    this.name = "company";
  }
}

const building = new Building();

function classDecorator(target) {
  console.log("target", target);
}
```

经过`babel` 转译之后:

```js
"use strict";

var _class;
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", { writable: false });
  return Constructor;
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
var Building =
  classDecorator(
    (_class = /*#__PURE__*/ _createClass(function Building() {
      _classCallCheck(this, Building);
      this.name = "company";
    }))
  ) || _class;
var building = new Building();
function classDecorator(target) {
  console.log("target", target);
}
```

可以在出`classDecorator` 的本质上是一个函数 这个函数接收一个参数就是当前装饰的类
> 如果这个函数不`return` 一个 新的类的话 则使用还是原来的`_createClass`创建的类

如果装饰器调用之后

```js
@classDecorator()
class Building {
  constructor() {
    this.name = "company";
  }
}
```

经过`babel` 编译之后

```js
var Building =
  ((_dec = classDecorator()),
  _dec(
    (_class = /*#__PURE__*/ _createClass(function Building() {
      _classCallCheck(this, Building);
      this.name = "company";
    }))
  ) || _class);
```

可以看出 如果装饰器不返回一个新的函数 则 `_dec` 后续就会报错。

## 方法装饰器

```js
class Building {
  constructor() {}

  @classDecorator()
  methods() {
    console.log("methods");
  }
}

const building = new Building();

function classDecorator(target) {
  console.log("target", target);
}

```

`babel` 转换之后

```js
"use strict";

var _dec, _class;
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", { writable: false });
  return Constructor;
}
function _applyDecoratedDescriptor(
  target, // 原型链
  property, // 方法名
  decorators, // 装饰器 是一个数组
  descriptor,  // 获取原型链上这个方法的修饰信息
  context // 原型链
) {
  var desc = {};
  Object.keys(descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;
  if ("value" in desc || desc.initializer) {
    desc.writable = true;
  }
  // 装饰器调用
  // 从内调用 将结果一层一层往外传递
  desc = decorators
    .slice()
    .reverse()
    .reduce(function (desc, decorator) {
      // 装饰器收到的方法 1. 当前的原型链 2.方法名 3. 当前方法的修饰属性
      return decorator(target, property, desc) || desc;
    }, desc);
  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }
  if (desc.initializer === void 0) {
    Object.defineProperty(target, property, desc);
    desc = null;
  }
  return desc;
}
var Building =
  ((_dec = classDecorator()),
  ((_class = /*#__PURE__*/ (function () {
    function Building() {
      _classCallCheck(this, Building);
    }
    _createClass(Building, [
      {
        key: "methods",
        value: function methods() {
          console.log("methods");
        },
      },
    ]);
    return Building;
  })()),
  _applyDecoratedDescriptor(
    _class.prototype,
    "methods",
    [_dec],
    Object.getOwnPropertyDescriptor(_class.prototype, "methods"),
    _class.prototype
  ),
  _class));
var building = new Building();
function classDecorator(target) {
  console.log("target", target);
}

```

## getter setter 装饰器

```js
class Building {
  constructor() {}

  @A
  get methods() {
    console.log("methods");
  }
}

const building = new Building();

function A(target) {
  console.log("target", target);
}

```

```js
"use strict";

var _class;
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", { writable: false });
  return Constructor;
}
function _applyDecoratedDescriptor(
  target,
  property,
  decorators,
  descriptor,
  context
) {
  var desc = {};
  Object.keys(descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;
  if ("value" in desc || desc.initializer) {
    desc.writable = true;
  }
  desc = decorators
    .slice()
    .reverse()
    .reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);
  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }
  if (desc.initializer === void 0) {
    Object.defineProperty(target, property, desc);
    desc = null;
  }
  return desc;
}
var Building =
  ((_class = /*#__PURE__*/ (function () {
    function Building() {
      _classCallCheck(this, Building);
    }
    _createClass(Building, [
      {
        key: "methods",
        get: function get() {
          console.log("methods");
        },
      },
    ]);
    return Building;
  })()),
  _applyDecoratedDescriptor(
    _class.prototype,
    "methods",
    [A],
    Object.getOwnPropertyDescriptor(_class.prototype, "methods"),
    _class.prototype
  ),
  _class);
var building = new Building();
function A(target) {
  console.log("target", target);
}

```

与方法装饰器相似

## 属性装饰器

## 参数装饰器

## 执行顺序

class decorator parameter decorator property decorator method decorator accessor decorator

## 参考资料

<https://juejin.cn/post/6907489791831605255>
