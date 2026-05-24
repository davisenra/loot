/// <reference path="../pb_data/types.d.ts" />
migrate(
  (app) => {
    const collection = app.findCollectionByNameOrId("pbc_1219621782");

    // update field
    collection.fields.addAt(
      1,
      new Field({
        cascadeDelete: false,
        collectionId: "_pb_users_auth_",
        help: "",
        hidden: false,
        id: "relation2809058197",
        maxSelect: 0,
        minSelect: 0,
        name: "userId",
        presentable: false,
        required: false,
        system: false,
        type: "relation",
      }),
    );

    return app.save(collection);
  },
  (app) => {
    const collection = app.findCollectionByNameOrId("pbc_1219621782");

    // update field
    collection.fields.addAt(
      1,
      new Field({
        cascadeDelete: false,
        collectionId: "_pb_users_auth_",
        help: "",
        hidden: false,
        id: "relation2809058197",
        maxSelect: 0,
        minSelect: 0,
        name: "user_id",
        presentable: false,
        required: false,
        system: false,
        type: "relation",
      }),
    );

    return app.save(collection);
  },
);
