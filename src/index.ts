import { Elysia, t } from "elysia";
import { opentelemetry } from '@elysiajs/opentelemetry'
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-node'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto'
import { swagger } from '@elysiajs/swagger'

import { logger } from "../lib/winston";
import { db } from "../lib/db";

const app = new Elysia({ prefix: "/v1" })
  .use(
    opentelemetry({
      serviceName: "relogio-de-ponto-controlid",
      spanProcessor: new BatchSpanProcessor(new OTLPTraceExporter({
        url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT || "http://localhost:4317",
        headers: {
          "Authorization": `Bearer ${process.env.OTEL_EXPORTER_OTLP_API_KEY || ""}`
        }
      }))
    })
  )
  .use(swagger())
  .get("/", () => "Hello Elysia")
  .post(
    '/rep',
    ({ body }) => {
      const existingRep = db.query("SELECT * FROM reps WHERE ip = ?").get(body.ip);

      if (existingRep) {
        return existingRep;
      }
      const newRep = db.query("INSERT INTO reps (ip, description) VALUES (?, ?)").values(body.ip, body.description);

      return newRep;
    },
    {
      body: t.Object({
        ip: t.String(),
        description: t.String()
      })
    })
  .listen(3000);

logger.info(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
