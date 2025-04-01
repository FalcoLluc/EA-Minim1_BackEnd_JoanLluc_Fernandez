import mongoose from "mongoose";
import { ICalendar } from "../calendari/calendar.model";

export interface IChange {
    date: Date;
    user: mongoose.Types.ObjectId;
    calendar: mongoose.Types.ObjectId;
    previousState: Partial<ICalendar>;
    newState: Partial<ICalendar>;
    isDeleted: boolean;
    _id?: mongoose.Types.ObjectId;
}

const ChangeSchema = new mongoose.Schema<IChange>({
    date: { type: Date, default: Date.now },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    calendar: { type: mongoose.Schema.Types.ObjectId, ref: 'Calendar', required: true },
    previousState: { type: mongoose.Schema.Types.Mixed, required: true },
    newState: { type: mongoose.Schema.Types.Mixed, required: true },
    isDeleted: { type: Boolean, required: true, default: false }
});

// Soft delete hooks (same as User model)
ChangeSchema.pre('find', function() {
    this.where({ isDeleted: false });
});

ChangeSchema.pre('findOne', function() {
    this.where({ isDeleted: false });
});

const Change = mongoose.model<IChange>('Change', ChangeSchema);
export default Change;