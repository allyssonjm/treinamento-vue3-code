import bus from '../utils/bus'

const EVENT_NAME = 'modal:toogle'

export default function useModal () {
  function open (payload = {}) {
    bus.emit(EVENT_NAME, { status: true, ...payload })
  }

  function close (payload = {}) {
    bus.emit(EVENT_NAME, { status: false, ...payload })
  }

  function listen (callback) {
    bus.on(EVENT_NAME, callback)
  }

  function off (callback) {
    bus.off(EVENT_NAME, callback)
  }

  return {
    open,
    close,
    listen,
    off
  }
}
