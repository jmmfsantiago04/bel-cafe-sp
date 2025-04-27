import { integer, pgTable, varchar, decimal, boolean, text } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 255 }).notNull(),
    age: integer().notNull(),
    email: varchar({ length: 255 }).notNull().unique(),
});

export const categories = pgTable("categories", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 50 }).notNull(),
    description: text(),
    isActive: boolean().default(true).notNull(),
});

export const menuItems = pgTable("menu_items", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 100 }).notNull(),
    description: text(),
    price: decimal({ precision: 10, scale: 2 }).notNull(),
    categoryId: integer().references(() => categories.id),
    imageUrl: text(),
    isAvailable: boolean().default(true).notNull(),
    isPopular: boolean().default(false).notNull(),
    // For items like coffee that might have size options
    hasSize: boolean().default(false).notNull(),
    // Base price for small size, null if item doesn't have sizes
    mediumSizePrice: decimal({ precision: 10, scale: 2 }),
    largeSizePrice: decimal({ precision: 10, scale: 2 }),
    // Discount related fields
    discount: decimal({ precision: 5, scale: 2 }).default('0').notNull(), // Percentage discount (0-100)
    discountStartDate: varchar({ length: 50 }), // Optional start date for the discount
    discountEndDate: varchar({ length: 50 }), // Optional end date for the discount
    isDiscounted: boolean().default(false).notNull(), // Quick check if item is currently discounted
    // Final prices after discount
    finalPrice: decimal({ precision: 10, scale: 2 }), // Calculated final price after discount
    mediumFinalPrice: decimal({ precision: 10, scale: 2 }), // For medium size if applicable
    largeFinalPrice: decimal({ precision: 10, scale: 2 }), // For large size if applicable
}); 