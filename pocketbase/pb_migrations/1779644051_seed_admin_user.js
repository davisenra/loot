/// <reference path="../pb_data/types.d.ts" />
migrate(
  (app) => {
    const superusers = app.findCollectionByNameOrId("_superusers");

    const record = new Record(superusers);
    record.set("email", "admin@loot.app");
    record.set("password", "admin123456");

    return app.save(record);
  },
  (app) => {
    const record = app.findAuthRecordByEmail("_superusers", "admin@loot.app");
    if (record) {
      return app.delete(record);
    }
  },
);
