import { DataSource } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';

/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */

// https://www.npmjs.com/package/typeorm-seeding#%E2%9D%AF-basic-seeder
export default class DataSeeder implements Seeder {
  public async run(factory: Factory, _connection: DataSource): Promise<any> {
    console.log('seed data here');
  }
}
