import { readFile } from 'fs/promises';
import { basename, resolve } from 'path';

function getFolderName(filename: string): string {
  return basename(resolve(filename));
}

export function getInputFileName(filename: string): string {
  return `./input/${getFolderName(filename)}.txt`;
}

export async function readFileFromInput(
  input: string,
  trim = true
): Promise<string> {
  let content = await readFile(input, 'utf-8');

  if (trim) {
    return content.trim();
  }

  return content;
}

export async function readLinesFromInput(
  input: string,
  lineEnd = '\r\n'
): Promise<string[]> {
  let content = await readFileFromInput(input);

  return content.split(lineEnd);
}
