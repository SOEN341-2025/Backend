import { test, describe } from 'node:test';
import assert from 'node:assert';
import eventModule from '../models/event.mjs';

const { addEvent, getEventById, getAllEvents, deleteEventById } = eventModule;

describe('Event Management Tests', () => {
    
    test('getAllEvents should return initial events', () => {
        const events = getAllEvents();
        assert.strictEqual(Array.isArray(events), true);
        assert.strictEqual(events.length >= 1, true);
        assert.strictEqual(events[0].id, 1);
        assert.strictEqual(events[0].name, "Sample Event");
    });

    test('addEvent should add a new event', () => {
        const initialCount = getAllEvents().length;
        
        addEvent(
            "Test Event",
            "🎉", 
            "A test event description",
            25.99,
            100,
            "2024-12-01",
            "Test Location",
            1
        );
        
        const events = getAllEvents();
        assert.strictEqual(events.length, initialCount + 1);
        
        const newEvent = events[events.length - 1];
        assert.strictEqual(newEvent.title, "Test Event");
        assert.strictEqual(newEvent.price, 25.99);
        assert.strictEqual(newEvent.capacity, 100);
    });

    test('getEventById should return correct event', () => {
        const events = getAllEvents();
        const firstEvent = events[0];
        
        const foundEvent = getEventById(firstEvent.id);
        assert.deepStrictEqual(foundEvent, firstEvent);
    });

    test('getEventById should return undefined for non-existent event', () => {
        const foundEvent = getEventById(99999);
        assert.strictEqual(foundEvent, undefined);
    });

    test('deleteEventById should remove event', () => {
        // Add a test event to delete
        addEvent("Event to Delete", "🗑️", "Will be deleted", 0, 50, "2024-01-01", "Nowhere", 1);
        
        const events = getAllEvents();
        const eventToDelete = events[events.length - 1];
        const initialCount = events.length;
        
        deleteEventById(eventToDelete.id);
        
        const updatedEvents = getAllEvents();
        assert.strictEqual(updatedEvents.length, initialCount - 1);
        
        const deletedEvent = getEventById(eventToDelete.id);
        assert.strictEqual(deletedEvent, undefined);
    });
});