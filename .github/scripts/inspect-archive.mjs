import { readFileSync, statSync } from 'node:fs';

// Reads a ZIP's central directory without extracting it. PR artifacts are
// built from untrusted code, so the trusted deploy job uploads only archives
// that pass these checks; Hostinger extracts them on the server.

const MAX_ARCHIVE_BYTES = 50 * 1024 * 1024;
const MAX_UNCOMPRESSED_BYTES = 300 * 1024 * 1024;
const MAX_ENTRIES = 20_000;
const END_OF_CENTRAL_DIRECTORY = 0x06054b50;
const CENTRAL_DIRECTORY_ENTRY = 0x02014b50;
const UNIX_FILE_TYPE_MASK = 0o170000;
const UNIX_SYMLINK = 0o120000;
const UNIX_REGULAR_FILE = 0o100000;
const UNIX_DIRECTORY = 0o040000;
const MADE_BY_UNIX = 3;

export function inspectArchive(file, { kind }) {
  const problems = [];
  const size = statSync(file).size;
  if (size > MAX_ARCHIVE_BYTES) {
    return { ok: false, problems: [`archive is ${size} bytes, over the ${MAX_ARCHIVE_BYTES} byte limit`] };
  }

  const data = readFileSync(file);
  const eocd = findEndOfCentralDirectory(data);
  if (eocd < 0) {
    return { ok: false, problems: ['not a ZIP archive'] };
  }

  const entryCount = data.readUInt16LE(eocd + 10);
  const directorySize = data.readUInt32LE(eocd + 12);
  const directoryOffset = data.readUInt32LE(eocd + 16);
  if (entryCount === 0xffff || directoryOffset === 0xffffffff) {
    return { ok: false, problems: ['ZIP64 archives are not accepted'] };
  }
  if (entryCount > MAX_ENTRIES) {
    return { ok: false, problems: [`archive has ${entryCount} entries, over the ${MAX_ENTRIES} limit`] };
  }
  if (directoryOffset + directorySize > eocd) {
    return { ok: false, problems: ['corrupt central directory'] };
  }

  const names = new Set();
  let uncompressed = 0;
  let offset = directoryOffset;
  for (let index = 0; index < entryCount; index += 1) {
    if (data.readUInt32LE(offset) !== CENTRAL_DIRECTORY_ENTRY) {
      return { ok: false, problems: ['corrupt central directory entry'] };
    }
    const madeBy = data.readUInt16LE(offset + 4) >> 8;
    const flags = data.readUInt16LE(offset + 8);
    const uncompressedSize = data.readUInt32LE(offset + 24);
    const nameLength = data.readUInt16LE(offset + 28);
    const extraLength = data.readUInt16LE(offset + 30);
    const commentLength = data.readUInt16LE(offset + 32);
    const externalAttributes = data.readUInt32LE(offset + 38);
    const name = data.subarray(offset + 46, offset + 46 + nameLength).toString(flags & 0x800 ? 'utf8' : 'latin1');
    offset += 46 + nameLength + extraLength + commentLength;

    uncompressed += uncompressedSize;
    names.add(name);

    const problem = entryProblem(name, madeBy, externalAttributes, flags);
    if (problem) {
      problems.push(`${JSON.stringify(name)}: ${problem}`);
    }
  }

  if (uncompressed > MAX_UNCOMPRESSED_BYTES) {
    problems.push(`archive expands to ${uncompressed} bytes, over the ${MAX_UNCOMPRESSED_BYTES} byte limit`);
  }
  if (kind === 'static' && !names.has('index.html')) {
    problems.push('a static archive must have index.html at its root');
  }
  if (kind === 'node' && !names.has('package.json')) {
    problems.push('a Node.js archive must have package.json at its root');
  }

  return { ok: problems.length === 0, problems, entries: names.size, uncompressed };
}

function entryProblem(name, madeBy, externalAttributes, flags) {
  if (flags & 0x1) {
    return 'encrypted entry';
  }
  if (!name || name.includes('\0') || name.includes('\\')) {
    return 'invalid name';
  }
  if (name.startsWith('/') || /^[A-Za-z]:/.test(name)) {
    return 'absolute path';
  }
  if (name.split('/').some((segment) => segment === '..')) {
    return 'path traversal';
  }
  if (madeBy === MADE_BY_UNIX) {
    const type = (externalAttributes >>> 16) & UNIX_FILE_TYPE_MASK;
    if (type === UNIX_SYMLINK) {
      return 'symbolic link';
    }
    if (type !== 0 && type !== UNIX_REGULAR_FILE && type !== UNIX_DIRECTORY) {
      return 'special file';
    }
  }
  return null;
}

function findEndOfCentralDirectory(data) {
  const minimum = Math.max(0, data.length - 22 - 0xffff);
  for (let offset = data.length - 22; offset >= minimum; offset -= 1) {
    if (data.readUInt32LE(offset) === END_OF_CENTRAL_DIRECTORY) {
      return offset;
    }
  }
  return -1;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const [file, kind] = process.argv.slice(2);
  if (!file || !['static', 'node'].includes(kind)) {
    console.error('Usage: inspect-archive.mjs <archive.zip> <static|node>');
    process.exit(1);
  }
  const result = inspectArchive(file, { kind });
  console.log(JSON.stringify(result, null, 2));
  process.exit(result.ok ? 0 : 1);
}
