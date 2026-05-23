/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3468410069")

  // update collection data
  unmarshal({
    "indexes": [
      "CREATE INDEX `idx_thto8cdw6w` ON `orderItems` (`order`)"
    ]
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3468410069")

  // update collection data
  unmarshal({
    "indexes": []
  }, collection)

  return app.save(collection)
})
