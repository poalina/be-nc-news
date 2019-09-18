exports.up = function(knex) {
  return knex.schema.createTable("topics", topicsTable => {
    console.log("Creating users table........");
    topicsTable
      .string("slug")
      .primary()
      .notNullable();
    topicsTable.string("description").notNullable();
  });
};

exports.down = function(knex) {
  console.log("Removing users table........");
  return knex.schema.dropTable("topics");
};
