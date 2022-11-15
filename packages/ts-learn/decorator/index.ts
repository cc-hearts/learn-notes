/**
 * @author cc-heart
 * @Date 2022-11-15
 * @description 对 reflect-meta 的探究
 * @see https://www.typescriptlang.org/tsconfig/#compilerOptions
 */
import "reflect-metadata";
function testDecorator(construct) {
  @Reflect.metadata("inClass", construct.name)
  class _con extends construct {}
  return _con;
}

@testDecorator
class Person {
  name: string;
}

console.log(Reflect.getMetadata("inClass", Person));
