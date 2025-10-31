import { describe, beforeEach, afterEach, it } from 'node:test'
import assert from 'node:assert'
import User from '../models/user.mjs'
import Event from '../models/event.mjs'
import db from '../utils/db.mjs'
import bcrypt from 'bcrypt'

describe('User Model Tests', async () => {
  let testUser1Id;
  let testUser2Id;
  let testEventId;
  const timestamp = Date.now();

  // Test data with timestamps to ensure uniqueness
  const testUser1 = {
    name: `Test User 1 ${timestamp}`,
    email: `testuser1_${timestamp}@test.com`,
    password: 'password123',
    isAdmin: false
  };

  const testUser2 = {
    name: `Test User 2 ${timestamp}`,
    email: `testuser2_${timestamp}@test.com`,
    password: 'password456',
    isAdmin: true
  };

    const testEvent = {
      title: `Test Event ${timestamp}`,
      description: 'Test event description',
      location: 'Test Location',
      date: '2025-12-25',
      capacity: 100,
      price: 50
    };  beforeEach(async () => {
    // Initialize database
    db.init(':memory:');
    await db.createDB();
    
    // Create test users
    testUser1Id = await User.createUser(
      testUser1.name,
      testUser1.email,
      testUser1.password,
      testUser1.isAdmin
    );

    testUser2Id = await User.createUser(
      testUser2.name,
      testUser2.email,
      testUser2.password,
      testUser2.isAdmin
    );

    // Create test event
    testEventId = await Event.addEvent(
      testEvent.title,
      'test-icon.png',
      testEvent.description,
      testEvent.price,
      testEvent.capacity,
      testEvent.date,
      testEvent.location,
      1  // org_id
    );
  });

  afterEach(() => {
    db.close();
  });

  it('should create a new user', async () => {
    const newUser = {
      name: `New User ${timestamp}`,
      email: `newuser_${timestamp}@test.com`,
      password: 'newpass123',
      isAdmin: false
    };

    const userId = await User.createUser(
      newUser.name,
      newUser.email,
      newUser.password,
      newUser.isAdmin
    );

    assert.ok(userId, 'User ID should be returned');
    
    const createdUser = await User.getUser(userId);
    assert.equal(createdUser.name, newUser.name);
    assert.equal(createdUser.email, newUser.email);
    assert.equal(createdUser.is_admin, newUser.isAdmin ? 1 : 0);
  });

  it('should get all users', async () => {
    const users = await User.getAllUsers();
    assert.equal(users.length, 2);
    assert.equal(users[0].name, testUser1.name);
    assert.equal(users[1].name, testUser2.name);
  });

  it('should get a specific user', async () => {
    const user = await User.getUser(testUser1Id);
    assert.equal(user.name, testUser1.name);
    assert.equal(user.email, testUser1.email);
    assert.equal(user.is_admin, testUser1.isAdmin ? 1 : 0);
  });

  it('should return null for non-existent user', async () => {
    const user = await User.getUser(999999);
    assert.equal(user, null);
  });

  it('should validate correct password', async () => {
    const user = await User.checkUserPassword(testUser1.email, testUser1.password);
    assert.ok(user);
    assert.equal(user.name, testUser1.name);
    assert.equal(user.email, testUser1.email);
    assert.equal(user.is_admin, testUser1.isAdmin ? 1 : 0);
    assert.ok(!user.password, 'Password should not be included in response');
  });

  it('should reject incorrect password', async () => {
    await assert.rejects(
      async () => {
        await User.checkUserPassword(testUser1.email, 'wrongpassword');
      },
      /Email or Password is wrong/
    );
  });

  it('should delete a user', async () => {
    const result = await User.deleteUser(testUser1Id);
    assert.equal(result, 1);

    const deletedUser = await User.getUser(testUser1Id);
    assert.equal(deletedUser, null);
  });

  it('should add a ticket to user', async () => {
    const ticketId = await User.addTicket(testUser1Id, testEventId);
    assert.ok(ticketId, 'Ticket ID should be returned');

    const userTickets = await User.getUserTickets(testUser1Id);
    assert.equal(userTickets.length, 1);
    assert.equal(userTickets[0].id, testEventId);
    assert.equal(userTickets[0].title, testEvent.title);
  });

  it('should fail to add ticket for non-existent user', async () => {
    await assert.rejects(
      async () => {
        await User.addTicket(999999, testEventId);
      },
      /User 999999 not found/
    );
  });

  it('should fail to add ticket for non-existent event', async () => {
    await assert.rejects(
      async () => {
        await User.addTicket(testUser1Id, 999999);
      },
      /Event 999999 not found/
    );
  });

  it('should get user tickets', async () => {
    await User.addTicket(testUser1Id, testEventId);
    const tickets = await User.getUserTickets(testUser1Id);
    
    assert.equal(tickets.length, 1);
    assert.equal(tickets[0].title, testEvent.title);
    assert.equal(tickets[0].description, testEvent.description);
  });

  it('should return empty array for user with no tickets', async () => {
    const tickets = await User.getUserTickets(testUser2Id);
    assert.deepEqual(tickets, []);
  });
});