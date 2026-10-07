/**
 * API Directory Entry Point
 * Exports all route handlers and sub-routers
 */

import { Router } from 'express';
import healthHandler from './health.js';
import uraRouter from './ura.js';
import onemapRouter from './onemap.js';

const router = Router();

router.use('/health', healthHandler);
router.use('/ura', uraRouter);
router.use('/onemap', onemapRouter);

export { healthHandler, uraRouter, onemapRouter };
export default router;
