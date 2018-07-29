export default (text, finished) => ({
  text,
  finished,
  toggle() {
    this.finished = !this.finished;
  }
});
