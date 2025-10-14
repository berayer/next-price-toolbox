// src/env.d.ts 或 env.d.ts
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      IMES_HOST: string
      IMES_DATABASE: string
      IMES_USER: string
      IMES_PASSWORD: string
    }
  }
}

export {}
