import { describe, beforeEach, afterEach, it } from 'node:test'
import assert from 'node:assert'
import Event from '../models/event.mjs'
import Organization from '../models/organization.mjs'
import User from '../models/user.mjs'
import db from '../utils/db.mjs'
import Role from '../models/role.mjs'

describe('Event Management Tests', async () => {
  let testOrgId;
  let testUserId;
  const timestamp = Date.now();

  // Test data with timestamps to ensure uniqueness
  const testUser = {
    name: `Test User ${timestamp}`,
    email: `testuser_${timestamp}@test.com`,
    password: 'password123',
    isAdmin: false
  };

  const testOrg = {
    name: `Test Organization ${timestamp}`,
    icon: 'test-icon.png',
    description: 'Test Description'
  };

  const testEvent = {
    title: `Test Event ${timestamp}`,
    icon: '🎉',
    description: 'Test event description',
    price: 25.99,
    capacity: 100,
    date: '2024-12-01',
    location: 'Test Location'
  };

  beforeEach(async () => {
    // Initialize database
    db.init(':memory:');
    await db.createDB();
      // Create owner role first
      await Role.addRole('owner');

      // Create test user
      testUserId = await User.createUser(
        testUser.name,
        testUser.email,
        testUser.password,
        testUser.isAdmin
      );

    // Create test organization
    testOrgId = await Organization.createOrganization(
      testOrg.name,
      testOrg.icon,
      testOrg.description,
      testUserId
    );
  });

  afterEach(() => {
    db.close();
  });

  it('should add a new event', async () => {
    const eventId = await Event.addEvent(
      testEvent.title,
      testEvent.icon,
      testEvent.description,
      testEvent.price,
      testEvent.capacity,
      testEvent.date,
      testEvent.location,
      testOrgId
    );

    assert.ok(eventId, 'Event ID should be returned');
    
    const createdEvent = await Event.getEventById(eventId);
    assert.equal(createdEvent.title, testEvent.title);
    assert.equal(createdEvent.icon, testEvent.icon);
    assert.equal(createdEvent.description, testEvent.description);
    assert.equal(createdEvent.price, testEvent.price);
    assert.equal(createdEvent.capacity, testEvent.capacity);
    assert.equal(createdEvent.date, testEvent.date);
    assert.equal(createdEvent.location, testEvent.location);
    assert.equal(createdEvent.org_id, testOrgId);
  });

  it('should fail to add event with invalid organization', async () => {
    await assert.rejects(
      async () => {
        await Event.addEvent(
          testEvent.title,
          testEvent.icon,
          testEvent.description,
          testEvent.price,
          testEvent.capacity,
          testEvent.date,
          testEvent.location,
          99999
        );
      },
      /Organization 99999 not found/
    );
  });

  it('should get all events', async () => {
    // Add a test event first
    await Event.addEvent(
      testEvent.title,
      testEvent.icon,
      testEvent.description,
      testEvent.price,
      testEvent.capacity,
      testEvent.date,
      testEvent.location,
      testOrgId
    );

    const events = await Event.getAllEvents();
    assert.equal(Array.isArray(events), true);
    assert.equal(events.length, 1);

    const event = events[0];
    assert.equal(event.title, testEvent.title);
    assert.equal(event.icon, testEvent.icon);
    assert.equal(event.description, testEvent.description);
    assert.equal(event.price, testEvent.price);
    assert.equal(event.capacity, testEvent.capacity);
    assert.equal(event.date, testEvent.date);
    assert.equal(event.location, testEvent.location);
    assert.equal(event.org_id, testOrgId);
  });

  it('should get event by id', async () => {
    const eventId = await Event.addEvent(
      testEvent.title,
      testEvent.icon,
      testEvent.description,
      testEvent.price,
      testEvent.capacity,
      testEvent.date,
      testEvent.location,
      testOrgId
    );

    const event = await Event.getEventById(eventId);
    assert.ok(event);
    assert.equal(event.title, testEvent.title);
    assert.equal(event.org_id, testOrgId);
  });

  it('should return undefined for non-existent event', async () => {
    const event = await Event.getEventById(99999);
    assert.equal(event, undefined);
  });

  it('should delete event by id', async () => {
    const eventId = await Event.addEvent(
      testEvent.title,
      testEvent.icon,
      testEvent.description,
      testEvent.price,
      testEvent.capacity,
      testEvent.date,
      testEvent.location,
      testOrgId
    );

    const deleted = await Event.deleteEventById(eventId);
    assert.equal(deleted, true);

    const deletedEvent = await Event.getEventById(eventId);
    assert.equal(deletedEvent, undefined);
  });

  it('should return false when deleting non-existent event', async () => {
    const deleted = await Event.deleteEventById(99999);
    assert.equal(deleted, false);
  });
});