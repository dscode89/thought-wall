import testDbInfo from "../database/createTestDb";
import devDbInfo from "../database/createDevDb";

const currentDb = process.env.NODE_ENV ? testDbInfo : devDbInfo;

export default currentDb;
