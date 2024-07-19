"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const faker_1 = require("@faker-js/faker");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const client = new client_1.PrismaClient({
            datasources: {
                db: {
                    url: process.env.DATABASE_URL,
                },
            },
        });
        yield client.book.createMany({
            data: Array.from({ length: 50 }, () => {
                return {
                    title: faker_1.faker.lorem.words({ min: 3, max: 6 }),
                    author: faker_1.faker.person.fullName(),
                    description: faker_1.faker.lorem.paragraph({ min: 2, max: 3 }),
                    publishYear: faker_1.faker.helpers.fromRegExp(/20[0-9]{2}/),
                };
            }),
        });
        process.exit(0);
    });
}
main();
