const { EntitySchema } = require("typeorm");

const Payload = new EntitySchema({
  name: "Payload",
  tableName: "payloads",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },
    payloadId: {
      type: "varchar",
    },
    amount: {
      type: "float",
    },
    currency: {
      type: "varchar",
      unique: true,
    },
    created_at_time: {
      type: "varchar",
    },
    timestamp: {
      type: "varchar",
      nullable: true,
    },
    cause: {
      type: "varchar",
      nullable: true,
    },
    full_name: {
      type: "varchar",
      nullable: true,
    },
    account_name: {
      type: "varchar",
      nullable: true,
    },
  },
  invoice_url: {
    type: "varchar",
  },
 
});

module.exports = Payload;
