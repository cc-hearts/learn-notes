module.exports = {
  // Babel configs when module = true seem to not work
  presets: [
    [
      "@babel/preset-env",
      {
        targets: {
          node: 'current',
        },
      },
    ],
  ],
};
