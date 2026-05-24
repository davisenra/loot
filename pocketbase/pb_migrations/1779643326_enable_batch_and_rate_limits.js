/// <reference path="../pb_data/types.d.ts" />
migrate(
  (app) => {
    let settings = app.settings();

    settings.meta.appName = "Loot";

    settings.batch.enabled = true;
    settings.batch.maxRequests = 50;
    settings.batch.timeout = 10;
    settings.batch.maxBodySize = 20971520;

    settings.rateLimits.enabled = true;
    settings.rateLimits.rules = [
      { label: "*:auth", maxRequests: 2, duration: 3 },
      { label: "*:create", maxRequests: 20, duration: 5 },
      { label: "/api/batch", maxRequests: 3, duration: 1 },
      { label: "/api/", maxRequests: 300, duration: 10 },
    ];
    settings.rateLimits.excludedIPs = [];

    return app.save(settings);
  },
  (app) => {
    let settings = app.settings();
    settings.batch.enabled = false;
    settings.rateLimits.enabled = false;
    return app.save(settings);
  },
);
