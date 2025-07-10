import { Elysia } from "elysia";
import { opentelemetry } from '@elysiajs/opentelemetry'
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-node'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto'
import { swagger } from '@elysiajs/swagger'

import { logger } from "../lib/winston";

const app = new Elysia()
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
  .listen(3000);

logger.info(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
