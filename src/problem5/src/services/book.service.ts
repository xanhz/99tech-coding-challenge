import { Prisma } from '@prisma/client';
import { DatabaseConnection } from '../connections';
import { RequestContext, NotFoundError } from '../core';
import * as _ from '../utils/lodash';

export const create = async (data: Prisma.BookCreateInput) => {
  const ctx = RequestContext.current()!;
  const db = ctx.app.get(DatabaseConnection);
  return db.book.create({ data });
};

export const find = async (id: number) => {
  const ctx = RequestContext.current()!;
  const db = ctx.app.get(DatabaseConnection);
  const book = await db.book.findFirst({ where: { id } });
  if (_.isNil(book)) {
    throw new NotFoundError({
      message: `Book '${id}' not found`,
    });
  }
  return book;
};

export const search = async (params: Prisma.BookWhereInput & { page?: number; limit?: number }) => {
  const ctx = RequestContext.current()!;
  const db = ctx.app.get(DatabaseConnection);
  const { page = 1, limit = 20, title, author } = params;
  const where: Prisma.BookWhereInput = {};
  if (!_.isEmpty(title)) {
    where.title = {
      contains: title as string,
      mode: 'insensitive',
    };
  }
  if (!_.isEmpty(author)) {
    where.author = {
      equals: author as string,
    };
  }
  const [count, books] = await Promise.all([
    db.book.count({ where }),
    db.book.findMany({
      where,
      orderBy: { id: 'desc' },
      take: limit,
      skip: (page - 1) * limit,
    }),
  ]);
  return { count, books };
};

export const modify = async (id: number, data: Prisma.BookUpdateInput) => {
  const ctx = RequestContext.current()!;
  const db = ctx.app.get(DatabaseConnection);
  const book = await find(id);
  return db.book.update({ where: { id: book.id }, data });
};

export const remove = async (id: number) => {
  const ctx = RequestContext.current()!;
  const db = ctx.app.get(DatabaseConnection);
  const book = await find(id);
  return db.book.delete({ where: { id: book.id } });
};
