import { Migration } from "@mikro-orm/migrations";

export class Migration20230320 extends Migration {
  async up(): Promise<void> {
    this.reset();
  }
}