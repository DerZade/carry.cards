/**
 * Logger for frontend.
 *
 * _This is currently just a wrapper around console.log, console.warn and console.error, but
 * allows easy refactor for reporting in the future._
 */
export function useLogger() {
  function log(message: string) {
    console.log(message)
  }

  function warn(message: string) {
    console.warn(message)
  }

  function error(error: unknown) {
    console.error(error)
  }

  return { log, warn, error }
}
