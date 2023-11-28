export const getEnvVar = (key: string): string | undefined => {
  // @ts-ignore window._env_ is introduced in index.html, and updated in entrypoint.sh
  if (key in window._env_) return window._env_[key];
  return process.env[key];
};
