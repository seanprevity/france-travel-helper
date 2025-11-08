module.exports = {
  apps: [
    {
      name: "france-explorer",
      script: "npm",
      args: "run dev",
      env: {
        NODE_ENV: "development",
      },
    },
  ],
};
