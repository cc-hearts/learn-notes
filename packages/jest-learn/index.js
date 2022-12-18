export default class SoundPlayer {
  constructor() {
    this.foo = 'bar';
  }

  playSoundFile(fileName) {
    console.log('Playing sound file ' + fileName);
  }

  get foo() {
    return 'bar';
  }
  static brand() {
    return 'player-brand';
  }
}