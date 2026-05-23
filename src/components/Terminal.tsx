import { useState, useEffect, useRef, KeyboardEvent } from 'react'

const HOSTNAME = 'emielster.dev'
const USER = 'visitor'

type OutputLine = {
  type: 'input' | 'output' | 'error' | 'blank'
  content: string
}

const COMMANDS: Record<string, () => string[]> = {
  help: () => [
    'Available commands:',
    '',
    '   about .............     about me',
    '   skills ............     what i know',
    '   experience ........     where i\'ve been',
    '   projects ..........     what i\'ve built',
    '   mindify ...........     download mindify installer',
    '   contact ...........     get in touch (love to hear from you!)',
    '   clear .............     clear the terminal',
    '   help ..............     display this help message',
    '',
  ],
  about: () => [
    '',
    '   Hi! I am emielster(dev) (you can call me emiel), I am a young passionate C++ developer',
    '   from Belgium with a love for game development and open-source software.',
    '',
    '   I have experience working on various projects, including my own game engine (Mint),',
    '   using Vulkan as backend, and a custom ECS (Entity Component System) built from scratch.',
    '',
    '   Sometimes throughout the day, sudden ideas pop up in my head, and I have nowhere to',
    '   store them. That\'s why I created Mindify.',
    '',
    '   Install it using the command \'mindify\' and start organizing your thoughts today!',
    '',
  ],
  skills: () => [
    '',
    '   Languages:',
    '       C++     [#########] proficient',
    '       Python  [#######  ] familiar (though I kinda hate it)',
    '       Lua(u)  [#########] expert',
    '       (N)asm  [####     ] learning',
    '       JS      [##       ] long ago',
    '       HTML    [##       ] long ago',
    '       CSS     [##       ] long ago',
    '',
    '   Tools & tech:',
    '       OpenGL / Vulkan   (game engine dev)',
    '       Blender           (3D modeling)',
    '       Roblox Studio     (game dev)',
    '       Visual Studio     (development)',
    '',
  ],
  experience: () => [
    '',
    '   2020-2026: self-taught game developer and software engineer.',
    '       Started with HTML web development, then moved to Roblox game development using Lua,',
    '       then cybersecurity, and eventually transitioned to C++ game development.',
    '       Over the span of 6 years.',
    '',
    '   My philosophy:',
    '       I believe the best way to learn is by doing. Self-taught, no formal education.',
    '',
  ],
  projects: () => [
    '',
    '   [mint-engine]',
    '       Custom C++ engine using Vulkan as its main backend. (coming soon)',
    '',
    '   [mindify]',
    '       Capture and publish your ideas to the world.',
    '       -> type "mindify" to download the installer.',
    '',
    '   [many-more]',
    '       Find it at my GitHub!',
    '       (sadly, 3 years ago I deleted my original GitHub account and',
    '       sold my old laptop, so all my old projects are gone.)',
    '',
  ],
  mindify: () => [
    '',
    '   Ready for Mindify. Ready for your ideas.',
    '',
    '   Installer currently not available, but hopefully soon.',
    '   -> emielster.dev/mindify',
    '',
  ],
  contact: () => [
    '',
    '   GitHub  -> https://github.com/emielster',
    '   Discord -> coming soon',
    '',
    '   Want to talk systems? Reach out. I\'d love to hear from you :)',
    '',
  ],
}

const BOOT_LINES = [
  'emielsterdev terminal v1.0.0',
  'Copyright (c) 2026 emielster. All rights reserved.',
  '',
  "Type 'help' to see available commands.",
  '',
]

export default function Terminal() {
  const [output, setOutput] = useState<OutputLine[]>([])
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [booted, setBooted] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const mirrorRef = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    if (mirrorRef.current && inputRef.current) {
      inputRef.current.style.width = mirrorRef.current.offsetWidth + 'px'
    }
  }, [input])

  useEffect(() => {
    if (booted) return
    let i = 0
    const lines: OutputLine[] = []
    const interval = setInterval(() => {
      if (i < BOOT_LINES.length) {
        lines.push({ type: 'output', content: BOOT_LINES[i] })
        setOutput([...lines])
        i++
      } else {
        clearInterval(interval)
        setBooted(true)
      }
    }, 80)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [output])

  const handleCmd = (raw: string) => {
    const cmd = raw.trim().toLowerCase()
    const newOutput: OutputLine[] = [...output]

    newOutput.push({ type: 'input', content: raw })

    if (cmd === '') {
      newOutput.push({ type: 'blank', content: '' })
    } else if (cmd === 'clear') {
      setOutput([])
      return
    } else if (COMMANDS[cmd]) {
      const lines = COMMANDS[cmd]()
      lines.forEach(line => newOutput.push({ type: 'output', content: line }))
    } else {
      newOutput.push({
        type: 'error',
        content: `'${cmd}' is not recognized as a command. Type 'help' for a list of available commands.`,
      })
      newOutput.push({ type: 'blank', content: '' })
    }

    setOutput(newOutput)
    if (cmd) setHistory(prev => [cmd, ...prev])
    setHistoryIndex(-1)
  }

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCmd(input)
      setInput('')
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      const next = Math.min(historyIndex + 1, history.length - 1)
      setHistoryIndex(next)
      setInput(history[next] ?? '')
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      const next = Math.max(historyIndex - 1, -1)
      setHistoryIndex(next)
      setInput(next === -1 ? '' : history[next])
    }
  }

  return (
    <div className="terminal-wrapper" onClick={() => inputRef.current?.focus()}>
      <div className="crt-beam" />
      <div className="terminal-body">

        {output.map((line, i) => (
          <div key={i} className={`line line-${line.type}`}>
            {line.type === 'input' && (
              <span className="prompt">{USER}@{HOSTNAME}:~$ </span>
            )}
            {line.content}
          </div>
        ))}

        <div className="input-row">
          <span className="prompt">{USER}@{HOSTNAME}:~$ </span>
          <span ref={mirrorRef} className="input-mirror">{input || ''}</span>
          <input
            ref={inputRef}
            className="terminal-input"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            autoFocus
            spellCheck={false}
            autoComplete="off"
            autoCapitalize="off"
          />
          <span className="cursor-block" />
        </div>

        <div ref={bottomRef} />
      </div>
    </div>
  )
}