import { searchName } from "./mock";
import { getName } from "./service";
// 替换service模块 这样替换的结果只能是全局唯一的 使用mockImplementation 达到每个测试用例都有自己的mock数据
// jest.mock("./service", () => ({
//   getName: jest.fn(() => ["key", "join"]),
// }));

// 用 fn的callback 代替 数据
jest.mock("./service", () => ({
  getName: jest.fn(),
}));
describe("mock searchName result", () => {
  it("should return target result when found search", () => {
    const keyword = "key";
    getName.mockImplementation(() => ["key", "join"]);
    const result = searchName(keyword);
    expect(result).toEqual([keyword]);
  });

  it("should return empty when not found search", () => {
    const keyword = "key";
    getName.mockImplementation(() => ["join", "split"]);
    const result = searchName(keyword);
    expect(result).toEqual([]);
  });

  it("should generate a new snapshot", () => {
    const key = "join";
    getName.mockImplementation(() => ["join", "split"]);
    const result = searchName(key);
    expect(result).toMatchSnapshot(`[join]`);
  });

  // yarn jest -u 会更新行内快照的值 如果需要重新生成行内的快照 可以再次使用 -u
  it("should generate a new InlineSnapshot", () => {
    const key = "key";
    getName.mockImplementation(() => ["join", "split"]);
    const result = searchName(key);
    expect(result).toMatchInlineSnapshot(`[]`);
  });
});
