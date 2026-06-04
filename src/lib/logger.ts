const isProd = process.env.NODE_ENV === "production";

type LogContext = Record<string, unknown>;

function format(level: string, msg: string, ctx?: LogContext): string {
  if (isProd) {
    return JSON.stringify({ level, msg, ...ctx, ts: new Date().toISOString() });
  }
  const ctxStr = ctx ? ` ${JSON.stringify(ctx)}` : "";
  return `[${level.toUpperCase()}] ${msg}${ctxStr}`;
}

export const logger = {
  info:  (msg: string, ctx?: LogContext) => console.log(format("info", msg, ctx)),
  warn:  (msg: string, ctx?: LogContext) => console.warn(format("warn", msg, ctx)),
  error: (msg: string, ctx?: LogContext) => console.error(format("error", msg, ctx)),
};
