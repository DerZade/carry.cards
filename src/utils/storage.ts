/**
 * Utility functions for managing files in the Origin Private File System (OPFS)
 */

/// <reference types="node/path" />
import { sep, isAbsolute, dirname, basename } from 'pathe'

export const LOGO_DIRECTORY = 'logos'
export const PHYSICAL_CARDS_DIRECTORY = 'physical-cards'

let isPersistedStorageCached = false

/**
 * Attempts to enable persistent storage for the application.
 *
 * This function checks if persistent storage is already enabled or cached. If not,
 * it attempts to request persistent storage permission from the browser.
 *
 * @returns A promise that resolves to `true` if persistent storage is enabled or was
 * successfully granted, `false` otherwise. Also returns `false` if the Storage API
 * is not supported by the browser.
 *
 * @remarks
 * - Uses a cache to avoid redundant checks if persistence is already confirmed
 * - Requires the Storage API to be available in the browser
 * - The browser may deny the persistence request based on its own heuristics
 *
 * @example
 * ```typescript
 * const isStoragePersisted = await tryPersistedStorage();
 * if (isStoragePersisted) {
 *   console.log('Storage will not be cleared automatically');
 * }
 * ```
 */
export async function tryToPersistStorage(): Promise<boolean> {
  if (isPersistedStorageCached) return true

  const isPersisted = await navigator.storage?.persisted?.()
  if (isPersisted === undefined) return false
  if (isPersisted) {
    isPersistedStorageCached = true
    return true
  }

  const isGranted = await navigator.storage?.persist?.()
  if (isGranted) {
    isPersistedStorageCached = true
    return true
  }

  return false
}

export class NotPersistentStorageError extends Error {
  constructor() {
    super('Persistent storage could not be granted')
  }
}

/**
 * Navigates to a directory in the OPFS given an absolute path.
 *
 * @param absPath - The absolute path to navigate to. Must be an absolute path.
 * @param create - Whether to create directories if they don't exist. Defaults to false.
 * @returns A Promise that resolves to the directory handle.
 * @throws {Error} If the provided path is not absolute.
 */
async function navigateToDirectory(
  absPath: string,
  create: boolean = false,
): Promise<FileSystemDirectoryHandle> {
  if (!isAbsolute(absPath)) throw new Error(`Path is not absolute: ${absPath}`)

  const parts = absPath.split(sep).filter(Boolean)

  let directory = await navigator.storage.getDirectory()
  for (const part of parts) {
    directory = await directory.getDirectoryHandle(part, { create })
  }

  return directory
}

/**
 * Retrieves a file from the File System Access API using an absolute file path.
 *
 * @param absFilePath - The absolute file path to the desired file. Must be an absolute path.
 * @returns A Promise that resolves to a Blob containing the file contents, or null if the file cannot be retrieved.
 * @throws {Error} If the provided path is not absolute.
 *
 * @remarks
 * This function uses the File System Access API to navigate through the directory structure
 * and retrieve the specified file. It splits the path into parts, traverses each directory,
 * and finally retrieves the file handle to return the file as a Blob.
 *
 * @example
 * ```typescript
 * const file = await getFile('/documents/myfile.txt');
 * if (file) {
 *   console.log('File size:', file.size);
 * }
 * ```
 */
export async function getFile(absFilePath: string): Promise<Blob | null> {
  if (!isAbsolute(absFilePath)) throw new Error(`Path is not absolute: ${absFilePath}`)

  // Navigate to parent directory
  const directory = await navigateToDirectory(dirname(absFilePath))

  // Get the file
  const fileHandle = await directory.getFileHandle(basename(absFilePath))
  return fileHandle.getFile()
}

/**
 * Saves data to a file at the specified absolute path using the File System Access API.
 *
 * This function creates the necessary directory structure if it doesn't exist,
 * creates or overwrites the file at the given path, and requests persistent storage
 * if not already granted.
 *
 * @param path - The absolute file path where the data should be saved. Must be an absolute path.
 * @param data - The data to write to the file. Can be a string, BufferSource, Blob, or WriteParams object.
 *
 * @throws {Error} If the provided path is not an absolute path.
 * @throws {NotPersistentStorageError} If persistent storage could not be granted.
 *
 * @returns A Promise that resolves when the file has been successfully written and closed.
 *
 * @example
 * ```typescript
 * await saveFile('/documents/myfile.txt', 'Hello, World!');
 * ```
 */
export async function saveFile(path: string, data: FileSystemWriteChunkType): Promise<void> {
  if (!isAbsolute(path)) throw new Error(`Path is not absolute: ${path}`)

  const directory = await navigateToDirectory(dirname(path), true)
  const fileHandle = await directory.getFileHandle(basename(path), { create: true })
  const writable = await fileHandle.createWritable()
  await writable.write(data)
  await writable.close()

  const isPersisted = await tryToPersistStorage()
  if (!isPersisted) throw new NotPersistentStorageError()
}

/**
 * Deletes a file at the specified absolute path using the File System Access API.
 *
 * @param absFilePath - The absolute file path to the file to delete. Must be an absolute path.
 * @returns A Promise that resolves when the file has been successfully deleted, or resolves silently if the file doesn't exist.
 * @throws {Error} If the provided path is not absolute.
 *
 * @example
 * ```typescript
 * await deleteFile('/documents/myfile.txt');
 * ```
 */
export async function deleteFile(absFilePath: string): Promise<void> {
  if (!isAbsolute(absFilePath)) throw new Error(`Path is not absolute: ${absFilePath}`)

  try {
    // Navigate to parent directory
    const directory = await navigateToDirectory(dirname(absFilePath))

    // Delete the file
    await directory.removeEntry(basename(absFilePath))
  } catch (error) {
    // Ignore if file doesn't exist
    if (error instanceof DOMException && error.name === 'NotFoundError') return
    throw error
  }
}
