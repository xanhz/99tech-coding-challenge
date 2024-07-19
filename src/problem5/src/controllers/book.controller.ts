import { Request } from 'express';
import Joi from 'joi';
import * as BookService from '../services/book.service';

const yyyy = /^(19[0-9]{2}|20[0-9]{2})$/;

export const create = async (req: Request) => {
  const schema = Joi.object({
    title: Joi.string().trim().min(5).max(255).required(),
    author: Joi.string().trim().min(5).max(100).required(),
    publishYear: Joi.string().trim().regex(yyyy).required(),
    description: Joi.string().trim().allow('').required(),
  });
  const data = await schema.validateAsync(req.body, { stripUnknown: true, abortEarly: false });
  return BookService.create(data);
};

export const find = async (req: Request) => {
  const schema = Joi.object({
    id: Joi.number().required(),
  });
  const data = await schema.validateAsync(req.params, { stripUnknown: true, abortEarly: false });
  return BookService.find(data.id);
};

export const search = async (req: Request) => {
  const schema = Joi.object({
    title: Joi.string().trim().allow('').optional(),
    author: Joi.string().trim().allow('').optional(),
    page: Joi.number().greater(0).optional(),
    limit: Joi.number().greater(0).max(100).optional(),
  });
  const query = await schema.validateAsync(req.query, { stripUnknown: true, abortEarly: false });
  return BookService.search(query);
};

export const modify = async (req: Request) => {
  const schema = Joi.object({
    id: Joi.number().required(),
    title: Joi.string().trim().min(5).max(255).required(),
    author: Joi.string().trim().min(5).max(100).required(),
    publishYear: Joi.string().trim().regex(yyyy).required(),
    description: Joi.string().trim().allow('').required(),
  });
  const data = await schema.validateAsync({ ...req.body, ...req.params }, { stripUnknown: true, abortEarly: false });
  return BookService.modify(data.id, data);
};

export const remove = async (req: Request) => {
  const schema = Joi.object({
    id: Joi.number().required(),
  });
  const data = await schema.validateAsync(req.params, { stripUnknown: true, abortEarly: false });
  return BookService.remove(data.id);
};
