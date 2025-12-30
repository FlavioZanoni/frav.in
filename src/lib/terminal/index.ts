import { cd, ls, mkdir, mv, touch } from "@lib/utils/fileSystemUtils"
import { FitAddon } from "@xterm/addon-fit"
import type { Terminal } from "@xterm/xterm"
import { neofetch } from "./commands/neofetch"
import { clear, echo, help, pwd } from "./commands/defaults"
import { isMobile } from "@lib/utils/browserUtils"
type TerminalType = InstanceType<typeof Terminal>

export const commands = new Map<string, Function>([
  ["help", help],
  ["cd", cd],
  ["touch", touch],
  ["ls", ls],
  ["mkdir", mkdir],
  ["mv", mv],
  ["neofetch", neofetch],
  ["clear", clear],
  ["echo", echo],
  ["pwd", pwd],
])

export class Term {
  constructor(public xterm: TerminalType) { }

  private pwd = "root"
  private fitAddon: FitAddon
  private currentCommand = ""
  private commandArr: Array<string | undefined> = []
  private lastBeep = 0
  private commandList: string[] = []
  private commandListIdx = -1

  private beep() {
    if (Date.now() - this.lastBeep < 183) {
      return 0
    }
    const context = new AudioContext()
    const oscillator = context.createOscillator()
    const gainNode = context.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(context.destination)

    gainNode.gain.value = 0.3
    oscillator.frequency.value = 510
    oscillator.type = "square"

    oscillator.start(context.currentTime)
    oscillator.stop(context.currentTime + 0.1)
    this.lastBeep = Date.now()
  }

  private getDecorationString() {
    const currentPwd = this.pwd
    const emoji = currentPwd === "root" ? "⌂" : "☺"
    return `\x1B[34m${emoji} ${currentPwd}\x1B[32m ❯\x1B[0m `
  }

  private handleInput(data: string) {
    const insertPosition = this.xterm.buffer.active.cursorX - this.pwd.length - 5;
    this.commandArr.splice(insertPosition, 0, data);
    this.currentCommand = this.commandArr.join("");

    // Clear the line from the current cursor position
    this.xterm.write("\x1b[K");
    this.xterm.write(this.currentCommand.slice(insertPosition));

    // Move the cursor back to the correct position
    const moveLeft = this.currentCommand.length - insertPosition - 1;
    if (moveLeft > 0) {
      this.xterm.write(`\x1b[${moveLeft}D`);
    }
  }

  private handleBackspace() {
    // pwd + 5 is the length of the prompt decoration
    if (this.xterm.buffer.active.cursorX === this.pwd.length + 5) {
      this.xterm.write("\x07") // trigger bell
      return
    }

    let deletePosition = this.xterm.buffer.active.cursorX - this.pwd.length - 6;
    this.commandArr.splice(deletePosition, 1);
    this.currentCommand = this.commandArr.join("")
    // Move the cursor back one position
    this.xterm.write("\b");

    // Clear the rest of the line from the current cursor position
    this.xterm.write("\x1b[K");
    this.xterm.write(this.currentCommand.slice(deletePosition));

    // Move the cursor back to the correct position
    let moveLeft = this.currentCommand.length - deletePosition;
    if (moveLeft > 0) {
      this.xterm.write(`\x1b[${moveLeft}D`);
    }
  }

  private clearInput = () => {
    this.currentCommand = ""
    this.commandArr = []

    // move cursor to the prompt position
    const promptPosition = this.pwd.length + 5
    const currentCursorX = this.xterm.buffer.active.cursorX
    const moveLeft = currentCursorX - promptPosition
    if (moveLeft > 0) {
      this.xterm.write(`\x1b[${moveLeft}D`)
    }

    this.xterm.write("\x1b[K")
  }

  public setup(dir: string, uuid: string) {
    this.setPwd(dir)

    const termDiv = document.getElementById(`terminal-${uuid}`)
    this.xterm.open(termDiv)

    this.xterm.writeln("Welcome to the terminal!")
    this.xterm.writeln("Type 'help' to get started.")
    this.xterm.options.cursorInactiveStyle = "block"
    this.xterm.options.cursorBlink = true
    this.xterm.options.fontFamily = "IBM"
    this.xterm.options.lineHeight = 1.4
    this.xterm.write(this.getDecorationString())
    this.xterm.textarea.setAttribute('type', 'password');

    this.xterm.onBell(() => {
      this.beep()
    })

    this.xterm.onData((data) => {
      this.commandArr = this.currentCommand.split("")
      switch (data) {
        // enter
        case "\r":
        case "\n":
        case "\r\n":
          this.execCommand(this.currentCommand)
          this.currentCommand = ""
          break
        // backspace
        case "\x7f":
          this.handleBackspace()
          break
        // up arrow
        case "\x1b[A":
          this.commandListIdx++
          if (this.commandListIdx >= this.commandList.length) {
            this.commandListIdx = this.commandList.length - 1
            break
          }
          this.clearInput()
          this.xterm.write(this.commandList[this.commandListIdx])
          this.currentCommand = this.commandList[this.commandListIdx] || ""
          break
        // down arrow
        case "\x1b[B":
          this.clearInput()
          this.commandListIdx--
          if (this.commandListIdx > -1) {
            this.xterm.write(this.commandList[this.commandListIdx])
          } else {
            this.commandListIdx = -1
          }
          this.currentCommand = this.commandList[this.commandListIdx] || ""
          break
        //left arrow
        case "\x1b[D":
          if (this.xterm.buffer.active.cursorX === this.pwd.length + 5) {
            this.xterm.write("\x07") // trigger bell
            break
          }
          this.xterm.write("\b")
          break
        //right arrow
        case "\x1b[C":
          if (this.xterm.buffer.active.cursorX === this.currentCommand.length + this.pwd.length + 5) {
            this.xterm.write("\x07") // trigger bell
            break
          }
          this.xterm.write("\x1b[C")
          break
        // implement tab later
        case "\t":
          this.xterm.write("")
          break
        default:
          this.handleInput(data)
      }
    })
  }

  public loadFitAddon = () => {
    this.fitAddon = new FitAddon()
    this.xterm.loadAddon(this.fitAddon)
  }

  public fit = () => {
    if (this.fitAddon === undefined) {
      throw new Error("fitAddont is not loaded")
    }

    this.fitAddon.fit()
  }

  public newLine() {
    this.xterm.write(this.getDecorationString())
  }

  public writeln(str: string) {
    this.xterm.writeln(str)
    this.newLine()
  }

  public getPwd() {
    return this.pwd
  }

  //needs to be arrow fn or bind this in the constructor
  public setPwd = (newPwd: string) => {
    this.pwd = newPwd
  }

  public execCommand(str: string) {
    const [command, ...args] = str
      .trim()
      .split(" ")
      .map((arg) => arg.trim())


    if (command == "") {
      return this.writeln("")
    }

    this.commandList.push(this.currentCommand)
    this.xterm.writeln("")
    if (!commands.has(command)) {
      return this.writeln(`Command not found: '${command}', try 'help'`)
    }

    try {
      commands.get(command)(this, args)
    } catch (e) {
      return this.writeln(`${command}: ${e.message || "Error"}`)
    }
  }
}
