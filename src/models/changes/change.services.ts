import Change, { IChange } from './change.model';
import User from '../users/user.model';
import Calendar from '../calendari/calendar.model';
import mongoose from 'mongoose';


export class ChangeService {
    async createChange(data: Partial<IChange>): Promise<IChange | null> {
        // Verify user exists
        const user = await User.findById(data.user);
        if (!user) return null;

        // Verify calendar exists
        const calendar = await Calendar.findById(data.calendar);
        if (!calendar) return null;

        // Create change record
        const change = new Change({
            ...data,
            isDeleted: false
        });
        return await change.save();
    }

    async getChangesByCalendar(calendarId: string): Promise<IChange[]> {
        return await Change.find({ calendar: calendarId })
            .sort({ date: -1 })
            .populate('user', 'name mail');
    }

    async getChangeById(changeId: string): Promise<IChange | null> {
        return await Change.findById(changeId)
            .populate('user', 'name mail')
            .populate('calendar', 'calendarName');
    }

    async softDeleteChange(changeId: string): Promise<IChange | null> {
        return await Change.findOneAndUpdate(
            { _id: changeId },
            { isDeleted: true },
            { new: true }
        );
    }

    async restoreChange(changeId: string): Promise<IChange | null> {
        return await Change.findOneAndUpdate(
            { _id: changeId },
            { isDeleted: false },
            { new: true }
        );
    }

    async editChange(changeId: string, changes: Partial<IChange>): Promise<IChange | null> {
        // Prevent modifying protected fields
        const { user, calendar, date, _id, ...safeChanges } = changes;
        return await Change.findByIdAndUpdate(
            changeId,
            safeChanges,
            { new: true }
        );
    }

    async hardDeleteChange(changeId: string): Promise<number> {
        const result = await Change.deleteOne({ _id: changeId });
        return result.deletedCount;
    }

    async getChangesPaginated(
        page = 0, 
        limit = 5, 
        getDeleted = false,
        calendarId?: string
    ): Promise<{ 
        changes: IChange[]; 
        totalPages: number; 
        totalChanges: number; 
        currentPage: number 
    }> {
        const query: any = getDeleted ? {} : { isDeleted: false };
        
        if (calendarId) {
            query.calendar = new mongoose.Types.ObjectId(calendarId);
        }
    
        const [changes, totalChanges] = await Promise.all([
            Change.find(query)
                .sort({ date: -1 }) // Newest first
                .skip(page * limit)
                .limit(limit)
                .populate('user', 'name email')
                .populate('calendar', 'calendarName'),
                
            Change.countDocuments(query)
        ]);
    
        return {
            changes,
            currentPage: page,
            totalChanges,
            totalPages: Math.ceil(totalChanges / limit),
        };
    }
}