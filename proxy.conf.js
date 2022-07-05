const PROXY_CONFIG = [
  {
    context: ["/api2"],
    target: "https://api.sl.se",
    secure: true,
    changeOrigin: true,
    logLevel: "debug",
  },
  {
    context: ["/api"],
    target: "https://sl-go-324507.ey.r.appspot.com",
    secure: true,
    changeOrigin: true,
    logLevel: "debug",
  },

  
];

module.exports = PROXY_CONFIG;
