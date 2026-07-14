// src/pages/CodePlayground.jsx

import { useState, useEffect } from 'react'; // <-- THE FIX IS HERE
import { Play } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import CodeEditor from '../components/CodeEditor';

const languageApiMap = {
  javascript: 93,
  python: 71,
  java: 62,
  cpp: 54
};

const codeTemplates = {
  python: `print("Hello, Playground!")`,
  javascript: `console.log("Hello, Playground!");`,
  java: `public class Main {\n\tpublic static void main(String[] args) {\n\t\tSystem.out.println("Hello, Playground!");\n\t}\n}`,
  cpp: `#include <iostream>\n\nint main() {\n\tstd::cout << "Hello, Playground!" << std::endl;\n\treturn 0;\n}`
};

const CodePlayground = () => {
  const [language, setLanguage] = useState('python');
  const [code, setCode] = useState(codeTemplates.python);
  const [userInput, setUserInput] = useState('');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);

  // This useEffect was causing the error because it wasn't imported
  useEffect(() => {
    setCode(codeTemplates[language]);
  }, [language]);

  const runCode = async () => {
    setIsRunning(true);
    setOutput('Running...');

    const apiKey = import.meta.env.VITE_JUDGE0_API_KEY; 

    if (!apiKey) {
      setOutput("API Key not configured.");
      setIsRunning(false);
      return;
    }

    const options = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'X-RapidAPI-Key': apiKey,
        'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
      },
      body: JSON.stringify({
        source_code: code,
        language_id: languageApiMap[language],
        stdin: userInput
      })
    };

    try {
      const submissionResponse = await fetch('https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&fields=*', options);
      const submissionResult = await submissionResponse.json();
      const token = submissionResult.token;

      if (!token) {
        throw new Error('Failed to get submission token.');
      }

      let finalResult;
      while (true) {
        await new Promise(res => setTimeout(res, 1500));
        const resultResponse = await fetch(`https://judge0-ce.p.rapidapi.com/submissions/${token}?base64_encoded=false&fields=*`, { headers: options.headers });
        finalResult = await resultResponse.json();
        if (finalResult.status_id > 2) break;
      }
      
      if (finalResult.stdout) setOutput(finalResult.stdout);
      else if (finalResult.stderr) setOutput(`Error:\n${finalResult.stderr}`);
      else if (finalResult.compile_output) setOutput(`Compilation Error:\n${finalResult.compile_output}`);
      else setOutput(`Execution Finished: ${finalResult.status.description}`);

    } catch (error) {
      setOutput(`An error occurred: ${error.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Code Playground</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Editor and Input Section */}
        <div className="flex flex-col gap-4">
          <Card className="flex-grow">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Editor</CardTitle>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="px-3 py-1 bg-background border border-border rounded-md text-sm"
              >
                <option value="python">Python</option>
                <option value="javascript">JavaScript</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
              </select>
            </CardHeader>
            <CardContent>
              <CodeEditor language={language} value={code} onChange={setCode} />
            </CardContent>
          </Card>
          <Button onClick={runCode} disabled={isRunning} className="w-full">
            <Play className="h-4 w-4 mr-2" />
            {isRunning ? 'Running...' : 'Run Code'}
          </Button>
        </div>

        {/* Input and Output Section */}
        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader><CardTitle>Custom Input (stdin)</CardTitle></CardHeader>
            <CardContent>
              <textarea
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Enter any custom input for your code here..."
                className="w-full h-32 p-2 bg-background border border-border rounded-md font-mono text-sm"
              />
            </CardContent>
          </Card>
          <Card className="flex-grow">
            <CardHeader><CardTitle>Output</CardTitle></CardHeader>
            <CardContent>
              <pre className="w-full h-64 p-2 bg-black text-white rounded-md font-mono text-sm overflow-auto">
                {output}
              </pre>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CodePlayground;