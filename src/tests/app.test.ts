import seedTestDb from "../database/seedTestDb";
import request from "supertest";
import app from "../app";
import { User } from "../types/types";
import dbInfo from "../database/connection";

beforeEach(async () => {
  await seedTestDb();
});

afterAll(() => {
  dbInfo.client.close();
});

describe("/api/users", () => {
  test("GET: 200 - will return object containing an list of users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const users = body.users;
        expect(users.length).toBe(5);
        users.forEach((user: User) => {
          expect(user).toEqual(
            expect.objectContaining({
              _id: expect.any(String),
              firstName: expect.any(String),
              lastName: expect.any(String),
              preferredName: expect.any(String),
              role: expect.any(String),
              userPassword: expect.any(String),
            })
          );
        });
      });
  });
});
