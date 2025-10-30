import { test, describe } from 'node:test';
import assert from 'node:assert';
import organizationModule from '../models/organization.mjs';
import userModule from '../models/user.mjs';
import roleModule from '../models/role.mjs';

const {
    createOrganization,
    getAllOrganizations,
    getOrganization,
    getOrganizationEvents,
    addUserToOrganization,
    getOrganizationUsers
} = organizationModule;

describe('Organization Management Tests', async () => {
    // create shared fixtures synchronously at describe time
    let testUser;
    let ownerRole;
    const setupTimestamp = Date.now();

    // create a single test user and get owner role (will be reused)
    testUser = await userModule.createUser(
        `Test User ${setupTimestamp}`,
        `test${setupTimestamp}@example.com`,
        'password123'
    ).then(id => userModule.getUser(id));

    ownerRole = await roleModule.getOwnerRole();

    test('createOrganization should create a new organization', async () => {
        assert.ok(testUser, 'Test user should exist');
        const orgName = `Test Organization ${Date.now()}`;
        const orgIcon = 'test-icon.png';
        const orgDesc = 'Test Description';

        const orgId = await createOrganization(orgName, orgIcon, orgDesc, testUser.id);
        assert.ok(orgId, 'Organization ID should be returned');
        assert.strictEqual(typeof orgId, 'number');

        const org = await getOrganization(orgId);
        assert.ok(org, 'Organization should be retrievable');
        assert.strictEqual(org.name, orgName);
        assert.strictEqual(org.icon, orgIcon);
        assert.strictEqual(org.description, orgDesc);
    });

    test('getAllOrganizations should return array of organizations', async () => {
        const orgs = await getAllOrganizations();
        assert.strictEqual(Array.isArray(orgs), true);
        assert.strictEqual(orgs.length >= 1, true, 'Should have at least one organization');

        const org = orgs[0];
        assert.ok(org.id);
        assert.ok(org.name);
        assert.ok('description' in org);
        assert.ok('icon' in org);
    });

    test('getOrganization should return null for non-existent organization', async () => {
        const nonExistentId = 99999;
        const org = await getOrganization(nonExistentId);
        assert.strictEqual(org, null);
    });

    test('getOrganizationEvents should return empty array for new organization', async () => {
        assert.ok(testUser, 'Test user should exist');
        const orgName1 = `Org Events ${Date.now()}`;
        const orgId1 = await createOrganization(orgName1, 'icon.png', 'desc', testUser.id);
        assert.ok(orgId1, 'Organization should be created');

        const events = await getOrganizationEvents(orgId1);
        assert.strictEqual(Array.isArray(events), true);
        assert.strictEqual(events.length, 0);
    });

    test('addUserToOrganization should add user with role', async () => {
        assert.ok(testUser, 'Test user should exist');
        assert.ok(ownerRole, 'Owner role should exist');

        const timestamp = Date.now();
        const newUserId = await userModule.createUser(
            `Test Member ${timestamp}`,
            `member${timestamp}@example.com`,
            'password123'
        );
        const newUser = await userModule.getUser(newUserId);
        assert.ok(newUser, 'New test user should be created');

        const orgId2 = await createOrganization(`Member Org ${Date.now()}`, 'icon.png', 'desc', testUser.id);
        assert.ok(orgId2, 'Organization should be created');

        const result = await addUserToOrganization(orgId2, newUser.id, ownerRole.id);
        assert.strictEqual(result, true);
    });

    test('addUserToOrganization should reject invalid user', async () => {
        assert.ok(testUser, 'Test user should exist');
        const orgName3 = `InvalidUserOrg ${Date.now()}`;
        const orgId3 = await createOrganization(orgName3, 'icon.png', 'desc', testUser.id);
        assert.ok(orgId3, 'Organization should be created');

        await assert.rejects(
            async () => {
                await addUserToOrganization(orgId3, 99999, ownerRole.id);
            },
            error => {
                assert.ok(error.message.includes('User 99999 not found'));
                return true;
            }
        );
    });

    test('addUserToOrganization should reject invalid organization', async () => {
        assert.ok(testUser, 'Test user should exist');

        await assert.rejects(
            async () => {
                await addUserToOrganization(99999, testUser.id, ownerRole.id);
            },
            error => {
                assert.ok(error.message.includes('Organization 99999 not found'));
                return true;
            }
        );
    });

    test('getOrganizationUsers should return organization members', async () => {
        assert.ok(testUser, 'Test user should exist');
        assert.ok(ownerRole, 'Owner role should exist');

        const orgId4 = await createOrganization(`MembersOrg ${Date.now()}`, 'icon.png', 'desc', testUser.id);
        assert.ok(orgId4, 'Organization should be created');

        const timestamp = Date.now();
        const memberId = await userModule.createUser(`Member2 ${timestamp}`, `member2_${timestamp}@example.com`, 'password123');
        const memberUser = await userModule.getUser(memberId);
        assert.ok(memberUser, 'Member user should be created');

        const addResult = await addUserToOrganization(orgId4, memberUser.id, ownerRole.id);
        assert.strictEqual(addResult, true, 'User should be added to organization');

        const users = await getOrganizationUsers(orgId4);
        assert.strictEqual(Array.isArray(users), true);
        assert.strictEqual(users.length >= 1, true, 'Should have at least one user');

        const user = users.find(u => u.id === memberUser.id) || users[0];
        assert.ok(user.id, 'User should have id');
        assert.ok(user.name, 'User should have name');
        assert.ok(user.email, 'User should have email');
        assert.ok('is_admin' in user, 'User should have is_admin property');
        assert.ok('role' in user, 'User should have role property');
    });
});