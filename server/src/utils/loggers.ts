import { FILE_PATHS } from "@/constants";
import { appendFile } from "node:fs/promises";
import { Request, Response } from "express";
import { isError } from "@/utils/data-types";

export type LogLevel = "info" | "warn" | "error";
export type LogElements = unknown[];
export type LogTimestamp = number;
export type LogType = "app" | "sql";
export type LogTarget = "console" | "file" | "both" | "none";

export type Log = {
  at: LogTimestamp;
  level: LogLevel;
  elements: LogElements;
};

export const LOGS_TARGET_ALL: LogTarget[] = ["console", "file", "both", "none"];

export const LOGS_TARGET_DEFAULTS: Record<LogType, LogTarget> = {
  app: "console",
  sql: "none",
};

export const LOGS_TARGET_ENV_VARS: Record<LogType, string> = {
  app: "APP_LOGS",
  sql: "SQL_LOGS",
};

function resolveTargets(type: LogType) {
  const targetSetInEnv = process.env[LOGS_TARGET_ENV_VARS[type]];
  const target = isValidLogsTarget(targetSetInEnv)
    ? targetSetInEnv
    : LOGS_TARGET_DEFAULTS[type];

  return {
    inFile: target === "file" || target === "both",
    inConsole: target === "console" || target === "both",
  };

  function isValidLogsTarget(value: unknown): value is LogTarget {
    return LOGS_TARGET_ALL.includes(value as LogTarget);
  }
}

export function logConsole(level: LogLevel, ...elements: LogElements) {
  switch (level) {
    case "error":
      console.error(...elements);
      break;
    case "info":
      console.info(...elements);
      break;
    case "warn":
      console.warn(...elements);
      break;
  }
}

export async function logFile(type: LogType, text: string) {
  const fileName = FILE_PATHS.logs[type];

  try {
    await appendFile(fileName, "\n" + text);
  } catch (err) {
    logConsole("error", `Unable to write logs in file: ${fileName}\n`, err);
  }
}

export async function addAppLog(level: LogLevel, ...elements: LogElements) {
  const time = new Date().toLocaleString();
  const lines = getLines();

  const { inConsole, inFile } = resolveTargets("app");

  if (inConsole) {
    logConsole(level, lines);
  }

  if (inFile) {
    await logFile("app", lines);
  }

  function getLines() {
    let lines = `[${time}] [${level}] ${elements[0]}`;

    if (elements.length > 1) {
      lines += "\n" + elements.slice(1).map(elementToLine).join("\n");
    }

    return lines;

    function elementToLine(el: unknown) {
      try {
        return isError(el) ? errorToLine(el) : JSON.stringify(el, null, 2);
      } catch (err) {
        return `Failed to convert log element to line. Log element: ${el}. Error: ${err}`;
      }

      function errorToLine(err: Error): string {
        const { name, message, stack, cause } = err;

        let errorInfoText = name + ": " + message;
        const errorCauseText = isError(cause)
          ? "\nCause: " + errorToLine(cause)
          : "";

        if (stack) {
          errorInfoText = stack.includes(errorInfoText)
            ? stack
            : errorInfoText + "\n" + stack;
        }

        return errorInfoText + errorCauseText;
      }
    }
  }
}

export async function addRequestLog(req: Request, res: Response) {
  const { start, error } = res.locals;

  let firstLine = `${req.method} "${req.originalUrl}"   →   "${res.statusCode} ${res.statusMessage}" `;

  if (start) {
    const durationMs = Number(process.hrtime.bigint() - start) / 1_000_000;
    firstLine += `(${durationMs.toFixed(2)} ms)`;
  }

  const level = error ? "error" : "info";
  const elements = error ? [firstLine, error] : [firstLine];

  await addAppLog(level, ...elements);
}

export async function addSqlLog(sql: string) {
  const time = new Date().toLocaleString();
  const line = `[${time}] ${sql}`;

  const { inConsole, inFile } = resolveTargets("sql");

  if (inConsole) {
    logConsole("info", line);
  }

  if (inFile) {
    await logFile("sql", line);
  }
}
