const path = require("path");

module.exports = {
  images: {
    domains: ["s3lulla.s3.ap-northeast-2.amazonaws.com", "localhost"],
  },
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },
  async rewrites() {
    return process.env.NODE_ENV == "production"
      ? []
      : [
          {
            source: "/api/file/:path*",
            destination: "https://web-lulla.wimcorp.dev/api/file/:path*",
          },
          {
            source: "/api/v1/:path*",
            destination: "https://web-lulla.wimcorp.dev/api/v1/:path*",
          },
          {
            source: "/api/predict_v1_base",
            destination: "http://35.222.65.194/api/predict_v1_base",
            // destination: "http://3.35.221.247/api/predict_v1_base",
          },
        ];
  },
};
