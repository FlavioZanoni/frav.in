type Node<T> = {
  value?: T
  next?: Node<T>
}

export default class Queue<T> {
  public length: number;

  private head?: Node<T> | undefined
  private tail?: Node<T> | undefined

  constructor() {
    this.length = 0
    this.head = this.tail = undefined
  }

  enqueue(item: T): void {
    const newNode = { value: item } as Node<T>
    this.length++
    if (!this.head) {
      this.head = newNode
      this.tail = newNode
      return
    }

    this.tail.next = newNode
    this.tail = newNode
  }

  dequeue(): T | undefined {
    this.length = Math.max(0, this.length - 1)
    if (!this.head) {
      return
    }

    const temp = this.head.value
    this.head = this.head.next
    return temp
  }

  peek(): T | undefined {
    return this.head?.value
  }
}
