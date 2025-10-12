import { test, describe } from 'node:test';
import assert from 'node:assert';
import eventModule from '../models/event.mjs';

const { addEvent, getEventById, getAllEvents, deleteEventById } = eventModule;

describe('Event Management Tests', () => {
    
    test('getAllEvents should return initial events', async () => {
        const events = await getAllEvents();
        assert.strictEqual(Array.isArray(events), true);
        assert.strictEqual(events.length >= 1, true);
        // if the table is empty, tests might need a seed; here we only assert shape
        if (events.length > 0) {
            assert.strictEqual(typeof events[0].id, 'number');
        }
    });

    test('addEvent should add a new event', async () => {
        const initialEvents = await getAllEvents();
        const initialCount = initialEvents.length;
        
        const newId = await addEvent(
            "Test Event",
            "🎉", 
            "A test event description",
            25.99,
            100,
            "2024-12-01",
            "Test Location",
            1
        );
        
        const events = await getAllEvents();
        assert.strictEqual(events.length, initialCount + 1);
        
        const newEvent = events.find(e => e.id === newId);
        assert.strictEqual(newEvent.title, "Test Event");
        assert.strictEqual(newEvent.price, 25.99);
        assert.strictEqual(newEvent.capacity, 100);
    });

    test('getEventById should return correct event', async () => {
        const events = await getAllEvents();
        if (events.length === 0) return;
        const firstEvent = events[0];
        
        const foundEvent = await getEventById(firstEvent.id);
        assert.deepStrictEqual(foundEvent, firstEvent);
    });

    test('getEventById should return undefined for non-existent event', async () => {
        const foundEvent = await getEventById(99999);
        assert.strictEqual(foundEvent, undefined);
    });

    test('deleteEventById should remove event', async () => {
        // Add a test event to delete
        const newId = await addEvent("Event to Delete", "🗑️", "Will be deleted", 0, 50, "2024-01-01", "Nowhere", 1);
        
        const events = await getAllEvents();
        const eventToDelete = events.find(e => e.id === newId);
        const initialCount = events.length;
        
        const deleted = await deleteEventById(eventToDelete.id);
        assert.strictEqual(deleted, true);
        
        const updatedEvents = await getAllEvents();
        assert.strictEqual(updatedEvents.length, initialCount - 1);
        
        const deletedEvent = await getEventById(eventToDelete.id);
        assert.strictEqual(deletedEvent, undefined);
    });
});