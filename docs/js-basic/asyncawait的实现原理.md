```javascript
async function foo() {
  await baz();
  console.log('foo');
}

async function baz() {
  console.log('baz');
}
```

编译输出
```javascript
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P
      ? value
      : new P(function (resolve) {
        resolve(value);
      });
  }
  return new(P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done
        ? resolve(result.value)
        : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
function foo() {
  return __awaiter(this, void 0, void 0, function*() {
    yield baz();
    console.log('foo');
  });
}
function baz() {
  return __awaiter(this, void 0, void 0, function*() {
    console.log('b');
  });
}
function* foo1 () {
  yield Promise.resolve(1);
}
foo();
```

