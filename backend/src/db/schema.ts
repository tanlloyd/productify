import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// for storing users
export const users = pgTable("users", {
  id: text("id").primaryKey(), // userId
  email: text("email").notNull().unique(),  // required and unique
  name: text("name"),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),  // autoset onCreate
  // updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

// for storing products
export const products = pgTable("products", {
  id: uuid("id").defaultRandom().primaryKey(),  // auto-generate UUID
  title: text("title").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  userId: text("user_id")       // links product to user
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
});

export const comments = pgTable("comments", {
  id: uuid("id").defaultRandom().primaryKey(),
  content: text("content").notNull(),
  userId: text("user_id")           // which user wrote the comment
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  productId: uuid("product_id")     // which product the comment is on
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
});



// relations = how tables are connected to each other in schema
// Parent table = User, Child table = Products and Comments (FK only lives in child table)


// Users table 
export const usersRelations = relations(users, ({ many }) => ({
  products: many(products), // One user → many products
  comments: many(comments), // One user → many comments
}));

// Products table
export const productsRelations = relations(products, ({ one, many }) => ({
  comments: many(comments),
  user: one(users, { fields: [products.userId], references: [users.id] }), // one product → one user
}));

// fields = foreign key 
// references = PK of the corresponding table 

// Comments Relations: A comment belongs to one user and one product (resolve to many to many relationship)
export const commentsRelations = relations(comments, ({ one }) => ({
  user: one(users, { fields: [comments.userId], references: [users.id] }), // One comment → one user
  product: one(products, { fields: [comments.productId], references: [products.id] }), // One comment → one product
}));


// Type inference (select and insert)   // mention type so that user will input the correct data when inserting, and db can match if field exist when selecting
export type User = typeof users.$inferSelect;            
export type NewUser = typeof users.$inferInsert;

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;

export type Comment = typeof comments.$inferSelect;
export type NewComment = typeof comments.$inferInsert;