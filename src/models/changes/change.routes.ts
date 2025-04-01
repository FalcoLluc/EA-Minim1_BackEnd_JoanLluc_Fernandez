import { Router } from 'express';
import {
    createChange,
    getChangesByCalendar,
    getChangeById,
    softDeleteChange,
    restoreChange,
    editChange,
    hardDeleteChange,
    getChangesPaginated
} from './change.controller';

const router = Router();

/**
 * @swagger
 * /changes:
 *   post:
 *     summary: Create a new change record
 *     tags: [Changes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Change'
 *     responses:
 *       201:
 *         description: Change record created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Change'
 *       404:
 *         description: User or calendar not found
 *       500:
 *         description: Server error
 */
router.post('/', createChange);

/**
 * @swagger
 * /changes/calendar/{calendarId}:
 *   get:
 *     summary: Get all changes for a calendar
 *     tags: [Changes]
 *     parameters:
 *       - in: path
 *         name: calendarId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the calendar
 *     responses:
 *       200:
 *         description: List of changes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Change'
 *       500:
 *         description: Server error
 */
router.get('/calendar/:calendarId', getChangesByCalendar);

/**
 * @swagger
 * /changes/{changeId}:
 *   get:
 *     summary: Get a specific change record
 *     tags: [Changes]
 *     parameters:
 *       - in: path
 *         name: changeId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the change record
 *     responses:
 *       200:
 *         description: Change record details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Change'
 *       404:
 *         description: Change record not found
 *       500:
 *         description: Server error
 */
router.get('/:changeId', getChangeById);

/**
 * @swagger
 * /changes/{changeId}/soft-delete:
 *   patch:
 *     summary: Soft delete a change record (mark as deleted)
 *     tags: [Changes]
 *     parameters:
 *       - in: path
 *         name: changeId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the change record
 *     responses:
 *       200:
 *         description: Change record soft-deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Change'
 *       404:
 *         description: Change record not found
 *       500:
 *         description: Server error
 */
router.patch('/:changeId/soft-delete', softDeleteChange);

/**
 * @swagger
 * /changes/{changeId}/restore:
 *   patch:
 *     summary: Restore a soft-deleted change record
 *     tags: [Changes]
 *     parameters:
 *       - in: path
 *         name: changeId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the change record
 *     responses:
 *       200:
 *         description: Change record restored
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Change'
 *       404:
 *         description: Change record not found
 *       500:
 *         description: Server error
 */
router.patch('/:changeId/restore', restoreChange);

/**
 * @swagger
 * /changes/{changeId}:
 *   put:
 *     summary: Update a change record
 *     tags: [Changes]
 *     parameters:
 *       - in: path
 *         name: changeId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the change record
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Change'
 *     responses:
 *       200:
 *         description: Change record updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Change'
 *       404:
 *         description: Change record not found
 *       500:
 *         description: Server error
 */
router.put('/:changeId', editChange);

/**
 * @swagger
 * /changes/{changeId}/hard-delete:
 *   delete:
 *     summary: Permanently delete a change record
 *     tags: [Changes]
 *     parameters:
 *       - in: path
 *         name: changeId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the change record
 *     responses:
 *       200:
 *         description: Change record permanently deleted
 *       404:
 *         description: Change record not found
 *       500:
 *         description: Server error
 */
router.delete('/:changeId/hard-delete', hardDeleteChange);


/**
 * @swagger
 * /changes:
 *   get:
 *     summary: Get paginated changes
 *     tags: [Changes]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Page number (0-indexed)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 5
 *         description: Items per page
 *       - in: query
 *         name: getDeleted
 *         schema:
 *           type: boolean
 *         description: Include deleted changes
 *       - in: query
 *         name: calendarId
 *         schema:
 *           type: string
 *         description: Filter by calendar ID
 *     responses:
 *       200:
 *         description: Paginated changes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 changes:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Change'
 *                 totalPages:
 *                   type: number
 *                 totalChanges:
 *                   type: number
 *                 currentPage:
 *                   type: number
 *       404:
 *         description: No changes found
 *       500:
 *         description: Server error
 */
router.get('/', getChangesPaginated);

export default router;