module.exports = {
  lintOnSave: false,
  devServer: {
    proxy: {
      "/gp/product/": {
        target: "https://www.amazon.com",
        ws: true,
        changeOrigin: true,
      },
    },
  },
};
