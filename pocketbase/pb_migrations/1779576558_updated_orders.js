/// <reference path="../pb_data/types.d.ts" />
migrate(
  (app) => {
    const collection = app.findCollectionByNameOrId("pbc_3527180448");

    // add field
    collection.fields.addAt(
      5,
      new Field({
        autogeneratePattern: "",
        help: "",
        hidden: false,
        id: "text1767278655",
        max: 3,
        min: 3,
        name: "currency",
        pattern: "",
        presentable: false,
        primaryKey: false,
        required: false,
        system: false,
        type: "text",
      }),
    );

    // add field
    collection.fields.addAt(
      7,
      new Field({
        help: "",
        hidden: false,
        id: "number763737974",
        max: null,
        min: 0,
        name: "shippingCost",
        onlyInt: false,
        presentable: false,
        required: false,
        system: false,
        type: "number",
      }),
    );

    return app.save(collection);
  },
  (app) => {
    const collection = app.findCollectionByNameOrId("pbc_3527180448");

    // remove field
    collection.fields.removeById("text1767278655");

    // remove field
    collection.fields.removeById("number763737974");

    return app.save(collection);
  },
);
