//src/controllers/healthController.ts
import { Request, Response } from 'express';

export const healthController = (req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString()
  });
};
// npm install express cors
// npm install -D typescript @types/express @types/cors @types/node tsx
// npm run dev