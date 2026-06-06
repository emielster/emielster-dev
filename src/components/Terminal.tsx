import { useState, useEffect, useRef, KeyboardEvent } from 'react'

const HOSTNAME = 'emielster.dev'
const USER = 'visitor'

type OutputLine = {
  type: 'input' | 'output' | 'error' | 'blank' | 'success' | 'prompt-input'
  content: string
}

type FlowStep = {
  label: string
  mask?: boolean
}

type BranchCommand = {
  lines?: string[]
  flow?: FlowStep[]
  onComplete?: (values: string[]) => Promise<OutputLine[]>
}

type Branch = {
  name: string
  bootLines: string[]
  commands: Record<string, (args: string) => BranchCommand>
}


const BOOT_LINES = [
  'emielsterdev terminal v1.0.0',
  'Copyright (c) 2026 emielster. All rights reserved.',
  '',
  "Type 'help' to see available commands.",
  ''
]

const LOADING_FRAMES = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']

const ROOT_COMMANDS: Record<string, () => string[]> = {
  help: () => [
    'Available commands:',
    '',
    '   about .............     about me',
    '   skills ............     what i know',
    '   experience ........     where i\'ve been',
    '   projects ..........     what i\'ve built',
    '   mindify ...........     open mindify portal',
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
    '   Type \'mindify\' to open the Mindify portal.',
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
    '       -> type "mindify" to open the Mindify portal.',
    '',
    '   [many-more]',
    '       Find it at my GitHub!',
    '       (sadly, 3 years ago I deleted my original GitHub account and',
    '       sold my old laptop, so all my old projects are gone.)',
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

function makeBranches(): Branch[] {
  return [
    {
      name: 'mindify',
      bootLines: [
        '',
        '   ███╗   ███╗██╗███╗   ██╗██████╗ ██╗███████╗██╗   ██╗',
        '   ████╗ ████║██║████╗  ██║██╔══██╗██║██╔════╝╚██╗ ██╔╝',
        '   ██╔████╔██║██║██╔██╗ ██║██║  ██║██║█████╗   ╚████╔╝ ',
        '   ██║╚██╔╝██║██║██║╚██╗██║██║  ██║██║██╔══╝    ╚██╔╝  ',
        '   ██║ ╚═╝ ██║██║██║ ╚████║██████╔╝██║██║        ██║   ',
        '   ╚═╝     ╚═╝╚═╝╚═╝  ╚═══╝╚═════╝ ╚═╝╚═╝        ╚═╝   ',
        '',
        '   Welcome to the Mindify portal.',
        '   Type \'help\' to see available commands.',
        '',
      ],
      commands: {
      help: () => ({
        lines: [
          '',
          '   Mindify portal commands:',
          '',
          '   repo <type>     open the GitHub repo (type: app or server)',
          '   download        download the installer',
          '   exit            return to main terminal',
          '',
        ],
      }),

      repo: (args) => {
        const type = args.trim().toLowerCase()
        if (type === 'app') {
          window.open('https://github.com/emielster/mindify', '_blank')
          return { lines: ['', '   Opening the Mindify app repository...', ''] }
        }
        if (type === 'server') {
          window.open('https://github.com/emielster/mindify-server', '_blank')
          return { lines: ['', '   Opening the Mindify server repository...', ''] }
        }
        return { lines: ['', '   Not sure which one you mean. Try: repo app or repo server', ''] }
      },

      download: () => ({
        lines: ['', '   The installer is not available yet. Check back soon!', ''],
      }),
    },
    },
  ]
}

export default function Terminal() {
  const [output, setOutput] = useState<OutputLine[]>([])
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [booted, setBooted] = useState(false)
  const [activeBranch, setActiveBranch] = useState<Branch | null>(null)
  const [flow, setFlow] = useState<{ steps: FlowStep[]; values: string[]; stepIndex: number; onComplete: (values: string[]) => Promise<OutputLine[]> } | null>(null)
  const [masked, setMasked] = useState(false)
  const [loading, setLoading] = useState(false)
  const [loadingText, setLoadingText] = useState('')
  const [loadingFrame, setLoadingFrame] = useState(0)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const BRANCHES = makeBranches()

  useEffect(() => {
    if (!loading) return
    const interval = setInterval(() => setLoadingFrame(f => (f + 1) % LOADING_FRAMES.length), 80)
    return () => clearInterval(interval)
  }, [loading])

  useEffect(() => {
    if (booted) return
    let i = 0
    const lines: OutputLine[] = []
    const interval = setInterval(() => {
      if (i < BOOT_LINES.length) {
        lines.push({ type: 'output', content: BOOT_LINES[i++] })
        setOutput([...lines])
      } else {
        clearInterval(interval)
        setBooted(true)
      }
    }, 80)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (!booted) return
    const path = window.location.pathname.replace(/^\//, '').replace(/\/$/, '')
    if (path) {
      const branch = BRANCHES.find(b => b.name === path)
      if (branch) enterBranch(branch, false)
    }
  }, [booted])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [output, loading])

  const append = (lines: OutputLine[]) => setOutput(prev => [...prev, ...lines])

  const enterBranch = (branch: Branch, silent = false) => {
    window.history.pushState({}, '', `/${branch.name}`)
    setActiveBranch(branch)
    if (silent) return
    let i = 0
    const interval = setInterval(() => {
      if (i < branch.bootLines.length) {
        setOutput(prev => [...prev, { type: 'output', content: branch.bootLines[i++] }])
      } else {
        clearInterval(interval)
      }
    }, 60)
  }

  const exitBranch = () => {
    window.history.pushState({}, '', '/')
    setActiveBranch(null)
    setFlow(null)
    setMasked(false)
    append([
      { type: 'blank', content: '' },
      { type: 'output', content: '   Returning to main terminal...' },
      { type: 'blank', content: '' },
    ])
  }

  const startFlow = (steps: FlowStep[], onComplete: (values: string[]) => Promise<OutputLine[]>) => {
    setFlow({ steps, values: [], stepIndex: 0, onComplete })
    setMasked(steps[0].mask ?? false)
  }

  const advanceFlow = async (value: string) => {
    if (!flow) return
    const currentStep = flow.steps[flow.stepIndex]

    append([{
      type: 'prompt-input',
      content: `${currentStep.label}:  ${currentStep.mask ? '•'.repeat(value.length) : value}`
    }])

    const newValues = [...flow.values, value]
    const nextIndex = flow.stepIndex + 1

    if (nextIndex < flow.steps.length) {
      setFlow({ ...flow, values: newValues, stepIndex: nextIndex })
      setMasked(flow.steps[nextIndex].mask ?? false)
      return
    }

    setFlow(null)
    setMasked(false)
    setLoading(true)
    setLoadingText('Please wait')
    setLoadingFrame(0)

    try {
      const result = await flow.onComplete(newValues)
      setLoading(false)
      append(result)
    } catch {
      setLoading(false)
      append([
        { type: 'blank', content: '' },
        { type: 'error', content: '   ✗ Network error. Please try again.' },
        { type: 'blank', content: '' },
      ])
    }
  }

  const handleBranchCmd = (raw: string) => {
    if (!activeBranch) return
    const cmd = raw.trim()
    append([{ type: 'input', content: raw }])

    if (cmd === '') { append([{ type: 'blank', content: '' }]); return }
    if (cmd === 'clear') { setOutput([]); return }
    if (cmd === 'exit') { exitBranch(); return }

    const [name, ...rest] = cmd.split(' ')
    const args = rest.join(' ')
    const branch = BRANCHES.find(b => b.name === activeBranch.name)
    const handler = branch?.commands[name.toLowerCase()]

    if (!handler) {
      append([
        { type: 'error', content: `   '${cmd}' is not recognized. Type 'help' for available commands.` },
        { type: 'blank', content: '' },
      ])
      return
    }

    const result = handler(args)
    if (result.lines) append(result.lines.map(l => ({ type: 'output' as const, content: l })))
    if (result.flow && result.onComplete) startFlow(result.flow, result.onComplete)
    else if (result.onComplete) {
      setLoading(true)
      setLoadingText('Please wait')
      setLoadingFrame(0)
      result.onComplete([]).then(lines => {
        setLoading(false)
        append(lines)
      }).catch(() => {
        setLoading(false)
        append([{ type: 'error', content: '   ✗ Network error.' }, { type: 'blank', content: '' }])
      })
    }
  }

  const handleCmd = (raw: string) => {
    const cmd = raw.trim().toLowerCase()

    if (flow) {
      advanceFlow(raw)
      return
    }

    if (activeBranch) {
      handleBranchCmd(raw)
      if (raw.trim()) setHistory(prev => [raw.trim(), ...prev])
      setHistoryIndex(-1)
      return
    }

    const newOutput: OutputLine[] = [...output]
    newOutput.push({ type: 'input', content: raw })

    if (cmd === '') {
      newOutput.push({ type: 'blank', content: '' })
    } else if (cmd === 'clear') {
      setOutput([])
      return
    } else {
      const branch = BRANCHES.find(b => b.name === cmd)
      if (branch) {
        setOutput(newOutput)
        enterBranch(branch)
        if (raw.trim()) setHistory(prev => [raw.trim(), ...prev])
        setHistoryIndex(-1)
        return
      }

      if (ROOT_COMMANDS[cmd]) {
        ROOT_COMMANDS[cmd]().forEach(line => newOutput.push({ type: 'output', content: line }))
      } else {
        newOutput.push({ type: 'error', content: `'${cmd}' is not recognized as a command. Type 'help' for a list of available commands.` })
        newOutput.push({ type: 'blank', content: '' })
      }
    }

    setOutput(newOutput)
    if (cmd) setHistory(prev => [cmd, ...prev])
    setHistoryIndex(-1)
  }

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCmd(input)
      setInput('')
    } else if (e.key === 'ArrowUp' && !flow) {
      e.preventDefault()
      const next = Math.min(historyIndex + 1, history.length - 1)
      setHistoryIndex(next)
      setInput(history[next] ?? '')
    } else if (e.key === 'ArrowDown' && !flow) {
      e.preventDefault()
      const next = Math.max(historyIndex - 1, -1)
      setHistoryIndex(next)
      setInput(next === -1 ? '' : history[next])
    }
  }

  const currentPrompt = activeBranch
    ? `${USER}@${HOSTNAME}:/${activeBranch.name}$ `
    : `${USER}@${HOSTNAME}:~$ `

  const currentInputLabel = flow ? flow.steps[flow.stepIndex].label + ':' : null
  const displayValue = masked ? '•'.repeat(input.length) : input

  return (
    <div className="terminal-wrapper" onClick={() => inputRef.current?.focus()}>
      <div className="crt-beam" />
      <div className="terminal-body">
        {output.map((line, i) => (
          <div key={i} className={`line line-${line.type}`}>
            {line.type === 'input' && <span className="prompt">{currentPrompt}</span>}
            {line.content}
          </div>
        ))}

        {loading && (
          <div className="line line-output loading-line">
            <span className="loading-spinner">{LOADING_FRAMES[loadingFrame]}</span>
            {'  '}{loadingText}
          </div>
        )}

        {!loading && (
          <div className="input-row">
            {currentInputLabel
              ? <span className="prompt-label">{currentInputLabel}&nbsp;&nbsp;</span>
              : <span className="prompt">{currentPrompt}</span>
            }
            <span className="input-display" aria-hidden>{displayValue}</span>
            <input
              ref={inputRef}
              className="terminal-input-hidden"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              autoFocus
              spellCheck={false}
              autoComplete="off"
              autoCapitalize="off"
              type="text"
            />
            <span className="cursor-block" />
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  )
}