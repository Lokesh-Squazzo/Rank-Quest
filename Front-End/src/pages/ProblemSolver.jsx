import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Play, Send, RotateCcw, Code2, Terminal, Loader2 } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../hooks/useToast'

// --- FIX: Correct Import Path based on your folder structure ---
import CodeEditor from '../components/CodeEditor'

// Import API services
import { getProblemById, submitSolution as submitSolutionApi } from '../services/apiService'

const languageApiMap = {
  javascript: 93,
  python: 71,
  java: 62,
  cpp: 54
};

const ProblemSolver = () => {
  const { problemId } = useParams()
  const navigate = useNavigate()
  const { refreshUser } = useAuth() 
  const { toast } = useToast()
  
  const [problem, setProblem] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const [code, setCode] = useState('')
  const [language, setLanguage] = useState('javascript')
  const [isRunning, setIsRunning] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [output, setOutput] = useState('')
  const [testResults, setTestResults] = useState([])
  
  const codeTemplates = {
    javascript: `// Write your solution here\nconsole.log("Hello from JavaScript!");`,
    python: `# Write your solution here\nprint("Hello from Python!")`,
    java: `public class Main {\n\tpublic static void main(String[] args) {\n\t\tSystem.out.println("Hello from Java!");\n\t}\n}`,
    cpp: `#include <iostream>\nint main() {\n\tstd::cout << "Hello from C++!" << std::endl;\n\treturn 0;\n}`
  }

  // Fetch Problem Data
  useEffect(() => {
    const fetchProblem = async () => {
      if (!problemId) return;
      
      setIsLoading(true);
      setError(null);
      try {
        console.log("Fetching problem ID:", problemId); // Debugging log
        const data = await getProblemById(problemId);
        
        // API structure check: backend returns { data: { problem: ... } } or just { ... }?
        // Adjusting based on your API spec which usually returns { data: { problem: ... } }
        const problemData = data.data?.problem || data; 

        if (problemData) {
            setProblem(problemData);
        } else {
            throw new Error("Problem data not found");
        }
      } catch (err) {
        console.error("Error loading problem:", err);
        setError("Failed to load problem details. Please try again.");
        toast({ title: "Error", description: "Could not load problem.", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    }
    fetchProblem();
  }, [problemId]);

  // Set default code
  useEffect(() => {
    if (codeTemplates[language]) {
        setCode(codeTemplates[language])
    }
  }, [language])

  const resetCode = () => {
    setCode(codeTemplates[language])
    setOutput('')
    setTestResults([])
  }

  const runCode = async () => {
    setIsRunning(true);
    setOutput('');
    setTestResults([]);
    
    // --- Your API Key ---
    const apiKey = import.meta.env.VITE_JUDGE0_API_KEY; 

    const options = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'Content-Type': 'application/json',
        'X-RapidAPI-Key': apiKey,
        'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
      },
      body: JSON.stringify({
        source_code: code,
        language_id: languageApiMap[language],
      })
    };

    try {
      const submissionResponse = await fetch('https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&fields=*', options);
      if (!submissionResponse.ok) throw new Error('Submission failed');
      const submissionResult = await submissionResponse.json();
      const submissionToken = submissionResult.token;

      let finalResult;
      while (true) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        const resultResponse = await fetch(`https://judge0-ce.p.rapidapi.com/submissions/${submissionToken}?base64_encoded=false&fields=*`, {
          headers: { 'X-RapidAPI-Key': apiKey, 'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com' }
        });
        finalResult = await resultResponse.json();
        if (finalResult.status_id > 2) break;
      }

      if (finalResult.stdout) {
        setOutput(finalResult.stdout);
        setTestResults([{ passed: true, input: 'Hidden', expected: 'Hidden', actual: finalResult.stdout.trim() }]);
      } else if (finalResult.stderr) {
        setOutput(`Error:\n${finalResult.stderr}`);
      } else {
        setOutput(`Execution Finished: ${finalResult.status.description}`);
      }
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  const submitSolution = async () => {
    setIsSubmitting(true)
    try {
      if (testResults.length === 0) {
        toast({ title: 'Run Code First', description: 'Please verify code before submitting.', variant: 'destructive' });
        setIsSubmitting(false);
        return;
      }

      const passed = testResults.every(r => r.passed);
      const status = passed ? "ACCEPTED" : "WRONG_ANSWER";

      const submissionData = { code, language, status };
      
      // Ensure problemId is passed correctly
      const response = await submitSolutionApi(problemId, submissionData);
      
      if (response && response.success) {
        toast({
          title: status === "ACCEPTED" ? 'Solution Accepted!' : 'Wrong Answer',
          description: status === "ACCEPTED" ? `Great job! Points have been added.` : `Check your logic.`,
          variant: status === "ACCEPTED" ? 'default' : 'destructive'
        });
        if (status === "ACCEPTED") {
            await refreshUser();
            setTimeout(() => navigate('/sheets'), 2000);
        }
      } else {
         throw new Error(response?.message || "Submission failed");
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Submission failed.', variant: 'destructive' })
    } finally {
      setIsSubmitting(false)
    }
  }

  // --- SAFETY CHECKS TO PREVENT WHITE SCREEN ---
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading problem details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
            <h2 className="text-xl font-bold text-red-500 mb-2">Error</h2>
            <p className="text-muted-foreground">{error}</p>
            <Button variant="outline" className="mt-4" onClick={() => navigate('/sheets')}>Go Back</Button>
        </div>
      </div>
    );
  }

  // Helper to parse test cases safely
  const getTestCases = () => {
      try {
          return JSON.parse(problem?.testCases || "[]");
      } catch (e) {
          return [];
      }
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="relative z-10">
        <div className="container mx-auto px-4 py-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column: Problem Description */}
            <Card className="glass-dark border-0 shadow-2xl h-full max-h-[85vh] overflow-y-auto custom-scrollbar">
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle className="text-2xl mb-2">{problem?.title}</CardTitle>
                            <div className="flex gap-2">
                                <Badge variant={problem?.difficulty === 'Easy' ? 'default' : problem?.difficulty === 'Medium' ? 'secondary' : 'destructive'}>
                                    {problem?.difficulty}
                                </Badge>
                                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                                    {problem?.points} Points
                                </Badge>
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="prose prose-invert max-w-none">
                        <p className="text-muted-foreground whitespace-pre-wrap">{problem?.description}</p>
                    </div>

                    {/* Test Cases Table */}
                    {getTestCases().length > 0 && (
                        <div className="mt-6">
                            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                <Terminal className="w-4 h-4 text-primary" /> 
                                Example Test Cases
                            </h3>
                            <div className="rounded-xl border border-white/10 overflow-hidden">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-white/5 text-muted-foreground">
                                        <tr>
                                            <th className="px-4 py-3 font-medium">Input</th>
                                            <th className="px-4 py-3 font-medium">Output</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/10">
                                        {getTestCases().map((tc, idx) => (
                                            <tr key={idx} className="hover:bg-white/5 transition-colors">
                                                <td className="px-4 py-3 font-mono text-blue-300">{tc.input}</td>
                                                <td className="px-4 py-3 font-mono text-green-300">{tc.output}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Right Column: Code Editor */}
            <Card className="glass-dark border-0 shadow-2xl">
              <CardHeader className="p-6">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl flex items-center gap-2">
                      <Code2 className="w-5 h-5 text-primary" /> Code Editor
                  </CardTitle>
                  <select value={language} onChange={(e) => setLanguage(e.target.value)} className="px-4 py-2 bg-background/50 border border-white/20 rounded-xl text-sm">
                    <option value="python">Python</option>
                    <option value="javascript">JavaScript</option>
                    <option value="java">Java</option>
                    <option value="cpp">C++</option>
                  </select>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-3">
                      <Button size="sm" onClick={runCode} disabled={isRunning} className="bg-emerald-600 hover:bg-emerald-700">
                        <Play className="h-4 w-4 mr-2" /> {isRunning ? 'Running...' : 'Run'}
                      </Button>
                      <Button size="sm" onClick={submitSolution} disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700">
                        <Send className="h-4 w-4 mr-2" /> {isSubmitting ? 'Submitting...' : 'Submit'}
                      </Button>
                    </div>
                    <Button variant="outline" size="sm" onClick={resetCode}><RotateCcw className="h-4 w-4 mr-2" /> Reset</Button>
                  </div>

                  <CodeEditor
                    language={language}
                    value={code}
                    onChange={setCode}
                  />

                  {output && (
                    <div className="border-t border-white/10 pt-4">
                      <h4 className="font-semibold mb-3">Output</h4>
                      <div className="mb-4 p-4 bg-background/30 border border-white/10 rounded-xl">
                        <pre className="text-sm whitespace-pre-wrap">{output}</pre>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProblemSolver