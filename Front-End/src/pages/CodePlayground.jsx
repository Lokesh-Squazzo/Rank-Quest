import { useState, useEffect, useCallback } from 'react';
import {
  Play,
  Loader2,
  Maximize2,
  Minimize2,
  Copy,
  Check,
  Download,
  RotateCcw,
  Trash2,
  Terminal,
  Code2,
  Cpu,
  Clock,
  Layers,
  Sparkles,
  BookOpen,
  AlertTriangle,
  FileCode,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import CodeEditor from '../components/CodeEditor';
import { useToast } from '../hooks/useToast';

// Supported Languages and Judge0 CE API Language IDs
const LANGUAGES = [
  { id: 'python', name: 'Python 3', ext: 'py', judgeId: 71 },
  { id: 'javascript', name: 'JavaScript (Node.js)', ext: 'js', judgeId: 93 },
  { id: 'typescript', name: 'TypeScript', ext: 'ts', judgeId: 74 },
  { id: 'cpp', name: 'C++ (GCC 9.2)', ext: 'cpp', judgeId: 54 },
  { id: 'c', name: 'C (GCC 9.2)', ext: 'c', judgeId: 50 },
  { id: 'java', name: 'Java (OpenJDK 13)', ext: 'java', judgeId: 62 },
  { id: 'go', name: 'Go (1.13)', ext: 'go', judgeId: 60 },
  { id: 'rust', name: 'Rust (1.40)', ext: 'rs', judgeId: 73 }
];

const DEFAULT_TEMPLATES = {
  python: `# Python 3 Playground\nimport sys\n\ndef main():\n    print("🚀 Hello from RankQuest Python Playground!")\n    # Read custom input if provided\n    lines = sys.stdin.read().splitlines()\n    if lines:\n        print(f"Stdin received {len(lines)} line(s):", lines)\n\nif __name__ == "__main__":\n    main()`,
  javascript: `// JavaScript (Node.js) Playground\nconst fs = require('fs');\n\nfunction main() {\n    console.log("🚀 Hello from RankQuest JavaScript Playground!");\n    try {\n        const input = fs.readFileSync(0, 'utf-8').trim();\n        if (input) {\n            console.log("Stdin received:", input);\n        }\n    } catch (e) {}\n}\n\nmain();`,
  typescript: `// TypeScript Playground\nfunction greet(name: string): string {\n    return \`🚀 Hello \${name} from RankQuest TypeScript Playground!\`;\n}\n\nconsole.log(greet("Developer"));`,
  cpp: `// C++ (GCC 9.2) Playground\n#include <iostream>\n#include <vector>\n#include <string>\n\nusing namespace std;\n\nint main() {\n    cout << "🚀 Hello from RankQuest C++ Playground!" << endl;\n    string input;\n    if (cin >> input) {\n        cout << "First token from stdin: " << input << endl;\n    }\n    return 0;\n}`,
  c: `// C (GCC 9.2) Playground\n#include <stdio.h>\n\nint main() {\n    printf("🚀 Hello from RankQuest C Playground!\\n");\n    char buffer[256];\n    if (fgets(buffer, sizeof(buffer), stdin) != NULL) {\n        printf("Stdin received: %s", buffer);\n    }\n    return 0;\n}`,
  java: `// Java (OpenJDK 13) Playground\nimport java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("🚀 Hello from RankQuest Java Playground!");\n        Scanner scanner = new Scanner(System.in);\n        if (scanner.hasNextLine()) {\n            System.out.println("Stdin received: " + scanner.nextLine());\n        }\n    }\n}`,
  go: `// Go (1.13) Playground\npackage main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("🚀 Hello from RankQuest Go Playground!")\n}`,
  rust: `// Rust (1.40) Playground\nfn main() {\n    println!("🚀 Hello from RankQuest Rust Playground!");\n}`
};

// DSA Algorithm Starter Presets
const DSA_PRESETS = [
  {
    id: 'default',
    title: 'Starter Boilerplate',
    desc: 'Basic hello world and stdin/stdout boilerplate'
  },
  {
    id: 'two-sum',
    title: 'Two Sum (Hash Map)',
    desc: 'O(N) search with hash table mapping',
    templates: {
      python: `# Two Sum: Find two indices that sum to target\ndef two_sum(nums, target):\n    lookup = {}\n    for i, num in enumerate(nums):\n        complement = target - num\n        if complement in lookup:\n            return [lookup[complement], i]\n        lookup[num] = i\n    return []\n\nnums = [2, 7, 11, 15]\ntarget = 9\nprint(f"Nums: {nums}, Target: {target}")\nprint(f"Result Indices: {two_sum(nums, target)}")`,
      javascript: `// Two Sum: Find two indices that sum to target\nfunction twoSum(nums, target) {\n    const map = new Map();\n    for (let i = 0; i < nums.length; i++) {\n        const complement = target - nums[i];\n        if (map.has(complement)) {\n            return [map.get(complement), i];\n        }\n        map.set(nums[i], i);\n    }\n    return [];\n}\n\nconst nums = [2, 7, 11, 15];\nconst target = 9;\nconsole.log(\`Result Indices: \${JSON.stringify(twoSum(nums, target))}\`);`,
      cpp: `#include <iostream>\n#include <vector>\n#include <unordered_map>\n\nusing namespace std;\n\nvector<int> twoSum(vector<int>& nums, int target) {\n    unordered_map<int, int> mp;\n    for (int i = 0; i < nums.size(); i++) {\n        int comp = target - nums[i];\n        if (mp.count(comp)) return {mp[comp], i};\n        mp[nums[i]] = i;\n    }\n    return {};\n}\n\nint main() {\n    vector<int> nums = {2, 7, 11, 15};\n    int target = 9;\n    vector<int> res = twoSum(nums, target);\n    cout << "Result Indices: [" << res[0] << ", " << res[1] << "]" << endl;\n    return 0;\n}`,
      java: `import java.util.HashMap;\nimport java.util.Arrays;\n\npublic class Main {\n    public static int[] twoSum(int[] nums, int target) {\n        HashMap<Integer, Integer> map = new HashMap<>();\n        for (int i = 0; i < nums.length; i++) {\n            int comp = target - nums[i];\n            if (map.containsKey(comp)) return new int[]{map.get(comp), i};\n            map.put(nums[i], i);\n        }\n        return new int[]{};\n    }\n    public static void main(String[] args) {\n        int[] nums = {2, 7, 11, 15};\n        System.out.println("Result: " + Arrays.toString(twoSum(nums, 9)));\n    }\n}`
    }
  },
  {
    id: 'binary-search',
    title: 'Binary Search (O(log N))',
    desc: 'Standard binary search on sorted array',
    templates: {
      python: `# Binary Search: O(log N)\ndef binary_search(arr, target):\n    left, right = 0, len(arr) - 1\n    while left <= right:\n        mid = (left + right) // 2\n        if arr[mid] == target:\n            return mid\n        elif arr[mid] < target:\n            left = mid + 1\n        else:\n            right = mid - 1\n    return -1\n\narr = [1, 3, 5, 7, 9, 11, 15, 20]\ntarget = 9\nprint(f"Index of {target}:", binary_search(arr, target))`,
      javascript: `// Binary Search: O(log N)\nfunction binarySearch(arr, target) {\n    let left = 0, right = arr.length - 1;\n    while (left <= right) {\n        const mid = Math.floor((left + right) / 2);\n        if (arr[mid] === target) return mid;\n        if (arr[mid] < target) left = mid + 1;\n        else right = mid - 1;\n    }\n    return -1;\n}\n\nconst arr = [1, 3, 5, 7, 9, 11, 15, 20];\nconsole.log("Index of 9:", binarySearch(arr, 9));`,
      cpp: `#include <iostream>\n#include <vector>\n\nusing namespace std;\n\nint binarySearch(const vector<int>& arr, int target) {\n    int l = 0, r = arr.size() - 1;\n    while (l <= r) {\n        int mid = l + (r - l) / 2;\n        if (arr[mid] == target) return mid;\n        if (arr[mid] < target) l = mid + 1;\n        else r = mid - 1;\n    }\n    return -1;\n}\n\nint main() {\n    vector<int> arr = {1, 3, 5, 7, 9, 11, 15, 20};\n    cout << "Index of 9: " << binarySearch(arr, 9) << endl;\n    return 0;\n}`,
      java: `public class Main {\n    public static int binarySearch(int[] arr, int target) {\n        int l = 0, r = arr.length - 1;\n        while (l <= r) {\n            int mid = l + (r - l) / 2;\n            if (arr[mid] == target) return mid;\n            if (arr[mid] < target) l = mid + 1;\n            else r = mid - 1;\n        }\n        return -1;\n    }\n    public static void main(String[] args) {\n        int[] arr = {1, 3, 5, 7, 9, 11, 15, 20};\n        System.out.println("Index of 9: " + binarySearch(arr, 9));\n    }\n}`
    }
  },
  {
    id: 'bfs-graph',
    title: 'Graph BFS Traversal',
    desc: 'Breadth First Search using queue',
    templates: {
      python: `from collections import deque\n\ndef bfs(graph, start):\n    visited = set([start])\n    queue = deque([start])\n    order = []\n    while queue:\n        node = queue.popleft()\n        order.append(node)\n        for neighbor in graph.get(node, []):\n            if neighbor not in visited:\n                visited.add(neighbor)\n                queue.append(neighbor)\n    return order\n\ngraph = {\n    'A': ['B', 'C'],\n    'B': ['D', 'E'],\n    'C': ['F'],\n    'D': [], 'E': ['F'], 'F': []\n}\nprint("BFS Order:", bfs(graph, 'A'))`,
      javascript: `function bfs(graph, start) {\n    const visited = new Set([start]);\n    const queue = [start];\n    const order = [];\n    while (queue.length > 0) {\n        const node = queue.shift();\n        order.push(node);\n        for (const neighbor of (graph[node] || [])) {\n            if (!visited.has(neighbor)) {\n                visited.add(neighbor);\n                queue.push(neighbor);\n            }\n        }\n    }\n    return order;\n}\n\nconst graph = { A: ['B', 'C'], B: ['D', 'E'], C: ['F'], D: [], E: ['F'], F: [] };\nconsole.log("BFS Order:", bfs(graph, 'A'));`,
      cpp: `#include <iostream>\n#include <vector>\n#include <queue>\n#include <unordered_set>\n#include <unordered_map>\n\nusing namespace std;\n\nvoid bfs(unordered_map<char, vector<char>>& graph, char start) {\n    unordered_set<char> visited;\n    queue<char> q;\n    q.push(start);\n    visited.insert(start);\n    cout << "BFS Order: ";\n    while (!q.empty()) {\n        char curr = q.front();\n        q.pop();\n        cout << curr << " ";\n        for (char next : graph[curr]) {\n            if (!visited.count(next)) {\n                visited.insert(next);\n                q.push(next);\n            }\n        }\n    }\n    cout << endl;\n}\n\nint main() {\n    unordered_map<char, vector<char>> graph = {\n        {'A', {'B', 'C'}}, {'B', {'D', 'E'}}, {'C', {'F'}}\n    };\n    bfs(graph, 'A');\n    return 0;\n}`,
      java: `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Map<String, List<String>> graph = new HashMap<>();\n        graph.put("A", Arrays.asList("B", "C"));\n        graph.put("B", Arrays.asList("D", "E"));\n        graph.put("C", Arrays.asList("F"));\n        Queue<String> q = new LinkedList<>();\n        Set<String> visited = new HashSet<>();\n        q.add("A");\n        visited.add("A");\n        System.out.print("BFS Order: ");\n        while (!q.isEmpty()) {\n            String curr = q.poll();\n            System.out.print(curr + " ");\n            for (String next : graph.getOrDefault(curr, Collections.emptyList())) {\n                if (!visited.contains(next)) {\n                    visited.add(next);\n                    q.add(next);\n                }\n            }\n        }\n        System.out.println();\n    }\n}`
    }
  }
];

const CodePlayground = () => {
  const { toast } = useToast();

  // Load language from storage or default to python
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('rankquest_playground_lang') || 'python';
  });

  // Load code from per-language storage or template
  const [code, setCode] = useState(() => {
    const saved = localStorage.getItem(`rankquest_playground_code_${language}`);
    return saved !== null ? saved : DEFAULT_TEMPLATES[language] || DEFAULT_TEMPLATES.python;
  });

  const [userInput, setUserInput] = useState(() => {
    return localStorage.getItem('rankquest_playground_stdin') || '';
  });

  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState('output'); // 'output' | 'input' | 'metrics'
  const [metrics, setMetrics] = useState(null); // { time, memory, status, exitCode }
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fontSize, setFontSize] = useState(14);
  const [selectedPreset, setSelectedPreset] = useState('default');
  const [showResetModal, setShowResetModal] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedOutput, setCopiedOutput] = useState(false);

  // Auto-save code on changes
  useEffect(() => {
    localStorage.setItem(`rankquest_playground_code_${language}`, code);
  }, [code, language]);

  // Auto-save stdin
  useEffect(() => {
    localStorage.setItem('rankquest_playground_stdin', userInput);
  }, [userInput]);

  // Auto-save selected language
  useEffect(() => {
    localStorage.setItem('rankquest_playground_lang', language);
  }, [language]);

  // Handle Language Switch without wiping written code
  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    const existing = localStorage.getItem(`rankquest_playground_code_${newLang}`);
    if (existing !== null) {
      setCode(existing);
    } else {
      const template = DEFAULT_TEMPLATES[newLang] || '';
      setCode(template);
      localStorage.setItem(`rankquest_playground_code_${newLang}`, template);
    }
  };

  // Handle Preset Selection
  const handlePresetChange = (presetId) => {
    setSelectedPreset(presetId);
    if (presetId === 'default') {
      const templ = DEFAULT_TEMPLATES[language] || '';
      setCode(templ);
      toast({ title: 'Template Loaded', description: `Loaded basic ${language} boilerplate.` });
      return;
    }

    const preset = DSA_PRESETS.find((p) => p.id === presetId);
    if (preset && preset.templates) {
      const presetCode = preset.templates[language] || preset.templates.python;
      setCode(presetCode);
      toast({ title: 'Algorithm Loaded', description: `Loaded ${preset.title}.` });
    }
  };

  // Run Code via Judge0 API
  const runCode = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setActiveTab('output');
    setOutput('Compiling and executing code...\n');
    setMetrics(null);

    const apiKey = import.meta.env.VITE_JUDGE0_API_KEY;
    if (!apiKey) {
      setOutput('Error: VITE_JUDGE0_API_KEY is not configured in .env file.');
      setIsRunning(false);
      return;
    }

    const currentLang = LANGUAGES.find((l) => l.id === language) || LANGUAGES[0];

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
        language_id: currentLang.judgeId,
        stdin: userInput
      })
    };

    const startTime = performance.now();

    try {
      const submissionResponse = await fetch(
        'https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&fields=*',
        options
      );
      if (!submissionResponse.ok) {
        const errorText = await submissionResponse.text().catch(() => '');
        throw new Error(`Compiler API error (${submissionResponse.status}): ${errorText}`);
      }

      const submissionResult = await submissionResponse.json();
      const token = submissionResult.token;
      if (!token) throw new Error('No submission token received from compiler service.');

      let finalResult;
      for (let attempt = 0; attempt < 15; attempt++) {
        await new Promise((res) => setTimeout(res, 1200));
        const resultResponse = await fetch(
          `https://judge0-ce.p.rapidapi.com/submissions/${token}?base64_encoded=false&fields=*`,
          { headers: options.headers }
        );
        finalResult = await resultResponse.json();
        // Status ID: 1 = In Queue, 2 = Processing, > 2 = Finished
        if (finalResult.status_id > 2) break;
      }

      const elapsed = Math.round(performance.now() - startTime);

      setMetrics({
        time: finalResult?.time || (elapsed / 1000).toFixed(3),
        memory: finalResult?.memory || 0,
        statusId: finalResult?.status_id,
        statusDesc: finalResult?.status?.description || 'Finished',
        exitCode: finalResult?.exit_code ?? (finalResult?.status_id === 3 ? 0 : 1)
      });

      if (finalResult.stdout) {
        setOutput(finalResult.stdout);
        toast({ title: 'Execution Succeeded', description: `Finished in ${finalResult.time || '0.0'}s` });
      } else if (finalResult.compile_output) {
        setOutput(`[Compilation Error]\n${finalResult.compile_output}`);
        toast({ title: 'Compilation Failed', description: 'Review syntax errors.', variant: 'destructive' });
      } else if (finalResult.stderr) {
        setOutput(`[Runtime Error]\n${finalResult.stderr}`);
        toast({ title: 'Runtime Error', description: 'Check error details.', variant: 'destructive' });
      } else {
        setOutput(`Execution finished: ${finalResult.status?.description || 'Done'}`);
      }
    } catch (error) {
      setOutput(`[Execution Failed]\n${error.message}`);
      toast({ title: 'Execution Failed', description: error.message, variant: 'destructive' });
    } finally {
      setIsRunning(false);
    }
  };

  // Keyboard shortcut: Ctrl + Enter / Cmd + Enter
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        runCode();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [code, language, userInput, isRunning]);

  // Copy helpers
  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
    toast({ title: 'Code Copied', description: 'Source code copied to clipboard.' });
  };

  const handleCopyOutput = () => {
    navigator.clipboard.writeText(output);
    setCopiedOutput(true);
    setTimeout(() => setCopiedOutput(false), 2000);
    toast({ title: 'Output Copied', description: 'Console output copied to clipboard.' });
  };

  // Download Code File
  const handleDownloadFile = () => {
    const currentLang = LANGUAGES.find((l) => l.id === language) || LANGUAGES[0];
    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `solution.${currentLang.ext}`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: 'File Downloaded', description: `Saved as solution.${currentLang.ext}` });
  };

  // Reset to default template
  const handleConfirmReset = () => {
    const template = DEFAULT_TEMPLATES[language] || '';
    setCode(template);
    localStorage.setItem(`rankquest_playground_code_${language}`, template);
    setOutput('');
    setMetrics(null);
    setShowResetModal(false);
    toast({ title: 'Playground Reset', description: `Reset to initial ${language} starter.` });
  };

  const currentLang = LANGUAGES.find((l) => l.id === language) || LANGUAGES[0];

  return (
    <div className={`min-h-screen bg-background text-foreground pb-12 ${isFullscreen ? 'overflow-hidden' : ''}`}>
      {/* Top Header / Bar */}
      <div className="border-b border-border bg-card/60 backdrop-blur-md sticky top-16 z-20 px-4 sm:px-6 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-primary to-purple-600 text-white shadow-md shadow-primary/20">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-foreground">Interactive Code Playground</h1>
                <Badge variant="outline" className="hidden sm:inline-flex bg-primary/10 text-primary border-primary/20 text-[10px]">
                  Multi-Language IDE
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">Compile, test algorithms, and execute code in real-time</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="hidden lg:flex items-center text-xs text-muted-foreground gap-1.5 mr-2 bg-muted/40 px-3 py-1.5 rounded-lg border border-border/50">
              <span className="font-mono bg-background px-1.5 py-0.5 rounded border border-border">Ctrl</span>
              <span>+</span>
              <span className="font-mono bg-background px-1.5 py-0.5 rounded border border-border">↵</span>
              <span>to Run</span>
            </div>

            <Button
              onClick={runCode}
              disabled={isRunning}
              className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 font-medium px-5"
            >
              {isRunning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
              {isRunning ? 'Compiling...' : 'Run Code'}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className={isFullscreen ? 'fixed inset-0 z-50 p-4 bg-background/98 backdrop-blur-2xl flex flex-col' : 'grid grid-cols-1 lg:grid-cols-12 gap-6'}>
          {/* Left Column: Code Editor (7 cols) */}
          <div className={isFullscreen ? 'flex-1 flex flex-col' : 'lg:col-span-7 flex flex-col gap-4'}>
            <Card className="border border-border shadow-md bg-card/80 overflow-hidden flex flex-col flex-1">
              {/* Editor Header Toolbar */}
              <div className="border-b border-border bg-muted/40 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  {/* Language Selector */}
                  <div className="flex items-center space-x-1.5">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Lang:</span>
                    <select
                      value={language}
                      onChange={(e) => handleLanguageChange(e.target.value)}
                      className="px-3 py-1.5 bg-background border border-border rounded-lg text-xs font-medium focus:ring-1 focus:ring-primary"
                    >
                      {LANGUAGES.map((l) => (
                        <option key={l.id} value={l.id}>
                          {l.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Algorithm Presets */}
                  <div className="flex items-center space-x-1.5">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden sm:inline">
                      Preset:
                    </span>
                    <select
                      value={selectedPreset}
                      onChange={(e) => handlePresetChange(e.target.value)}
                      className="px-3 py-1.5 bg-background border border-border rounded-lg text-xs font-medium focus:ring-1 focus:ring-primary"
                    >
                      {DSA_PRESETS.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Toolbar Buttons */}
                <div className="flex items-center space-x-1.5">
                  {/* Font Size Selector */}
                  <select
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    className="px-2 py-1 bg-background border border-border rounded-md text-xs font-mono text-muted-foreground"
                    title="Editor Font Size"
                  >
                    <option value={12}>12px</option>
                    <option value={14}>14px</option>
                    <option value={16}>16px</option>
                    <option value={18}>18px</option>
                  </select>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleCopyCode}
                    className="h-7 w-7 text-muted-foreground hover:text-foreground"
                    title="Copy code"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleDownloadFile}
                    className="h-7 w-7 text-muted-foreground hover:text-foreground"
                    title={`Download as solution.${currentLang.ext}`}
                  >
                    <Download className="w-3.5 h-3.5" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowResetModal(true)}
                    className="h-7 w-7 text-muted-foreground hover:text-foreground"
                    title="Reset to template"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    className="h-7 w-7 text-muted-foreground hover:text-foreground"
                    title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                  >
                    {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                  </Button>
                </div>
              </div>

              {/* Monaco Code Editor */}
              <div className="p-2 bg-zinc-950 flex-1">
                <CodeEditor
                  language={language === 'c' ? 'cpp' : language}
                  value={code}
                  onChange={setCode}
                  fontSize={fontSize}
                  height={isFullscreen ? 'calc(100vh - 120px)' : '62vh'}
                />
              </div>

              <div className="border-t border-border px-4 py-2 bg-muted/20 flex items-center justify-between text-[11px] text-muted-foreground font-mono">
                <span>Auto-saved locally ({language})</span>
                <span>{code.length} characters</span>
              </div>
            </Card>
          </div>

          {/* Right Column: Terminal, Input & Execution Output (5 cols) */}
          {!isFullscreen && (
            <div className="lg:col-span-5 flex flex-col gap-4">
              <Card className="border border-border shadow-md bg-card/80 overflow-hidden flex flex-col h-full min-h-[500px]">
                {/* Console Navigation Tabs */}
                <div className="border-b border-border bg-muted/40 px-3 pt-2.5 flex items-center justify-between">
                  <div className="flex space-x-1">
                    <button
                      onClick={() => setActiveTab('output')}
                      className={`px-3 py-1.5 rounded-t-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                        activeTab === 'output'
                          ? 'bg-card text-foreground border-t-2 border-primary shadow-sm'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <Terminal className="w-3.5 h-3.5 text-primary" />
                      Output
                    </button>
                    <button
                      onClick={() => setActiveTab('input')}
                      className={`px-3 py-1.5 rounded-t-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                        activeTab === 'input'
                          ? 'bg-card text-foreground border-t-2 border-primary shadow-sm'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <FileCode className="w-3.5 h-3.5" />
                      Input (stdin)
                      {userInput.trim().length > 0 && (
                        <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block"></span>
                      )}
                    </button>
                    <button
                      onClick={() => setActiveTab('metrics')}
                      className={`px-3 py-1.5 rounded-t-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                        activeTab === 'metrics'
                          ? 'bg-card text-foreground border-t-2 border-primary shadow-sm'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <Cpu className="w-3.5 h-3.5" />
                      Metrics
                    </button>
                  </div>

                  <div className="flex items-center space-x-1 pb-1">
                    {activeTab === 'output' && output && (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={handleCopyOutput}
                          className="h-6 w-6 text-muted-foreground hover:text-foreground"
                          title="Copy Output"
                        >
                          {copiedOutput ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setOutput('')}
                          className="h-6 w-6 text-muted-foreground hover:text-foreground"
                          title="Clear Output"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </>
                    )}
                    {activeTab === 'input' && userInput && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setUserInput('')}
                        className="h-6 w-6 text-muted-foreground hover:text-foreground"
                        title="Clear Input"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                </div>

                {/* Tab 1: Console Output */}
                {activeTab === 'output' && (
                  <div className="p-4 flex flex-col flex-1 bg-zinc-950">
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-800 text-xs text-zinc-400">
                      <span className="font-semibold uppercase tracking-wider flex items-center gap-1.5">
                        <Terminal className="w-3.5 h-3.5 text-primary" /> Execution Console
                      </span>
                      {metrics && (
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className={`text-[10px] uppercase font-mono ${
                              metrics.statusId === 3
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                : 'bg-destructive/10 text-destructive border-destructive/30'
                            }`}
                          >
                            {metrics.statusDesc}
                          </Badge>
                          <span className="text-[11px] text-zinc-500 font-mono">{metrics.time}s</span>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 overflow-auto rounded-lg font-mono text-xs text-zinc-200 custom-scrollbar p-2">
                      {output ? (
                        <pre className="whitespace-pre-wrap font-mono leading-relaxed">{output}</pre>
                      ) : (
                        <div className="text-zinc-600 italic py-16 text-center">
                          <Terminal className="w-8 h-8 opacity-30 mx-auto mb-2" />
                          <p>Click "Run Code" or press Ctrl+Enter</p>
                          <p className="text-[11px] mt-1 text-zinc-700">Standard output and runtime errors will stream here.</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Tab 2: Custom Stdin Input */}
                {activeTab === 'input' && (
                  <div className="p-4 flex flex-col flex-1 bg-card">
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-border">
                      <p className="text-xs text-muted-foreground">
                        Data provided here is fed into <code className="text-primary font-mono">stdin</code> during execution.
                      </p>
                      <span className="text-[11px] text-muted-foreground font-mono">{userInput.length} chars</span>
                    </div>
                    <textarea
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      placeholder="Enter custom input here (e.g. array numbers, strings, test cases)..."
                      className="w-full flex-1 p-3 bg-zinc-950 border border-border rounded-xl font-mono text-xs text-zinc-200 focus:outline-none focus:ring-1 focus:ring-primary resize-none custom-scrollbar"
                    />
                  </div>
                )}

                {/* Tab 3: Execution Metrics */}
                {activeTab === 'metrics' && (
                  <div className="p-5 flex flex-col flex-1 bg-card space-y-4">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                      <Cpu className="w-4 h-4 text-primary" /> Execution Performance
                    </h4>

                    {metrics ? (
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3.5 bg-muted/40 border border-border rounded-xl">
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" /> CPU Time
                          </span>
                          <p className="text-xl font-bold font-mono text-foreground mt-1">{metrics.time} s</p>
                        </div>

                        <div className="p-3.5 bg-muted/40 border border-border rounded-xl">
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Layers className="w-3.5 h-3.5" /> Memory
                          </span>
                          <p className="text-xl font-bold font-mono text-foreground mt-1">{metrics.memory || 0} KB</p>
                        </div>

                        <div className="p-3.5 bg-muted/40 border border-border rounded-xl col-span-2">
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-primary" /> Exit Status
                          </span>
                          <div className="flex items-center justify-between mt-1">
                            <span className="font-semibold text-sm text-foreground">{metrics.statusDesc}</span>
                            <Badge variant="outline" className="font-mono text-xs">
                              Exit Code: {metrics.exitCode}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-16 text-muted-foreground text-xs">
                        <Cpu className="w-8 h-8 opacity-30 mx-auto mb-2" />
                        Run code to generate runtime CPU & memory metrics.
                      </div>
                    )}
                  </div>
                )}
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl p-6 max-w-sm w-full shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-destructive/10 text-destructive flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground">Reset Code?</h3>
                <p className="text-xs text-muted-foreground">Restore default boilerplate for {currentLang.name}?</p>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-2">
              <Button variant="outline" size="sm" onClick={() => setShowResetModal(false)}>
                Cancel
              </Button>
              <Button variant="destructive" size="sm" onClick={handleConfirmReset}>
                Confirm Reset
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CodePlayground;