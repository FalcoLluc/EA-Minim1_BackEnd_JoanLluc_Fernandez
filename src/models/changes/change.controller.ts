import { Request, Response } from 'express';
import { IChange } from './change.model';
import { ChangeService } from './change.services';

const changeService = new ChangeService();

export async function createChange(req: Request, res: Response): Promise<Response> {
    try {
        console.log("Creating change record");
        const changeData: Partial<IChange> = req.body;
        const answer = await changeService.createChange(changeData);

        if (answer === null) {
            console.log("User or calendar not found");
            return res.status(404).json({
                message: "User or calendar not found"
            });
        } else {
            console.log("Change record created");
            return res.status(201).json({
                message: "Change record created",
                change: answer
            });
        }
    } catch (error) {
        console.log("Server Error:", error);
        return res.status(500).json({
            message: "Server Error"
        });
    }
}

export async function getChangesByCalendar(req: Request, res: Response): Promise<Response> {
    try {
        console.log("Finding changes for calendar");
        const { calendarId } = req.params;
        const answer = await changeService.getChangesByCalendar(calendarId);

        return res.status(200).json({
            message: "Changes obtained",
            changes: answer
        });
    } catch (error) {
        console.log("Server Error:", error);
        return res.status(500).json({
            message: "Server Error"
        });
    }
}

export async function getChangeById(req: Request, res: Response): Promise<Response> {
    try {
        console.log("Finding specific change");
        const { changeId } = req.params;
        const answer = await changeService.getChangeById(changeId);

        if (answer === null) {
            return res.status(404).json({
                message: "Change record not found"
            });
        } else {
            return res.status(200).json({
                message: "Change record obtained",
                change: answer
            });
        }
    } catch (error) {
        console.log("Server Error:", error);
        return res.status(500).json({
            message: "Server Error"
        });
    }
}

export async function softDeleteChange(req: Request, res: Response): Promise<Response> {
    try {
        console.log("Soft-deleting change record");
        const { changeId } = req.params;
        const answer = await changeService.softDeleteChange(changeId);

        if (answer === null) {
            return res.status(404).json({
                message: "Change record not found"
            });
        } else {
            return res.status(200).json({
                message: "Change record soft-deleted",
                change: answer
            });
        }
    } catch (error) {
        console.log("Server Error:", error);
        return res.status(500).json({
            message: "Server Error"
        });
    }
}

export async function restoreChange(req: Request, res: Response): Promise<Response> {
    try {
        console.log("Restoring change record");
        const { changeId } = req.params;
        const answer = await changeService.restoreChange(changeId);

        if (answer === null) {
            return res.status(404).json({
                message: "Change record not found"
            });
        } else {
            return res.status(200).json({
                message: "Change record restored",
                change: answer
            });
        }
    } catch (error) {
        console.log("Server Error:", error);
        return res.status(500).json({
            message: "Server Error"
        });
    }
}

export async function editChange(req: Request, res: Response): Promise<Response> {
    try {
        console.log("Editing change record");
        const { changeId } = req.params;
        const changes = req.body;
        const answer = await changeService.editChange(changeId, changes);

        if (answer === null) {
            return res.status(404).json({
                message: "Change record not found"
            });
        } else {
            return res.status(200).json({
                message: "Change record updated",
                change: answer
            });
        }
    } catch (error) {
        console.log("Server Error:", error);
        return res.status(500).json({
            message: "Server Error"
        });
    }
}

export async function hardDeleteChange(req: Request, res: Response): Promise<Response> {
    try {
        console.log("Permanently deleting change record");
        const { changeId } = req.params;
        const numDeleted = await changeService.hardDeleteChange(changeId);

        if (numDeleted > 0) {
            return res.status(200).json({
                message: "Change record permanently deleted"
            });
        } else {
            return res.status(404).json({
                message: "Change record not found"
            });
        }
    } catch (error) {
        console.log("Server Error:", error);
        return res.status(500).json({
            message: "Server Error"
        });
    }
}

type PaginatedChangesQueryParams = {
    page: number;
    limit?: number;
    getDeleted?: string;
    calendarId?: string;
};

export async function getChangesPaginated(
    req: Request<{}, {}, {}, PaginatedChangesQueryParams>, 
    res: Response
): Promise<Response> {
    try {
        const page = Number(req.query.page) || 0;
        const limit = Number(req.query.limit) || 5;
        const getDeleted = req.query.getDeleted === "true";
        const calendarId = req.query.calendarId;

        const result = await changeService.getChangesPaginated(
            page, 
            limit, 
            getDeleted,
            calendarId
        );

        if (result.changes.length === 0) {
            return res.status(404).json({ error: 'No changes found' });
        }

        return res.status(200).json(result);
    } catch (error) {
        console.error('Error fetching changes:', error);
        return res.status(500).json({ 
            error: 'Failed to fetch changes',
            details: error instanceof Error ? error.message : undefined
        });
    }
}