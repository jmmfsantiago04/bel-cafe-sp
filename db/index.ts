import 'dotenv/config';
import { drizzle } from 'drizzle-orm/neon-http';
import { eq } from 'drizzle-orm';
import { usersTable } from './schema';

const db = drizzle(process.env.DATABASE_URL!);

async function main() {
    try {
        // Create a new user
        const user = {
            name: 'John Doe',
            age: 30,
            email: 'john@example.com',
        };

        console.log('Creating new user...');
        await db.insert(usersTable).values(user);
        console.log('✅ New user created!');

        // Read all users
        console.log('\nFetching all users...');
        const users = await db.select().from(usersTable);
        console.log('📋 Users in database:', users);

        // Update user
        console.log('\nUpdating user age...');
        await db
            .update(usersTable)
            .set({ age: 31 })
            .where(eq(usersTable.email, user.email));
        console.log('✅ User age updated!');

        // Delete user
        console.log('\nDeleting user...');
        await db.delete(usersTable).where(eq(usersTable.email, user.email));
        console.log('✅ User deleted!');

    } catch (error) {
        console.error('❌ Error:', error);
    }
}

main(); 