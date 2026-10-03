import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  Play,
  Send,
  RotateCcw,
  Code2,
  Terminal,
  Loader2,
  Maximize2,
  Minimize2,
  History,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowLeft,
  Keyboard,
  AlertTriangle,
  FileCode,
  Check,
  Copy
} from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../hooks/useToast'
import CodeEditor from '../components/CodeEditor'
import { getProblemById, submitSolution as submitSolutionApi, getProblemSubmissions } from '../services/apiService'

const languageApiMap = {
  javascript: 93,
  python: 71,
  java: 62,
  cpp: 54
};

const codeTemplates = {
  javascript: `// Write your solution here\nfunction solve(input) {\n  console.log("Hello from JavaScript!");\n}\n\nsolve();`,
  python: `# Write your solution here\ndef solve():\n    print("Hello from Python!")\n\nif __name__ == "__main__":\n    solve()`,
  java: `public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello from Java!");\n    }\n}`,
  cpp: `#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello from C++!" << endl;\n    return 0;\n}`
};

const ProblemSolver = () => {
  const { problemId } = useParams()
  const navigate = useNavigate()
  const { user, refreshUser } = useAuth()
  const { toast } = useToast()

  const [problem, setProblem] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Editor states
  const [code, setCode] = useState(codeTemplates.javascript)
  const [language, setLanguage] = useState('javascript')
  const [isRunning, setIsRunning] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [output, setOutput] = useState('')
  const [testResults, setTestResults] = useState([])
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showResetModal, setShowResetModal] = useState(false)
  const [activeLeftTab, setActiveLeftTab] = useState('description') // 'description' | 'testcases' | 'submissions'
  const [submissions, setSubmissions] = useState([])
  const [isLoadingSubmissions, setIsLoadingSubmissions] = useState(false)
  const [selectedTestCaseIndex, setSelectedTestCaseIndex] = useState(0)
  const [copiedCodeIndex, setCopiedCodeIndex] = useState(null)

  // Fetch Problem Data
  useEffect(() => {
    const fetchProblem = async () => {
      if (!problemId) return
      setIsLoading(true)
      setError(null)
      try {
        const data = await getProblemById(problemId)
        const problemData = data.data?.problem || data.data || data
        if (problemData) {
          setProblem(problemData)
        } else {
          throw new Error('Problem data not found')
        }
      } catch (err) {
        console.error('Error loading problem:', err)
        setError('Failed to load problem details. Please try again.')
        toast({ title: 'Error', description: 'Could not load problem.', variant: 'destructive' })
      } finally {
        setIsLoading(false)
      }
    }
    fetchProblem()
  }, [problemId])

  // Load Submissions History
  const fetchSubmissions = useCallback(async () => {
    if (!problemId || !user) return
    setIsLoadingSubmissions(true)
    try {
      const res = await getProblemSubmissions(problemId)
      const list = Array.isArray(res) ? res : res?.data || []
      setSubmissions(list)
    } catch (err) {
      console.warn('Could not load submissions:', err)
    } finally {
      setIsLoadingSubmissions(false)
    }
  }, [problemId, user])

  useEffect(() => {
    if (activeLeftTab === 'submissions') {
      fetchSubmissions()
    }
  }, [activeLeftTab, fetchSubmissions])

  // Set default code template when language changes
  const handleLanguageChange = (newLang) => {
    setLanguage(newLang)
    if (codeTemplates[newLang]) {
      setCode(codeTemplates[newLang])
    }
  }

  // Parse Test Cases
  const getTestCases = useCallback(() => {
    try {
      if (!problem?.testCases) return []
      if (Array.isArray(problem.testCases)) return problem.testCases
      return JSON.parse(problem.testCases)
    } catch (e) {
      return []
    }
  }, [problem])

  // Helper to normalize outputs for strict but fair comparison
  const normalizeOutput = (str) => {
    if (typeof str !== 'string') return ''
    return str
      .replace(/\r\n/g, '\n')
      .trim()
      .split('\n')
      .map(line => line.trimEnd())
      .join('\n')
  }

  // Common Judge0 Execution Helper
  const executeJudge0 = async (sourceCode, lang, stdin = '') => {
    const apiKey = import.meta.env.VITE_JUDGE0_API_KEY
    const options = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'Content-Type': 'application/json',
        'X-RapidAPI-Key': apiKey,
        'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
      },
      body: JSON.stringify({
        source_code: sourceCode,
        language_id: languageApiMap[lang],
        stdin: stdin
      })
    }

    const submissionResponse = await fetch('https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&fields=*', options)
    if (!submissionResponse.ok) {
      const errText = await submissionResponse.text().catch(() => '')
      throw new Error(`Compiler API error (${submissionResponse.status}): ${errText || 'Submission request failed'}`)
    }
    const submissionResult = await submissionResponse.json()
    const submissionToken = submissionResult.token

    let finalResult
    for (let attempt = 0; attempt < 12; attempt++) {
      await new Promise(resolve => setTimeout(resolve, 1500))
      const resultResponse = await fetch(`https://judge0-ce.p.rapidapi.com/submissions/${submissionToken}?base64_encoded=false&fields=*`, {
        headers: { 'X-RapidAPI-Key': apiKey, 'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com' }
      })
      finalResult = await resultResponse.json()
      if (finalResult.status_id > 2) break
    }
    return finalResult
  }

  // Run Code via Judge0 for current testcase
  const runCode = async () => {
    if (isRunning || isSubmitting) return
    setIsRunning(true)
    setOutput('Running test case...\n')
    setTestResults([])

    const cases = getTestCases()
    const activeCase = cases[selectedTestCaseIndex]
    const stdinInput = activeCase?.input || ''

    try {
      const finalResult = await executeJudge0(code, language, stdinInput)

      if (finalResult.stdout) {
        setOutput(finalResult.stdout)
        const isPassed = activeCase ? normalizeOutput(finalResult.stdout) === normalizeOutput(activeCase.output) : true
        setTestResults([{
          passed: isPassed,
          input: activeCase?.input || 'Default',
          expected: activeCase?.output || 'No expected output',
          actual: finalResult.stdout.trim(),
          executionTime: finalResult.time,
          memory: finalResult.memory
        }])
        toast({
          title: isPassed ? 'Test Case Passed' : 'Test Case Failed',
          description: isPassed ? 'Your code produced the expected output!' : 'Output differs from expected.',
          variant: isPassed ? 'default' : 'destructive'
        })
      } else if (finalResult.stderr) {
        setOutput(`Runtime Error:\n${finalResult.stderr}`)
        setTestResults([{ passed: false, error: finalResult.stderr }])
        toast({ title: 'Runtime Error', description: 'See error details below.', variant: 'destructive' })
      } else if (finalResult.compile_output) {
        setOutput(`Compilation Error:\n${finalResult.compile_output}`)
        setTestResults([{ passed: false, error: finalResult.compile_output }])
        toast({ title: 'Compilation Error', description: 'Fix syntax issues in code.', variant: 'destructive' })
      } else {
        setOutput(`Status: ${finalResult.status?.description || 'Finished'}`)
      }
    } catch (error) {
      setOutput(`Execution Error: ${error.message}`)
      toast({ title: 'Execution Failed', description: error.message, variant: 'destructive' })
    } finally {
      setIsRunning(false)
    }
  }

  // Submit Solution: Rigorously evaluate against ALL test cases before deciding ACCEPTED
  const submitSolution = async () => {
    if (isSubmitting || isRunning) return
    setIsSubmitting(true)
    setOutput('Submitting solution & testing against all test cases...\n')
    setTestResults([])

    try {
      const cases = getTestCases()
      let finalStatus = 'ACCEPTED'
      let failureDetails = null
      const evaluatedResults = []

      if (cases.length > 0) {
        for (let i = 0; i < cases.length; i++) {
          const tc = cases[i]
          setOutput(prev => prev + `Testing Case ${i + 1}/${cases.length}...\n`)

          const result = await executeJudge0(code, language, tc.input || '')

          if (result.compile_output) {
            finalStatus = 'COMPILATION_ERROR'
            setOutput(`Compilation Error:\n${result.compile_output}`)
            evaluatedResults.push({ passed: false, error: result.compile_output })
            break
          }

          if (result.stderr) {
            finalStatus = 'RUNTIME_ERROR'
            setOutput(`Runtime Error on Case ${i + 1}:\n${result.stderr}`)
            evaluatedResults.push({ passed: false, error: result.stderr, input: tc.input })
            break
          }

          const actualOutput = result.stdout || ''
          const isMatch = normalizeOutput(actualOutput) === normalizeOutput(tc.output || '')

          evaluatedResults.push({
            passed: isMatch,
            input: tc.input || 'None',
            expected: tc.output || '',
            actual: actualOutput.trim(),
            executionTime: result.time,
            memory: result.memory
          })

          if (!isMatch) {
            finalStatus = 'WRONG_ANSWER'
            failureDetails = {
              caseNum: i + 1,
              input: tc.input,
              expected: tc.output,
              actual: actualOutput.trim()
            }
            setOutput(
              `❌ Wrong Answer on Test Case ${i + 1}!\n` +
              `Input:    ${tc.input}\n` +
              `Expected: ${tc.output}\n` +
              `Actual:   ${actualOutput.trim()}\n`
            )
            break // Stop at first failing testcase like LeetCode
          }
        }
      } else {
        // Fallback for problems with no formal test cases: check compilation & clean execution
        const result = await executeJudge0(code, language, '')
        if (result.compile_output) {
          finalStatus = 'COMPILATION_ERROR'
          setOutput(`Compilation Error:\n${result.compile_output}`)
          evaluatedResults.push({ passed: false, error: result.compile_output })
        } else if (result.stderr) {
          finalStatus = 'RUNTIME_ERROR'
          setOutput(`Runtime Error:\n${result.stderr}`)
          evaluatedResults.push({ passed: false, error: result.stderr })
        } else {
          setOutput(result.stdout || 'Program executed successfully.')
          evaluatedResults.push({ passed: true, actual: result.stdout })
        }
      }

      setTestResults(evaluatedResults)

      if (finalStatus === 'ACCEPTED') {
        setOutput(prev => prev + `\n🎉 All test cases passed! Solution Accepted.`)
      }

      // Record evaluated submission in backend
      const submissionData = { code, language, status: finalStatus }
      const response = await submitSolutionApi(problemId, submissionData)

      if (response && (response.success || response.id || response.data)) {
        if (finalStatus === 'ACCEPTED') {
          toast({
            title: '🎉 Solution Accepted!',
            description: 'All test cases passed! Points awarded.',
            variant: 'default'
          })
          if (typeof refreshUser === 'function') {
            await refreshUser()
          }
        } else {
          toast({
            title: finalStatus === 'WRONG_ANSWER' ? '❌ Wrong Answer' : '⚠️ Compilation/Runtime Error',
            description: failureDetails 
              ? `Failed on test case ${failureDetails.caseNum}. Output did not match expected.` 
              : 'Your code did not pass all tests.',
            variant: 'destructive'
          })
        }

        // Refresh submissions tab & switch to it
        fetchSubmissions()
        setActiveLeftTab('submissions')
      } else {
        throw new Error(response?.message || 'Submission failed')
      }
    } catch (error) {
      setOutput(prev => prev + `\nSubmission Error: ${error.message}`)
      toast({ title: 'Submission Failed', description: error.message || 'Evaluation error', variant: 'destructive' })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Keyboard Shortcuts: Ctrl+Enter (Run), Ctrl+Shift+Enter (Submit)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault()
        if (e.shiftKey) {
          submitSolution()
        } else {
          runCode()
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [code, language, isRunning, isSubmitting, testResults])

  const confirmResetCode = () => {
    setCode(codeTemplates[language] || '')
    setOutput('')
    setTestResults([])
    setShowResetModal(false)
    toast({ title: 'Editor Reset', description: 'Restored original starter template.' })
  }

  const loadPastSubmissionCode = (subCode, subLang) => {
    if (subLang && languageApiMap[subLang.toLowerCase()]) {
      setLanguage(subLang.toLowerCase())
    }
    setCode(subCode)
    toast({ title: 'Solution Loaded', description: 'Restored submission code to editor.' })
  }

  const copyToClipboard = (text, idx) => {
    navigator.clipboard.writeText(text)
    setCopiedCodeIndex(idx)
    setTimeout(() => setCopiedCodeIndex(null), 2000)
    toast({ title: 'Copied', description: 'Code copied to clipboard.' })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-muted-foreground font-medium">Loading problem details...</p>
        </div>
      </div>
    )
  }

  if (error || !problem) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-6 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mx-auto">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-bold">Failed to Load Problem</h2>
          <p className="text-sm text-muted-foreground">{error || 'Problem not found'}</p>
          <Button variant="outline" className="w-full" onClick={() => navigate('/sheets')}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Return to Sheets
          </Button>
        </Card>
      </div>
    )
  }

  const testCases = getTestCases()

  return (
    <div className={`min-h-screen bg-background relative ${isFullscreen ? 'overflow-hidden' : ''}`}>
      {/* Top Header Navigation */}
      <div className="border-b border-border bg-card/60 backdrop-blur-md sticky top-0 z-30 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/sheets">
                <ArrowLeft className="h-4 w-4 mr-1.5" /> Back
              </Link>
            </Button>
            <div className="h-4 w-px bg-border" />
            <h1 className="font-semibold text-foreground text-lg flex items-center gap-2">
              {problem.title}
              <Badge variant={problem.difficulty === 'Easy' ? 'default' : problem.difficulty === 'Medium' ? 'secondary' : 'destructive'} className="text-xs">
                {problem.difficulty}
              </Badge>
              <Badge variant="outline" className="text-xs text-primary border-primary/30">
                {problem.points} Pts
              </Badge>
            </h1>
          </div>

          <div className="flex items-center space-x-3">
            <div className="hidden md:flex items-center text-xs text-muted-foreground gap-3 mr-2 bg-muted/40 px-3 py-1.5 rounded-lg border border-border/50">
              <span className="flex items-center gap-1"><Keyboard className="w-3.5 h-3.5" /> <kbd className="font-mono bg-background px-1 rounded border">Ctrl</kbd> + <kbd className="font-mono bg-background px-1 rounded border">↵</kbd> Run</span>
              <span className="text-border">|</span>
              <span className="flex items-center gap-1"><kbd className="font-mono bg-background px-1 rounded border">Ctrl</kbd> + <kbd className="font-mono bg-background px-1 rounded border">Shift</kbd> + <kbd className="font-mono bg-background px-1 rounded border">↵</kbd> Submit</span>
            </div>

            <Button
              size="sm"
              variant="outline"
              onClick={runCode}
              disabled={isRunning}
              className="gap-1.5 border-emerald-500/30 text-emerald-600 hover:bg-emerald-500/10 dark:text-emerald-400"
            >
              {isRunning ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4 fill-current" />}
              {isRunning ? 'Running...' : 'Run'}
            </Button>

            <Button
              size="sm"
              onClick={submitSolution}
              disabled={isSubmitting}
              className="gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm"
            >
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Split Layout */}
      <div className="p-4 md:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Left Column: Problem Information & Submissions */}
          <Card className="border border-border shadow-md h-[calc(100vh-140px)] flex flex-col bg-card/90 overflow-hidden">
            {/* Left Column Tabs */}
            <div className="border-b border-border bg-muted/30 px-4 pt-3 flex gap-2">
              <button
                onClick={() => setActiveLeftTab('description')}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
                  activeLeftTab === 'description'
                    ? 'border-primary text-primary font-semibold'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <Code2 className="w-4 h-4" /> Description
              </button>
              <button
                onClick={() => setActiveLeftTab('testcases')}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
                  activeLeftTab === 'testcases'
                    ? 'border-primary text-primary font-semibold'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <Terminal className="w-4 h-4" /> Test Cases ({testCases.length})
              </button>
              <button
                onClick={() => setActiveLeftTab('submissions')}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
                  activeLeftTab === 'submissions'
                    ? 'border-primary text-primary font-semibold'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <History className="w-4 h-4" /> Submissions
              </button>
            </div>

            {/* Left Column Content */}
            <div className="p-6 overflow-y-auto flex-1 custom-scrollbar space-y-6">
              {activeLeftTab === 'description' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-2">{problem.title}</h2>
                    <div className="flex flex-wrap gap-2 items-center">
                      <Badge variant={problem.difficulty === 'Easy' ? 'default' : problem.difficulty === 'Medium' ? 'secondary' : 'destructive'}>
                        {problem.difficulty}
                      </Badge>
                      <Badge variant="outline">{problem.points} Points</Badge>
                      {problem.tags && problem.tags.map((tag, i) => (
                        <Badge key={i} variant="outline" className="bg-muted/40 text-muted-foreground text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="prose dark:prose-invert max-w-none text-foreground/90 text-sm leading-relaxed whitespace-pre-wrap">
                    {problem.description}
                  </div>

                  {testCases.length > 0 && (
                    <div className="space-y-4 pt-4 border-t border-border">
                      <h3 className="font-semibold text-sm text-foreground flex items-center gap-2">
                        <Terminal className="w-4 h-4 text-primary" /> Example Test Cases
                      </h3>
                      {testCases.map((tc, idx) => (
                        <div key={idx} className="bg-muted/40 border border-border rounded-xl p-4 text-xs font-mono space-y-2">
                          <div className="font-semibold text-muted-foreground uppercase text-[10px] tracking-wider">Example {idx + 1}</div>
                          <div><span className="text-muted-foreground">Input: </span><span className="text-primary font-medium">{tc.input}</span></div>
                          <div><span className="text-muted-foreground">Output: </span><span className="text-emerald-500 font-medium">{tc.output}</span></div>
                          {tc.explanation && (
                            <div className="text-muted-foreground font-sans pt-1 border-t border-border/50 text-[11px]">
                              <span className="font-semibold">Explanation: </span>{tc.explanation}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeLeftTab === 'testcases' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-foreground">Sample Test Cases</h3>
                    <span className="text-xs text-muted-foreground">Selected case runs with compiler</span>
                  </div>

                  {testCases.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground text-sm">
                      No explicit sample test cases provided for this problem.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex gap-2 border-b border-border pb-2 overflow-x-auto">
                        {testCases.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => setSelectedTestCaseIndex(idx)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                              selectedTestCaseIndex === idx
                                ? 'bg-primary text-primary-foreground shadow-sm'
                                : 'bg-muted/60 text-muted-foreground hover:bg-muted'
                            }`}
                          >
                            Case {idx + 1}
                          </button>
                        ))}
                      </div>

                      {testCases[selectedTestCaseIndex] && (
                        <div className="space-y-4 bg-muted/30 border border-border rounded-xl p-4">
                          <div>
                            <label className="text-xs font-semibold text-muted-foreground uppercase">Input</label>
                            <div className="mt-1.5 p-3 rounded-lg bg-background border border-border font-mono text-xs text-primary">
                              {testCases[selectedTestCaseIndex].input || '(No input required)'}
                            </div>
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-muted-foreground uppercase">Expected Output</label>
                            <div className="mt-1.5 p-3 rounded-lg bg-background border border-border font-mono text-xs text-emerald-500">
                              {testCases[selectedTestCaseIndex].output || '(No output expected)'}
                            </div>
                          </div>
                          {testCases[selectedTestCaseIndex].explanation && (
                            <div>
                              <label className="text-xs font-semibold text-muted-foreground uppercase">Explanation</label>
                              <div className="mt-1.5 p-3 rounded-lg bg-background border border-border text-xs text-muted-foreground">
                                {testCases[selectedTestCaseIndex].explanation}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {activeLeftTab === 'submissions' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-foreground">Your Past Submissions</h3>
                    <Button variant="ghost" size="sm" onClick={fetchSubmissions} disabled={isLoadingSubmissions} className="h-8 px-2 text-xs">
                      <History className={`w-3.5 h-3.5 mr-1 ${isLoadingSubmissions ? 'animate-spin' : ''}`} /> Refresh
                    </Button>
                  </div>

                  {isLoadingSubmissions ? (
                    <div className="py-12 flex justify-center">
                      <Loader2 className="w-6 h-6 animate-spin text-primary" />
                    </div>
                  ) : submissions.length === 0 ? (
                    <div className="text-center py-12 border border-dashed border-border rounded-xl p-6">
                      <FileCode className="w-10 h-10 text-muted-foreground/40 mx-auto mb-2" />
                      <p className="text-sm font-medium text-foreground">No submissions yet</p>
                      <p className="text-xs text-muted-foreground mt-1">Submit your first solution to track your progress!</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {submissions.map((sub, idx) => {
                        const isAccepted = sub.status === 'ACCEPTED'
                        return (
                          <div
                            key={sub.id || idx}
                            className="p-4 rounded-xl border border-border bg-card hover:bg-muted/30 transition-all space-y-3"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                {isAccepted ? (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                ) : (
                                  <XCircle className="w-4 h-4 text-destructive" />
                                )}
                                <span className={`text-xs font-bold ${isAccepted ? 'text-emerald-500' : 'text-destructive'}`}>
                                  {sub.status || 'SUBMITTED'}
                                </span>
                                <Badge variant="outline" className="text-[10px] uppercase font-mono">
                                  {sub.language || 'Code'}
                                </Badge>
                              </div>
                              <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {sub.submittedAt ? new Date(sub.submittedAt).toLocaleDateString() + ' ' + new Date(sub.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recent'}
                              </span>
                            </div>

                            {sub.code && (
                              <div className="flex items-center justify-end gap-2 pt-1 border-t border-border/50">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 text-xs gap-1"
                                  onClick={() => copyToClipboard(sub.code, idx)}
                                >
                                  {copiedCodeIndex === idx ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                                  {copiedCodeIndex === idx ? 'Copied' : 'Copy'}
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-7 text-xs gap-1"
                                  onClick={() => loadPastSubmissionCode(sub.code, sub.language)}
                                >
                                  <Code2 className="w-3.5 h-3.5" /> Load into Editor
                                </Button>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          </Card>

          {/* Right Column: Code Editor & Execution Panel */}
          <div className={isFullscreen ? 'fixed inset-0 z-50 p-6 bg-background/95 backdrop-blur-xl flex flex-col' : 'space-y-4'}>
            <Card className="border border-border shadow-md bg-card/90 overflow-hidden flex flex-col">
              {/* Editor Header Bar */}
              <div className="border-b border-border bg-muted/40 px-4 py-2.5 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-xs font-semibold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <Code2 className="w-4 h-4 text-primary" /> Editor
                  </span>
                  <select
                    value={language}
                    onChange={(e) => handleLanguageChange(e.target.value)}
                    className="px-3 py-1 bg-background border border-border rounded-lg text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="javascript">JavaScript (Node.js)</option>
                    <option value="python">Python 3</option>
                    <option value="java">Java (OpenJDK 17)</option>
                    <option value="cpp">C++ (GCC 9.2)</option>
                  </select>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowResetModal(true)}
                    className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
                    title="Reset to starter template"
                  >
                    <RotateCcw className="h-3.5 w-3.5 mr-1" /> Reset
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
                    title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Editor'}
                  >
                    {isFullscreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
                  </Button>
                </div>
              </div>

              {/* Monaco Editor Component */}
              <div className="p-2 bg-zinc-950">
                <CodeEditor
                  language={language}
                  value={code}
                  onChange={setCode}
                  height={isFullscreen ? 'calc(100vh - 280px)' : '48vh'}
                />
              </div>

              {/* Output and Execution Results Pane */}
              <div className="border-t border-border bg-card p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Terminal className="h-4 w-4 text-primary" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-foreground">Output Console</span>
                  </div>
                  {isRunning && (
                    <span className="text-xs text-primary flex items-center gap-1.5 animate-pulse">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> Compiling & Executing...
                    </span>
                  )}
                </div>

                <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-3 min-h-[100px] max-h-[160px] overflow-y-auto font-mono text-xs text-zinc-300 custom-scrollbar">
                  {output ? (
                    <pre className="whitespace-pre-wrap">{output}</pre>
                  ) : (
                    <span className="text-zinc-600 italic">Run your code to see output results here...</span>
                  )}
                </div>

                {testResults.length > 0 && testResults[0].actual && (
                  <div className="pt-2 flex items-center justify-between text-xs border-t border-border">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Test Case 1:</span>
                      {testResults[0].passed ? (
                        <Badge variant="default" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">Passed</Badge>
                      ) : (
                        <Badge variant="destructive">Wrong Output</Badge>
                      )}
                    </div>
                    {testResults[0].executionTime && (
                      <span className="text-muted-foreground text-[11px]">Time: {testResults[0].executionTime}s</span>
                    )}
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Reset Code Confirmation Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl p-6 max-w-sm w-full shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-destructive/10 text-destructive flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground">Reset Code?</h3>
                <p className="text-xs text-muted-foreground">Your changes will be replaced with the default code template.</p>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-2">
              <Button variant="outline" size="sm" onClick={() => setShowResetModal(false)}>
                Cancel
              </Button>
              <Button variant="destructive" size="sm" onClick={confirmResetCode}>
                Confirm Reset
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProblemSolver