import { db } from "./index";
import { eq } from "drizzle-orm";
import {
  users,
  comments,
  products,
  type NewUser,
  type NewComment,          // import tables and types from schema.ts
  type NewProduct,
} from "./schema";

// USER QUERIES

// insert a new user row
export const createUser = async (data: NewUser) => {        
  const [user] = await db.insert(users).values(data).returning();       // insert "data" into users table (must match NewUser type), returning() means return inserted row
  return user;
};

// select 1 user by id 
export const getUserById = async (id: string) => {
  return db.query.users.findFirst({ where: eq(users.id, id) });     // query users table, find first matching row
};

// update a user 
export const updateUser = async (id: string, data: Partial<NewUser>) => {
  const existingUser = await getUserById(id);
  if (!existingUser) {
    throw new Error(`User with id ${id} not found`);
  }

  const [user] = await db.update(users).set(data).where(eq(users.id, id)).returning();
  return user;
};

// upsert => insert or update

export const upsertUser = async (data: NewUser) => {

  const [user] = await db           // if user id exists, update user
    .insert(users)          
    .values(data)

    .onConflictDoUpdate({           // if not, create new user
      target: users.id,
      set: data,
    })
    .returning();
  return user;
};

// PRODUCT QUERIES
export const createProduct = async (data: NewProduct) => {          // insert a product
  const [product] = await db.insert(products).values(data).returning();
  return product;
};

export const getAllProducts = async () => {
  return db.query.products.findMany({
    with: { user: true },
    orderBy: (products, { desc }) => [desc(products.createdAt)], // desc means: you will see the latest products first
    // the square brackets are required because Drizzle ORM's orderBy expects an array, even for a single column.
  });
};

// get product by id including the author, and all of the comments with the authors
export const getProductById = async (id: string) => {
  return db.query.products.findFirst({
    where: eq(products.id, id),
    with: {
      user: true,
      comments: {
        with: { user: true },
        orderBy: (comments, { desc }) => [desc(comments.createdAt)],
      },
    },
  });
};

// same thing, but get multiple products
export const getProductsByUserId = async (userId: string) => {
  return db.query.products.findMany({
    where: eq(products.userId, userId),
    with: { user: true },
    orderBy: (products, { desc }) => [desc(products.createdAt)],
  });
};

export const updateProduct = async (id: string, data: Partial<NewProduct>) => {
  const existingProduct = await getProductById(id);
  if (!existingProduct) {
    throw new Error(`Product with id ${id} not found`);
  }

  const [product] = await db.update(products).set(data).where(eq(products.id, id)).returning();
  return product;
};

export const deleteProduct = async (id: string) => {
  const existingProduct = await getProductById(id);
  if (!existingProduct) {
    throw new Error(`Product with id ${id} not found`);
  }

  const [product] = await db.delete(products).where(eq(products.id, id)).returning();
  return product;
};

// COMMENT QUERIES
export const createComment = async (data: NewComment) => {
  const [comment] = await db.insert(comments).values(data).returning();
  return comment;
};

export const deleteComment = async (id: string) => {
  const existingComment = await getCommentById(id);
  if (!existingComment) {
    throw new Error(`Comment with id ${id} not found`);
  }

  const [comment] = await db.delete(comments).where(eq(comments.id, id)).returning();
  return comment;
};

export const getCommentById = async (id: string) => {
  return db.query.comments.findFirst({
    where: eq(comments.id, id),
    with: { user: true },
  });
};
