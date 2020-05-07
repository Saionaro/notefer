module.exports = {
  from: "./src/index.css",
  to: "./lib/index.css",
  plugins: {
    autoprefixer: {
      cascade: true,
    },
    cssnano: {},
  },
};
