import { Request, Response } from 'express';
import { ICalendar } from './calendar.model';
import { CalendarService } from './calendar.services';
import {IAppointment} from '../appointment/appointment.model'
import { createChange } from '../changes/change.controller';
import { ChangeService } from '../changes/change.services';
import mongoose from 'mongoose';

const calendarService = new CalendarService();
const changeService = new ChangeService();

export async function createCalendar(req: Request, res: Response): Promise<Response> {
    try {
        console.log("Creating calendar");
        const calendar: Partial<ICalendar> = req.body;
        const answer = await calendarService.createCalendar(calendar);

        if (answer === null) {
            console.log("User not found or invalid calendar name");
            return res.status(404).json({
                message: "User not found or invalid calendar name"
            });
        } else {
            console.log("Calendar created");
            return res.status(201).json({
                message: "Calendar created",
                calendar: answer
            });
        }
    } catch (error) {
        console.log("Server Error");
        return res.status(500).json({
            message: "Server Error"
        });
    }
}

export async function getAllAppointments(req: Request, res: Response): Promise<Response> {
    try {
        console.log("Finding all appointments")
        const {calendarId } = req.params;

        const answer = await calendarService.getAllAppointments(calendarId);

        return res.status(200).json({
            message: "Appointments obtained",
            appointments: answer,
        })
    } catch (error) {
        console.log("Server Error");
        return res.status(500).json({
            message: "Server Error"
        });
    }
}

export async function getAppointmentsBetweenDates(req: Request, res: Response): Promise<Response> {
    try {
        console.log("Finding appointments between two dates");
        const { calendarId, d1, d2 } = req.params;
        const date1 = new Date(d1);
        const date2 = new Date(d2);

        const answer = await calendarService.getAppointmentsBetweenDates(date1, date2, calendarId);
        return res.status(200).json({
            message: "Appointments obtained",
            appointments: answer,
        })
    } catch (error) {
        console.log("Server Error");
        return res.status(500).json({
            message: "Server Error"
        });
    }
}

export async function getAppointmentsForADay(req: Request, res: Response): Promise<Response> {
    try {
        console.log("Finding appointments for a day");
        const { calendarId, date } = req.params;
        const date1 = new Date(date);

        // Llamar al servicio
        const answer = await calendarService.getAppointmentsForADay(date1, calendarId);

        console.log("Appointments obtained");
        return res.status(200).json({
            message: "Appointments obtained",
            appointments: answer
        });
    } catch (error) {
        console.log("Server Error");
        return res.status(500).json({
            message: "Server Error"
        });
    }
}

export async function getCalendarsOfUser(req:Request, res:Response): Promise<Response>{
    try{
        console.log("Finding the calendars of a user");
        const { userId } = req.params;
        const answer = await calendarService.getCalendarsOfUser(userId);

        console.log("Calendar obtained");
        return res.status(200).json({
            message:"Calendar obtained",
            calendars: answer
        });
    } catch(error){
        console.log("Server Error")
        return res.status(500).json({
            message:"Server Error"
        });
    }
}

export async function getCalendarById(req: Request, res: Response): Promise<Response> {
    try {
        const { calendarId } = req.params;
        const calendar = await calendarService.getCalendarById(calendarId);

        if (!calendar) {
            return res.status(404).json({ message: "Calendar not found" });
        }

        return res.status(200).json({
            message: "Calendar obtained",
            calendar: calendar
        });
    } catch (error) {
        console.log("Server Error", error);
        return res.status(500).json({ message: "Server Error" });
    }
}

export async function addAppointmentToCalendar(req: Request, res: Response): Promise<Response> {
    try {
        console.log("Adding an appointment to the calendar");
        const { calendarId } = req.params;
        const appointment: Partial<IAppointment> = req.body;
        
        // Get calendar before modification
        const calendarBefore = await calendarService.getCalendarById(calendarId);
        if (!calendarBefore) {
            return res.status(404).json({ message: "Calendar not found" });
        }

        // Get user ID from calendar owner
        const userId = calendarBefore.owner.toString();

        const updatedCalendar = await calendarService.addAppointmentToCalendar(calendarId, appointment);
        if (!updatedCalendar) {
            return res.status(404).json({ message: "Failed to add appointment" });
        }

        const calendarAfter = await calendarService.getCalendarById(calendarId);
        if (!calendarAfter) {
            return res.status(404).json({ message: "Calendar not found" });
        }

        await changeService.createChange({
            date: new Date(), // Explicitly set current date
            user: calendarBefore.owner, // Direct ObjectId reference
            calendar: calendarBefore._id, // Direct ObjectId reference
            previousState: calendarBefore, 
            newState: calendarAfter, 
            isDeleted: false // Explicit default
        }); 

        return res.status(201).json({
            message: "Appointment added to calendar",
            calendar: updatedCalendar
        });
    } catch (error) {
        console.log("Server Error", error);
        return res.status(500).json({ message: "Server Error" });
    }
}

export async function hardDeleteCalendarsUser(req: Request, res: Response) {
    try {
        const { calendarId } = req.params;
        const numDeleted = await calendarService.hardDeleteCalendarsUser(calendarId);

        if (numDeleted > 0) {
            return res.status(200).json({
                message: "Calendars permanently deleted",
                numDeleted: numDeleted,
            });
        } else {
            return res.status(404).json({ error: "User had no calendars" });
        }
    } catch (error) {
        return res.status(500).json({ error: "Failed to delete calendar" });
    }
}

export async function softDeleteCalendarsUser(req: Request, res: Response) {
    try {
        const { calendarId } = req.params;
        const calendar = await calendarService.softDeleteCalendarsUser(calendarId);

        if (calendar !== null) {
            return res.status(200).json({
                message: "Calendars soft deleted (marked as unavailable)",
                calendar: calendar,
            });
        } else {
            return res.status(404).json({ error: "User had no calendar" });
        }
    } catch (error) {
        return res.status(500).json({ error: "Failed to soft delete calendars" });
    }
}

export async function restoreCalendarsUser(req: Request, res: Response) {
    try {
        const { calendarId } = req.params;
        const calendar = await calendarService.restoreCalendarsUser(calendarId);

        if (calendar !== null) {
            return res.status(200).json({
                message: "Calendars restored (marked as available)",
                calendar: calendar,
            });
        } else {
            return res.status(404).json({ error: "User had no calendars" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Failed to restore calendars" });
    }
}

export async function editCalendar(req: Request, res: Response): Promise<Response> {
    try {
        console.log("Editing calendar");
        const { calendarId } = req.params;
        const changes = req.body;

        // 1. Get current state before modification
        const calendarBefore = await calendarService.getCalendarById(calendarId);
        if (!calendarBefore) {
            return res.status(404).json({ error: "Calendar not found" });
        }

        // 2. Perform the update
        const updatedCalendar = await calendarService.editCalendar(calendarId, changes);
        if (!updatedCalendar) {
            return res.status(404).json({ error: "Failed to update calendar" });
        }

        const calendarAfter = await calendarService.getCalendarById(calendarId);
        if (!calendarAfter) {
            return res.status(404).json({ message: "Calendar not found" });
        }

        // 3. Create change record (matches your model exactly)
        await changeService.createChange({
            date: new Date(),
            user: calendarBefore.owner,
            calendar: calendarBefore._id,
            previousState: calendarAfter, 
            newState: updatedCalendar,
            isDeleted: false // Explicit default
        });

        // 4. Return success response
        return res.status(200).json({
            message: "Calendar updated successfully",
            calendar: updatedCalendar
        });

    } catch (error) {
        console.error("Error editing calendar:", error);
        return res.status(500).json({ 
            error: "Failed to edit calendar"
        });
    }
}