import { sql } from "drizzle-orm"
import { decimal, integer, pgTable, serial, text, timestamp, boolean, varchar } from "drizzle-orm/pg-core"

export const usersTable = pgTable("users", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 255 }).notNull(),
    age: integer().notNull(),
    email: varchar({ length: 255 }).notNull().unique(),
});

export const menuItems = pgTable("menu_items", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 100 }).notNull(),
    description: text(),
    price: decimal({ precision: 10, scale: 2 }).notNull(),
    imageUrl: text(),
    // Category flags
    isSalgado: boolean().default(false).notNull(),
    isDoce: boolean().default(false).notNull(),
    isCafeDaManha: boolean().default(false).notNull(),
    isAlmoco: boolean().default(false).notNull(),
    isJantar: boolean().default(false).notNull(),
    isSobremesa: boolean().default(false).notNull(),
    isSugarFree: boolean().default(false).notNull(), // For sugar-free sweet items
    isAvailable: boolean().default(true).notNull(),
    isPopular: boolean().default(false).notNull(),
    // Dietary preferences
    isGlutenFree: boolean().default(false).notNull(),
    isVegetarian: boolean().default(false).notNull(),
    isVegan: boolean().default(false).notNull(),
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
    createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
    updatedAt: timestamp('updated_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const drinks = pgTable("drinks", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 100 }).notNull(),
    description: text(),
    price: decimal({ precision: 10, scale: 2 }).notNull(),
    imageUrl: text(),
    isHotDrink: boolean().default(true).notNull(), // true for hot, false for cold
    isAvailable: boolean().default(true).notNull(),
    isPopular: boolean().default(false).notNull(),
    isAlcoholic: boolean().default(false).notNull(), // Indicates if the drink contains alcohol (18+)
    // Dietary preferences
    isGlutenFree: boolean().default(false).notNull(),
    isVegetarian: boolean().default(false).notNull(),
    isVegan: boolean().default(false).notNull(),
    // Size options
    hasSize: boolean().default(true).notNull(),
    mediumSizePrice: decimal({ precision: 10, scale: 2 }),
    largeSizePrice: decimal({ precision: 10, scale: 2 }),
    // Discount related fields
    discount: decimal({ precision: 5, scale: 2 }).default('0').notNull(),
    discountStartDate: varchar({ length: 50 }),
    discountEndDate: varchar({ length: 50 }),
    isDiscounted: boolean().default(false).notNull(),
    finalPrice: decimal({ precision: 10, scale: 2 }),
    mediumFinalPrice: decimal({ precision: 10, scale: 2 }),
    largeFinalPrice: decimal({ precision: 10, scale: 2 }),
    createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
    updatedAt: timestamp('updated_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const reservations = pgTable("reservations", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 255 }).notNull(),
    email: varchar({ length: 255 }).notNull(),
    phone: varchar({ length: 20 }).notNull(),
    date: varchar({ length: 50 }).notNull(),
    time: varchar({ length: 50 }).notNull(),
    guests: integer().notNull(),
    mealPeriod: varchar({ length: 20 }).notNull(), // "cafe", "almoco", "jantar"
    status: varchar({ length: 20 }).default("pending").notNull(), // "pending", "confirmed", "cancelled", "completed", "no_show"
    notes: text(), // New field for admin notes
    createdAt: varchar({ length: 50 }).notNull(),
    updatedAt: varchar({ length: 50 }).notNull(),
});

export const capacity = pgTable('capacity', {
    date: text('date').primaryKey(),
    cafe: integer('cafe').notNull().default(30),
    almoco: integer('almoco').notNull().default(30),
    jantar: integer('jantar').notNull().default(30),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
})

export const businessHours = pgTable("business_hours", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    period: varchar({ length: 20 }).notNull(), // "cafe", "almoco", "jantar", "geral"
    weekdays: varchar({ length: 50 }).notNull(), // "Segunda a Domingo", "Segunda a Sábado", etc.
    openTime: varchar({ length: 5 }).notNull(), // "07:00"
    closeTime: varchar({ length: 5 }).notNull(), // "11:00"
    isActive: boolean().default(true).notNull(),
    isGeneralHours: boolean().default(false).notNull(), // Indicates if this is the general business hours
    createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
    updatedAt: timestamp('updated_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
}); 