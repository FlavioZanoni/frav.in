import { commands, type Term } from ".."

export function clear(term: Term, _: string[]) {
  term.xterm.clear()
  term.newLine()
}

export function echo(term: Term, args: string[]) {
  term.writeln(args.join(" "))
}

export function pwd(term: Term, _: string[]) {
  return term.writeln(term.getPwd())
}

export function help(term: Term, _: string[]) {
  const cmds = []

  for (let name of commands.keys()) {
    cmds.push(name)
  }

  return term.writeln(
    `Available commands: ${cmds.join(", ")}`
  )
}
