/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3468410069")

  // update collection data
  unmarshal({
    "createRule": "order.user = @request.auth.id",
    "deleteRule": "order.user = @request.auth.id",
    "listRule": "order.user = @request.auth.id",
    "updateRule": "order.user = @request.auth.id",
    "viewRule": "order.user = @request.auth.id"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3468410069")

  // update collection data
  unmarshal({
    "createRule": null,
    "deleteRule": null,
    "listRule": null,
    "updateRule": null,
    "viewRule": null
  }, collection)

  return app.save(collection)
})
