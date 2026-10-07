/**
 * API Directory Entry Point
 * Exports all route handlers and sub-routers
 */

import { Router } from 'express';
import healthHandler from './health.js';
import uraRouter from './ura.js';

const router = Router();

router.use('/health', healthHandler);
router.use('/ura', uraRouter);

export { healthHandler, uraRouter };
export default router;
