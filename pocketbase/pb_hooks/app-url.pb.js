/// <reference path="../pb_data/types.d.ts" />

onBootstrap((e) => {
  e.next();

  const appURL = $os.getenv("APP_URL");
  if (appURL && $app.settings().meta.appURL !== appURL) {
    $app.settings().meta.appURL = appURL;
    $app.save($app.settings());
  }
});
