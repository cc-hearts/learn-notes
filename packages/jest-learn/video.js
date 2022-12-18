export const video = {
  status: false,
  play() {
    this.status = !this.status;
    return this.status;
  },
};
