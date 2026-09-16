import path from "node:path";
import { appendFile, mkdir } from "node:fs/promises";
import { Request, Response } from "express";
import { isError } from "@/utils/data-types";
import { isServerless } from "@/utils/environment";
import { resolveFromServerRoot } from "@/utils/environment";
import { DatabaseError, ValidationError } from "sequelize";

export type LogLevel = "info" | "warn" | "error";
export type LogElements = unknown[];
export type LogTimestamp = number;
export type LogType = "app" | "req" | "sql";
export type LogTarget = "console" | "file" | "both" | "none";

export type Log = {
  at: LogTimestamp;
  level: LogLevel;
  elements: LogElements;
};

export const LOGS_TARGET_ALL: LogTarget[] = ["console", "file", "both", "none"];

export const LOGS_TARGET_DEFAULTS: Record<LogType, LogTarget> = {
  app: "console",
  req: "none",
  sql: "none",
};

export const LOGS_TARGET_ENV_VARS: Record<LogType, string> = {
  app: "APP_LOGS",
  req: "REQ_LOGS",
  sql: "SQL_LOGS",
};

function resolveLogTargets(type: LogType) {
  const targetSetInEnv = process.env[LOGS_TARGET_ENV_VARS[type]];
  const target = isValidLogsTarget(targetSetInEnv)
    ? targetSetInEnv
    : LOGS_TARGET_DEFAULTS[type];

  // In serverless functions (Vercel, …) the filesytem (/tmp) is ephemeral,
  // it only lives for the duration of a single function invocation.
  // Logs written there vanish when the container is reclaimed. 
  // Observability comes from Vercel's log streaming (console output).
  const fileAllowed = !isServerless();

  return {
    inFile: fileAllowed && (target === "file" || target === "both"),
    inConsole: target === "console" || target === "both",
  };

  function isValidLogsTarget(value: unknown): value is LogTarget {
    return LOGS_TARGET_ALL.includes(value as LogTarget);
  }
}

function logConsole(level: LogLevel, ...elements: LogElements) {
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

function getLogFileName(type: LogType) {
  const dir = process.env["LOG_DIR"] ?? resolveFromServerRoot("logs");
  return path.join(dir, `${type}.log`);
}

async function logFile(type: LogType, text: string) {
  const fileName = getLogFileName(type);

  try {
    await mkdir(path.dirname(fileName), { recursive: true });
    await appendFile(fileName, "\n" + text);
  } catch (err) {
    logConsole("error", `Unable to write logs in file: ${fileName}\n`, err);
  }
}

export async function addAppLog(level: LogLevel, ...elements: LogElements) {
  const lines = convertLogElementsToLines(level, elements);

  await addLogsToTargets("app", level, lines);
}

async function addLogsToTargets(type: LogType, level: LogLevel, lines: string) {
  const { inConsole, inFile } = resolveLogTargets(type);

  if (inConsole) {
    logConsole(level, lines);
  }

  if (inFile) {
    await logFile(type, lines);
  }
}

function convertLogElementsToLines(level: LogLevel, elements: LogElements) {
  const time = new Date().toLocaleString();

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

      let errorOtherInfo = "";
      const isValidationError = err instanceof ValidationError;
      const isDatabaseError = err instanceof DatabaseError;
      if (isValidationError || isDatabaseError) {
        if ("original" in err) {
          errorOtherInfo += "\nOriginal error: " + err.original;
        }

        if (isValidationError && err.errors.length) {
          errorOtherInfo +=
            "\nValidation errors: " +
            err.errors
              .map((error) => `\n${JSON.stringify(error, null, 2)}`)
              .join(", ");
        }
      }

      return errorInfoText + errorOtherInfo + errorCauseText;
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

  const lines = convertLogElementsToLines(level, elements);

  await addLogsToTargets("req", level, lines);
}

export async function addSqlLog(sql: string) {
  const time = new Date().toLocaleString();
  const line = `[${time}] ${sql}`;

  await addLogsToTargets("sql", "info", line);
}
