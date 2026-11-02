export {};

declare global {
  namespace Express {
    interface Request {
      /** Set by `requireAuth` after a valid Bearer JWT. */
      auth?: {
        userId: string;
        email: string;
      };
    }
  }
}
