import { test, describe } from 'node:test';
import assert from 'node:assert';
import roleModule from '../models/role.mjs';

const { getAllRoles, addRole, getRole, getOwnerRole } = roleModule;

describe('Role Management Tests', () => {
    
    test('getAllRoles should return initial roles', async () => {
        const roles = await getAllRoles();
        assert.strictEqual(Array.isArray(roles), true);
        assert.strictEqual(roles.length >= 1, true, 'Should have at least one role (owner)');
        
        // Verify role shape if we have any
        if (roles.length > 0) {
            const role = roles[0];
            assert.strictEqual(typeof role.id, 'number');
            assert.strictEqual(typeof role.name, 'string');
        }
    });

    test('getOwnerRole should return the owner role', async () => {
        const ownerRole = await getOwnerRole();
        assert.notStrictEqual(ownerRole, null, 'Owner role should exist');
        assert.strictEqual(ownerRole.name, 'owner');
        assert.strictEqual(typeof ownerRole.id, 'number');
    });

    test('addRole should create a new role', async () => {
        const initialRoles = await getAllRoles();
        const initialCount = initialRoles.length;
        
        const testRoleName = 'test_role_' + Date.now(); // Unique role name
        const newId = await addRole(testRoleName);
        
        assert.strictEqual(typeof newId, 'number');
        
        const roles = await getAllRoles();
        assert.strictEqual(roles.length, initialCount + 1);
        
        const newRole = roles.find(r => r.id === newId);
        assert.strictEqual(newRole.name, testRoleName);
    });

    test('getRole should return correct role by ID', async () => {
        // First get all roles to have a valid ID
        const roles = await getAllRoles();
        assert.strictEqual(roles.length >= 1, true, 'Need at least one role for this test');
        
        const firstRole = roles[0];
        const foundRole = await getRole(firstRole.id);
        
        assert.deepStrictEqual(foundRole, firstRole);
    });

    test('getRole should return null for non-existent role', async () => {
        const nonExistentId = 99999;
        const foundRole = await getRole(nonExistentId);
        assert.strictEqual(foundRole, null);
    });

    test('addRole should handle duplicate role names appropriately', async () => {
        const existingRoles = await getAllRoles();
        const existingRole = existingRoles[0];

        try {
            await addRole(existingRole.name);
            assert.fail('Should not allow duplicate role names');
        } catch (error) {
            assert.strictEqual(error.code, 'SQLITE_CONSTRAINT');
        }
    });
});