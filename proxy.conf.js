const PROXY_CONFIG = [
  {
    context: ["/api2"],
    target: "https://api.sl.se",
    secure: true,
    changeOrigin: true,
    logLevel: "debug",
  },
];

module.exports = PROXY_CONFIG;
