import SoundPlayer from "./index.js";

const mockPlaySoundFile = jest.fn();

jest.mock("./index.js", () => {
  return jest.fn().mockImplementation(() => {
    return { playSoundFile: mockPlaySoundFile };
  });
});

describe("mock es6 new class instance", () => {
  beforeAll(() => {
    // 通过mock替换类的实例
    SoundPlayer.mockImplementation(() => {
      return { playSoundFile: mockPlaySoundFile };
    });
  });

  it("SoundPlayer is called once when new SoundPlayer", () => {
    const data = new SoundPlayer();
    // console.log(data);
    expect(SoundPlayer).toHaveBeenCalledTimes(1);
  });

});
