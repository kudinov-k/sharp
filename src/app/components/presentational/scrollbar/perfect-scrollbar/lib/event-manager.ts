class EventElement {
  element: any
  handlers: any = {}

  constructor(element: any) {
    this.element = element
    this.handlers = {}
  }

  get isEmpty() {
    return Object.keys(this.handlers).every(
      key => this.handlers[key].length === 0
    )
  }

  bind(eventName: any, handler: any) {
    if (typeof this.handlers[eventName] === 'undefined') {
      this.handlers[eventName] = []
    }
    this.handlers[eventName].push(handler)
    this.element.addEventListener(eventName, handler, false)
  }

  unbind(eventName: any, target?: any) {
    this.handlers[eventName] = this.handlers[eventName].filter((handler: any) => {
      if (target && handler !== target) {
        return true
      }
      this.element.removeEventListener(eventName, handler, false)
      return false
    })
  }

  unbindAll() {
    for (const name of Object.keys(this.handlers)) {
      this.unbind(name)
    }
  }
}

export default class EventManager {
  private eventElements: any[]

  constructor() {
    this.eventElements = []
  }

  eventElement(element: any) {
    let ee = this.eventElements.filter((eee: any) => eee.element === element)[0]
    if (!ee) {
      ee = new EventElement(element)
      this.eventElements.push(ee)
    }
    return ee
  }

  bind(element: any, eventName: any, handler: any) {
    this.eventElement(element).bind(eventName, handler)
  }

  unbind(element: any, eventName: any, handler: any) {
    const ee = this.eventElement(element)
    ee.unbind(eventName, handler)

    if (ee.isEmpty) {
      // remove
      this.eventElements.splice(this.eventElements.indexOf(ee), 1)
    }
  }

  unbindAll() {
    this.eventElements.forEach(e => e.unbindAll())
    this.eventElements = []
  }

  once(element: any, eventName: any, handler: any) {
    const ee = this.eventElement(element)
    const onceHandler = (evt: any) => {
      ee.unbind(eventName, onceHandler)
      handler(evt)
    }
    ee.bind(eventName, onceHandler)
  }
}
