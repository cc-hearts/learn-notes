import { video } from "./video";

describe("spyOn demo", () => {
  it("plays video", () => {
    const spy = jest.spyOn(video, "play");
    const isPlaying = video.play();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(isPlaying).toBe(true)
  });
});
