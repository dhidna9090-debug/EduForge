import React, { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, Video, PenTool, Target, Award, ChevronRight, 
  Rocket, Brain, Compass, LogIn, UserPlus, Lock, Mail, 
  CheckCircle, Clock, ArrowRight, Zap, ArrowLeft, PlayCircle, BookMarked,
  MessageSquare, Send, X, Activity, Globe, Map, ExternalLink, Calendar,
  List, FileText, Layers, AlertTriangle, ClipboardList, CheckSquare, 
  Timer, Edit3, Wifi, Server, Database, DownloadCloud, User, History, 
  BarChart2, Check, MinusCircle, CreditCard, Smartphone, QrCode, ShieldCheck, 
  Crown, Unlock, Camera, Lightbulb, Flame, TrendingUp, ChevronLeft, Plus, Trash2, Coffee, Users
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore, doc, setDoc, onSnapshot } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyC3RaNBvctI75u5QOHSBrF_AnhPrft391s",
  authDomain: "eduforge-29535.firebaseapp.com",
  projectId: "eduforge-29535",
  storageBucket: "eduforge-29535.firebasestorage.app",
  messagingSenderId: "445484223178",
  appId: "1:445484223178:web:60a6e18661e1fc02198233",
  measurementId: "G-VEJ04M19S4"
};
var generatedYear = new Date().getFullYear();
const MathFormatter = ({ text }) => {
  if (!text) return null;
  // LaTeX symbols ko normal symbols mein badalne ke liye
  const formattedText = String(text)
    .replace(/\\lambda/g, 'λ').replace(/\\mu/g, 'μ').replace(/\\gamma/g, 'γ')
    .replace(/\\alpha/g, 'α').replace(/\\beta/g, 'β').replace(/\\pi/g, 'π')
    .replace(/\\theta/g, 'θ').replace(/\\Delta/g, 'Δ').replace(/\\Sigma/g, 'Σ')
    .replace(/\\int/g, '∫').replace(/\\sqrt/g, '√').replace(/\\pm/g, '±')
    .replace(/\$/g, '');

  return <span>{formattedText}</span>;
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = "eduforge-pro-v1";
// --- SAFE LOCAL STORAGE WRAPPER ---
const safeStorage = {
  getItem: (key) => {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  },
  setItem: (key, value) => {
    try { localStorage.setItem(key, value); } catch (e) { /* ignore */ }
  },
  removeItem: (key) => {
    try { localStorage.removeItem(key); } catch (e) { /* ignore */ }
  },
  clear: () => {
    try { localStorage.clear(); } catch (e) { /* ignore */ }
  }
};

// --- CUSTOM ANIMATION WRAPPERS ---
const MotionDiv = ({ children, delay = 0, className = '', animation = 'fade-up', keyProp }) => {
  const [show, setShow] = useState(false);
  
  useEffect(() => {
    setShow(false);
    const t = setTimeout(() => setShow(true), delay + 10);
    return () => clearTimeout(t);
  }, [delay, keyProp]);

  const getAnimationClasses = () => {
    if (!show) {
      switch (animation) {
        case 'fade-up': return 'opacity-0 translate-y-8';
        case 'fade-down': return 'opacity-0 -translate-y-8';
        case 'fade-left': return 'opacity-0 translate-x-8';
        case 'fade-right': return 'opacity-0 -translate-x-8';
        case 'fade-in': return 'opacity-0 scale-95';
        case 'pop': return 'opacity-0 scale-75';
        default: return 'opacity-0';
      }
    }
    return 'opacity-100 translate-y-0 translate-x-0 scale-100';
  };

  return (
    <div className={`transition-all duration-700 ease-out transform ${getAnimationClasses()} ${className}`}>
      {children}
    </div>
  );
};

// --- CLEAN TEXT FORMATTER ---
const CleanTextFormatter = ({ text }) => {
  if (!text) return null;
  
  // 1. Intercept and convert common raw LaTeX symbols into readable Unicode
  let cleaned = String(text)
    .replace(/\\lambda/g, 'λ').replace(/\blambda\b/gi, 'λ')
    .replace(/\\mu/g, 'μ').replace(/\bmu\b/gi, 'μ')
    .replace(/\\gamma/g, 'γ').replace(/\bgamma\b/gi, 'γ')
    .replace(/\\alpha/g, 'α').replace(/\balpha\b/gi, 'α')
    .replace(/\\beta/g, 'β').replace(/\bbeta\b/gi, 'β')
    .replace(/\\pi/g, 'π')
    .replace(/\\theta/g, 'θ').replace(/\btheta\b/gi, 'θ')
    .replace(/\\Delta/g, 'Δ').replace(/\bdelta\b/gi, 'Δ')
    .replace(/\\Sigma/g, 'Σ')
    .replace(/\\int/g, '∫')
    .replace(/\\sqrt/g, '√')
    .replace(/\\pm/g, '±')
    .replace(/\\approx/g, '≈')
    .replace(/\\prod/g, '∏')
    .replace(/\\times/g, '×')
    .replace(/\\div/g, '÷')
    .replace(/\\text{([^}]*)}/g, '$1') // Extract text from \text{} blocks
    .replace(/\$/g, ''); // Strip all $ signs

  // 2. Parse **bold** markdown into React strong tags
  const parts = cleaned.split(/(\*\*.*?\*\*)/g);
  
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i} className="text-white font-extrabold">{part.slice(2, -2)}</strong>;
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
};

// --- UI COMPONENTS ---
const CircularProgress = ({ percentage, label, color = "text-indigo-500", delay = 0 }) => {
  const [currentPct, setCurrentPct] = useState(0);
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  
  useEffect(() => {
    const t = setTimeout(() => setCurrentPct(percentage), delay + 300);
    return () => clearTimeout(t);
  }, [percentage, delay]);

  const offset = circumference - (currentPct / 100) * circumference;

  return (
    <div className="relative flex flex-col items-center justify-center">
      <svg className="w-24 h-24 transform -rotate-90">
        <circle cx="48" cy="48" r={radius} stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-800" />
        <circle 
          cx="48" cy="48" r={radius} 
          stroke="currentColor" strokeWidth="8" fill="transparent" 
          strokeDasharray={circumference} strokeDashoffset={offset || 0} 
          strokeLinecap="round"
          className={`transition-all duration-1000 ease-out ${color}`} 
        />
      </svg>
      <div className="absolute top-0 w-24 h-24 flex items-center justify-center">
        <span className="text-xl font-bold text-white">{currentPct}%</span>
      </div>
      <span className="mt-3 text-sm font-medium text-slate-400 text-center">{label}</span>
    </div>
  );
};

// --- PERFORMANCE TREND CHART COMPONENT ---
const PerformanceTrendChart = ({ testHistory }) => {
  if (!testHistory || testHistory.length < 2) return null;
  
  // Reverse to show oldest test on left, newest on right
  const data = [...testHistory].reverse().map((t, i) => ({
    name: `T${i + 1}`,
    fullTestName: t.testName,
    score: Math.round((Number(t.score) / Number(t.maxScore)) * 100),
    rawScore: t.score,
    maxScore: t.maxScore
  }));

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, bottom: 5, left: -20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
          <XAxis dataKey="name" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} domain={[0, 100]} />
          <RechartsTooltip 
            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#f8fafc' }}
            labelFormatter={(label, payload) => payload?.[0]?.payload?.fullTestName || label}
            formatter={(value, name, props) => [`${value}% (${props.payload.rawScore}/${props.payload.maxScore})`, 'Score']}
          />
          <Line type="monotone" dataKey="score" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#0f172a' }} activeDot={{ r: 6, fill: '#34d399' }} animationDuration={1500} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

// --- PERFORMANCE DISTRIBUTION PIE CHART COMPONENT ---
const TestPerformancePieChart = ({ correct, incorrect, unattempted }) => {
  const data = [
    { name: 'Correct', value: correct || 0, color: '#10b981' }, // Emerald
    { name: 'Incorrect', value: incorrect || 0, color: '#ef4444' }, // Red
    { name: 'Unattempted', value: unattempted || 0, color: '#64748b' }, // Slate
  ].filter(d => d.value > 0);

  if (data.length === 0) {
    return <div className="text-slate-500 text-center py-8">No performance data available.</div>;
  }

  return (
    <div className="h-64 w-full flex flex-col items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <RechartsTooltip 
            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#f8fafc' }}
            itemStyle={{ color: '#f8fafc' }}
            formatter={(value, name) => [value, name]}
          />
          <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '13px', color: '#cbd5e1' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

// --- PRNG FOR DETERMINISTIC UNIQUE GENERATION ---
const prng = (seed) => {
  let t = seed += 0x6D2B79F5;
  t = Math.imul(t ^ t >>> 15, t | 1);
  t ^= t + Math.imul(t ^ t >>> 7, t | 61);
  return ((t ^ t >>> 14) >>> 0) / 4294967296;
};
const randInt = (min, max, seed) => Math.floor(prng(seed) * (max - min + 1)) + min;

// --- EXAM METADATA HELPER ---
const getTestMetadata = (exam, sub, testType = null) => {
  if (testType === 'Diagnostic') return { qs: 20, mins: 30, type: 'Objective' };
  
  const s = String(sub);
  if (s.includes('Mains (Essay)')) return { qs: 4, mins: 180, type: 'Subjective' };
  if (exam.includes('BPSC (Qualifying)') || s.includes('Hindi')) return { qs: 4, mins: 180, type: 'Subjective' };
  if (s.includes('Mains')) return { qs: 20, mins: 180, type: 'Subjective' };
  if (exam === 'UPSC CSE') {
    if (s.includes('CSAT')) return { qs: 80, mins: 120, type: 'Objective' };
    if (s.includes('Prelims')) return { qs: 100, mins: 120, type: 'Objective' };
  }
  if (exam === 'BPSC' && s.includes('Prelims')) return { qs: 150, mins: 120, type: 'Objective' };
  if (exam === 'GATE') return { qs: 65, mins: 180, type: 'Objective' };
  return { qs: 100, mins: 180, type: 'Objective' };
};

// --- EXAM METADATA & PATTERNS ---
const EXAM_METADATA = {
  'GATE': {
    pdfTitle: "GATE-Official-Syllabus-Pattern.pdf",
    pattern: [
      { stage: "Computer Based Test (CBT)", type: "Objective (MCQ, MSQ, NAT)", marks: "100", duration: "3 Hours", details: "65 Questions. General Aptitude (15 marks) + Subject Specific (85 marks)." }
    ],
    pdfContent: `GATE Official Syllabus & Pattern\n\nThe Graduate Aptitude Test in Engineering (GATE) is an all-India examination.\n\nPattern:\n- Mode: Computer Based Test (CBT)\n- Duration: 3 Hours\n- Total Questions: 65\n- Total Marks: 100\n\nQuestion Types:\n1. Multiple Choice Questions (MCQ)\n2. Multiple Select Questions (MSQ)\n3. Numerical Answer Type (NAT)\n\nMarking Scheme:\n- Questions carry 1 mark or 2 marks.\n- For a wrong answer chosen in an MCQ, there will be negative marking. For 1-mark MCQ, 1/3 mark will be deducted. For 2-mark MCQ, 2/3 mark will be deducted.\n- There is NO negative marking for MSQ and NAT.`
  },
  'UPSC CSE': {
    pdfTitle: "UPSC-Civil-Services-Syllabus.pdf",
    pattern: [
      { stage: "Prelims (Paper-I GS)", type: "Objective", marks: "200", duration: "2 Hours", details: "100 Questions. Tests general awareness and knowledge." },
      { stage: "Prelims (Paper-II CSAT)", type: "Objective", marks: "200", duration: "2 Hours", details: "80 Questions. Qualifying in nature (33% needed)." },
      { stage: "Mains", type: "Subjective", marks: "1750", duration: "3 Hours / Paper", details: "9 papers total. 2 qualifying language papers. 1 Essay, 4 GS papers, 2 Optional papers. Purely descriptive." },
      { stage: "Interview", type: "Physically Present", marks: "275", duration: "Not Defined", details: "Personality test assessing the candidate's suitability for a career in public service." }
    ],
    pdfContent: `UPSC Civil Services Examination (CSE) Syllabus\n\nThe Civil Services Examination consists of two successive stages: \n1. Civil Services (Preliminary) Examination (Objective type) for the selection of candidates for the Main Examination. \n2. Civil Services (Main) Examination (Written and Interview) for the selection of candidates for the various Services and posts.\n\nPRELIMINARY EXAMINATION:\nPaper I - (200 marks) Duration: Two hours.\n- Current events of national and international importance.\n- History of India and Indian National Movement.\n- Indian and World Geography.\n- Indian Polity and Governance.\n- Economic and Social Development.\n- General issues on Environmental ecology, Bio-diversity and Climate Change.\n- General Science.\n\nPaper II - (200 marks) Duration: Two hours (CSAT - Qualifying 33%).\n- Comprehension.\n- Interpersonal skills including communication skills.\n- Logical reasoning and analytical ability.\n- Decision making and problem solving.\n- General mental ability.\n- Basic numeracy (Class X level).`
  },
  'BPSC': {
    pdfTitle: "Bihar-PCS-Official-Syllabus.pdf",
    pattern: [
      { stage: "Prelims", type: "Objective", marks: "150", duration: "2 Hours", details: "Single General Studies Paper. 150 Questions. Qualifying in nature to progress to Mains." },
      { stage: "Mains (GS 1, GS 2 & Essay)", type: "Subjective", marks: "900", duration: "3 Hours / Paper", details: "3 Papers (300 marks each). Long writing descriptive format." },
      { stage: "Interview", type: "Physically Present", marks: "120", duration: "Not Defined", details: "Final personality test for candidates clearing the Mains examination." }
    ],
    pdfContent: `Bihar PCS (BPSC) Preliminary & Mains Detailed Syllabus\n\nBPSC Syllabus and Exam Pattern. The BPSC conducts the Combined Competitive Exam in a manner similar to other State Service Commissions and the UPSC.\n\n1. Prelims: This stage involves a single objective-type paper worth 150 marks.\n2. Mains: The Mains phase includes three primary papers (GS 1, GS 2, and Essay) purely subjective and descriptive in nature.\n3. Interview: The interview phase carries 120 marks.`
  },
  'BPSC (Qualifying)': {
    pdfTitle: "Bihar-PCS-Hindi-Qualifying-Syllabus.pdf",
    pattern: [
      { stage: "Mains (General Hindi)", type: "Subjective", marks: "100", duration: "3 Hours", details: "Qualifying General Hindi Paper (100 marks). Minimum 30% marks required." }
    ],
    pdfContent: `Bihar PCS (BPSC) Mains Qualifying General Hindi\n\nThis paper is purely qualifying in nature. Candidates must secure a minimum of 30% marks to have their core mains papers evaluated.\nSyllabus includes Essay Writing, Grammar, Syntax, and Precis Writing.`
  },
  'BEU (Bihar Engg Univ)': {
    pdfTitle: "BEU-BTech-Syllabus.pdf",
    pattern: [
      { stage: "Mid Semester", type: "Subjective", marks: "30", duration: "2 Hours", details: "Internal examination conducted by the college." },
      { stage: "End Semester", type: "Subjective", marks: "70", duration: "3 Hours", details: "University level theoretical examination." }
    ],
    pdfContent: "Bihar Engineering University (BEU) Syllabus\n\nPattern:\n- Mid Sem: 30 Marks\n- End Sem: 70 Marks\nTotal: 100 Marks per subject."
  },
  'AKTU (UP)': {
    pdfTitle: "AKTU-BTech-Syllabus.pdf",
    pattern: [
      { stage: "Internal Assessment", type: "Subjective/Objective", marks: "30", duration: "1-2 Hours", details: "Class tests, assignments, and attendance." },
      { stage: "End Semester Exam", type: "Subjective", marks: "70", duration: "3 Hours", details: "Final university written examination." }
    ],
    pdfContent: "Dr. A.P.J. Abdul Kalam Technical University (AKTU) Syllabus\n\nPattern:\n- Internal: 30 Marks\n- External (End Sem): 70 Marks\nTotal: 100 Marks per subject."
  }
};

// --- REAL SYLLABUS DATA ---
const SYLLABUS_DATA = {
  'GATE': {
    'Computer Science (CS)': [
      { section: "Engineering Mathematics", weight: 15, topics: "Discrete Mathematics, Propositional logic, Combinatorics, Graph Theory, Linear Algebra, Calculus, Probability.", source: "GATE PYQ Vol 1", searchKey: "GATE CS Engineering Mathematics", wikiKey: "Discrete mathematics", book: "Discrete Mathematics and Its Applications by Kenneth Rosen" },
      { section: "Digital Logic", weight: 6, topics: "Boolean algebra, Combinational & sequential circuits, Minimization, Number representations.", source: "Standard Textbooks", searchKey: "GATE CS Digital Logic", wikiKey: "Digital electronics", book: "Digital Logic and Computer Design by M. Morris Mano" },
      { section: "Computer Organization and Architecture", weight: 8, topics: "Machine instructions, ALU, datapath, Instruction pipelining, Memory hierarchy, I/O interface.", source: "Standard Textbooks", searchKey: "GATE CS Computer Organization", wikiKey: "Computer architecture", book: "Computer Organization and Embedded Systems by Carl Hamacher" },
      { section: "Programming and Data Structures", weight: 12, topics: "Programming in C, Recursion, Arrays, stacks, queues, linked lists, trees, binary heaps, graphs.", source: "GATE PYQ Vol 2", searchKey: "GATE CS Data Structures", wikiKey: "Data structure", book: "Data Structures Using C by Reema Thareja" },
      { section: "Algorithms", weight: 10, topics: "Searching, sorting, hashing, Asymptotic worst case time/space complexity, Dynamic Programming, Greedy.", source: "GATE PYQ Vol 2", searchKey: "GATE CS Algorithms", wikiKey: "Algorithm", book: "Introduction to Algorithms by Thomas H. Cormen (CLRS)" },
      { section: "Theory of Computation", weight: 8, topics: "Regular expressions, Finite automata, CFG, Push-down automata, Turing machines, Undecidability.", source: "Standard Textbooks", searchKey: "GATE CS Theory of Computation", wikiKey: "Theory of computation", book: "Introduction to Automata Theory, Languages, and Computation by Hopcroft and Ullman" },
      { section: "Compiler Design", weight: 4, topics: "Lexical analysis, parsing, syntax-directed translation, Runtime environments, Intermediate code.", source: "Standard Textbooks", searchKey: "GATE CS Compiler Design", wikiKey: "Compiler", book: "Compilers: Principles, Techniques, and Tools (Dragon Book) by Aho, Ullman, Sethi" },
      { section: "Operating System", weight: 10, topics: "System calls, processes, threads, synchronization, Deadlock, CPU scheduling, Memory management.", source: "Standard Textbooks", searchKey: "GATE CS Operating System", wikiKey: "Operating system", book: "Operating Systems by Avi Silberschatz, Greg Gagne, and Peter Baer Galvin" },
      { section: "Databases", weight: 8, topics: "ER-model, Relational model, SQL, Integrity constraints, normal forms, File organization, B-trees.", source: "Standard Textbooks", searchKey: "GATE CS Databases", wikiKey: "Database", book: "Database System Concepts by Abraham Silberschatz, Henry F. Korth" },
      { section: "Computer Networks", weight: 9, topics: "OSI and TCP/IP, Data link layer, Routing protocols, IPv4, Transport layer (TCP/UDP), Application layer.", source: "Standard Textbooks", searchKey: "GATE CS Computer Networks", wikiKey: "Computer network", book: "Computer Networking: A Top-Down Approach by James Kurose and Keith Ross" }
    ],
    'Mechanical (ME)': [
      { section: "Engineering Mathematics", weight: 15, topics: "Linear Algebra, Calculus, Differential equations.", source: "NPTEL Mechanical Maths", searchKey: "GATE ME Engineering Mathematics", wikiKey: "Engineering mathematics" },
      { section: "Applied Mechanics & Design", weight: 20, topics: "Mechanics, Strength of Materials, Theory of Machines.", source: "Unacademy Mechanical SOM", searchKey: "GATE ME Applied Mechanics", wikiKey: "Applied mechanics" },
      { section: "Fluid Mechanics & Thermal", weight: 25, topics: "Thermodynamics, Heat-Transfer, Turbo-machinery.", source: "NPTEL Thermodynamics", searchKey: "GATE ME Fluid Mechanics", wikiKey: "Fluid mechanics" },
      { section: "Manufacturing & Industrial", weight: 20, topics: "Casting, Forming, Machining, Metrology, Operations Research.", source: "Unacademy Manufacturing", searchKey: "GATE ME Manufacturing", wikiKey: "Manufacturing engineering" }
    ],
    'Civil (CE)': [
      { section: "Structural Engineering", weight: 20, topics: "Solid Mechanics, Structural Analysis, Concrete & Steel.", source: "NPTEL Structural Civil", searchKey: "GATE CE Structural Engineering", wikiKey: "Structural engineering" },
      { section: "Geotechnical & Water", weight: 25, topics: "Soil Mechanics, Foundation Engineering, Hydrology.", source: "Unacademy Geotech", searchKey: "GATE CE Geotechnical", wikiKey: "Geotechnical engineering" },
      { section: "Environmental & Transport", weight: 20, topics: "Water Quality, Waste Water, Highway Pavements.", source: "Unacademy Environmental Civil", searchKey: "GATE CE Environmental", wikiKey: "Environmental engineering" }
    ],
    'Electrical (EE)': [
      { section: "Engineering Mathematics", weight: 15, topics: "Linear Algebra, Calculus, Differential Equations.", source: "NPTEL Electrical Maths", searchKey: "GATE EE Engineering Mathematics", wikiKey: "Engineering mathematics" },
      { section: "Electric Circuits", weight: 15, topics: "Network graph, KCL, KVL, Transient response.", source: "Unacademy Circuits", searchKey: "GATE EE Electric Circuits", wikiKey: "Electrical network" },
      { section: "Signals and Systems", weight: 10, topics: "LTI systems, Fourier Transform, Z-Transform.", source: "Neso Academy Signals", searchKey: "GATE EE Signals and Systems", wikiKey: "Signals and systems" },
      { section: "Power Systems", weight: 20, topics: "Power generation, Transmission lines, Fault analysis.", source: "Unacademy Power Systems", searchKey: "GATE EE Power Systems", wikiKey: "Electric power system" }
    ],
    'Electronics & Communication (EC)': [
      { section: "Engineering Mathematics", weight: 15, topics: "Linear Algebra, Calculus, Differential Equations, Vector Analysis, Complex Analysis, Probability.", source: "NPTEL Maths", searchKey: "GATE EC Engineering Mathematics", wikiKey: "Engineering mathematics" },
      { section: "Networks, Signals and Systems", weight: 10, topics: "Circuit analysis, Continuous & discrete time signals, LTI systems.", source: "Neso Academy Signals", searchKey: "GATE EC Networks Signals Systems", wikiKey: "Signal processing" },
      { section: "Electronic Devices", weight: 15, topics: "Energy bands, P-N junction, Zener diode, BJT, MOSFET, LEDs.", source: "Standard Textbooks", searchKey: "GATE EC Electronic Devices", wikiKey: "Electronic component" },
      { section: "Analog Circuits", weight: 10, topics: "Diode circuits, BJT/MOSFET amplifiers, Op-amps, Oscillators.", source: "NPTEL Analog Circuits", searchKey: "GATE EC Analog Circuits", wikiKey: "Analogue electronics" },
      { section: "Digital Circuits", weight: 10, topics: "Number systems, Combinational & Sequential circuits, Data converters, Memories.", source: "Neso Academy Digital", searchKey: "GATE EC Digital Circuits", wikiKey: "Digital electronics" },
      { section: "Control Systems", weight: 10, topics: "Feedback principles, Signal flow graphs, Transient response, Bode plots.", source: "NPTEL Control Systems", searchKey: "GATE EC Control Systems", wikiKey: "Control theory" },
      { section: "Communications", weight: 15, topics: "Random processes, Analog AM/FM, Digital PCM, Modulation schemes.", source: "NPTEL Communications", searchKey: "GATE EC Communications", wikiKey: "Telecommunication" },
      { section: "Electromagnetics", weight: 10, topics: "Maxwell's equations, Plane waves, Transmission Lines, Waveguides, Antennas.", source: "Standard Textbooks", searchKey: "GATE EC Electromagnetics", wikiKey: "Electromagnetism" }
    ],
    'Other Branches (IN, PI, CH, etc.)': [
      { section: "General Aptitude", weight: 15, topics: "Verbal, Quantitative, Analytical, and Spatial Aptitude.", source: "GATE PYQ Vol 1", searchKey: "GATE General Aptitude", wikiKey: "Aptitude" },
      { section: "Engineering Mathematics", weight: 13, topics: "Linear Algebra, Calculus, Differential Equations, Complex Variables.", source: "NPTEL Maths", searchKey: "GATE Engineering Mathematics", wikiKey: "Engineering mathematics" },
      { section: "Core Subjects", weight: 72, topics: "Branch specific core subjects (Syllabus structure updating soon).", source: "Standard Textbooks", searchKey: "GATE Core Engineering", wikiKey: "Engineering" }
    ]
  },
  'UPSC CSE': {
    'Prelims (GS)': [
      { section: "Current Events & History", weight: 20, topics: "Current events, History of India, Indian National Movement.", source: "Vision IAS / Pratik Nayak", searchKey: "UPSC Prelims Modern History", wikiKey: "Indian National Movement" },
      { section: "Geography", weight: 15, topics: "Indian and World Geography, Physical, Social, Economic Geography.", source: "Sudarshan Gurjar Geography", searchKey: "UPSC Prelims Geography", wikiKey: "Geography of India" },
      { section: "Polity & Governance", weight: 20, topics: "Constitution, Political System, Panchayati Raj, Public Policy.", source: "Vision IAS Polity", searchKey: "UPSC Prelims Indian Polity", wikiKey: "Constitution of India" },
      { section: "Economic & Social Dev", weight: 15, topics: "Sustainable Development, Poverty, Inclusion, Demographics.", source: "Mrunal Economy", searchKey: "UPSC Prelims Indian Economy", wikiKey: "Economy of India" },
      { section: "Environment & Ecology", weight: 15, topics: "Environmental Ecology, Bio-diversity, Climate Change, General Science.", source: "PMF IAS Environment", searchKey: "UPSC Prelims Environment and Ecology", wikiKey: "Environmental issues in India" },
      { section: "General Science", weight: 10, topics: "Recent developments in Science, Space, IT, Bio-technology.", source: "Ravi P. Agrahari", searchKey: "UPSC Prelims General Science and Tech", wikiKey: "Science and technology in India" }
    ],
    'Prelims (CSAT)': [
      { section: "Comprehension", weight: 30, topics: "Reading comprehension, inference.", source: "Standard Books", searchKey: "UPSC CSAT Comprehension", wikiKey: "Reading comprehension" },
      { section: "Logical Reasoning", weight: 25, topics: "Analytical ability, syllogism.", source: "RS Aggarwal", searchKey: "UPSC CSAT Reasoning", wikiKey: "Logical reasoning" },
      { section: "Basic Numeracy", weight: 25, topics: "Numbers, magnitude, data interpretation (Class X level).", source: "Standard Books", searchKey: "UPSC CSAT Numeracy", wikiKey: "Numeracy" }
    ],
    'Mains (Essay)': [
      { section: "Philosophical Essays", weight: 125, topics: "Ethics, human values, abstract ideas.", source: "Standard Essay Strategy", searchKey: "UPSC Mains Essay Philosophical", wikiKey: "Essay" },
      { section: "Current/Social Essays", weight: 125, topics: "Women empowerment, democracy, tech and society.", source: "Standard Essay Strategy", searchKey: "UPSC Mains Essay Social", wikiKey: "Essay" }
    ],
    'Mains (GS 1)': [
      { section: "Indian Heritage & Culture", weight: 50, topics: "Art forms, literature, architecture from ancient to modern times.", source: "Standard Books", searchKey: "UPSC Mains GS 1 Culture", wikiKey: "Culture of India" },
      { section: "Modern Indian History", weight: 75, topics: "Middle of 18th century until present, significant events, personalities.", source: "Standard Books", searchKey: "UPSC Mains GS 1 History", wikiKey: "History of India" },
      { section: "Geography of the World", weight: 75, topics: "Physical geography, natural resources, industrial location.", source: "Standard Books", searchKey: "UPSC Mains GS 1 Geography", wikiKey: "Geography" },
      { section: "Society", weight: 50, topics: "Role of women, poverty, urbanization, globalization.", source: "Standard Books", searchKey: "UPSC Mains GS 1 Society", wikiKey: "Society of India" }
    ],
    'Mains (GS 2)': [
      { section: "Governance & Polity", weight: 100, topics: "Constitution, Separation of powers, Parliament, Exec/Judiciary.", source: "Standard Books", searchKey: "UPSC Mains GS 2 Polity", wikiKey: "Constitution of India" },
      { section: "Social Justice", weight: 100, topics: "Welfare schemes, health, education, human resources.", source: "Standard Books", searchKey: "UPSC Mains GS 2 Social Justice", wikiKey: "Social justice" },
      { section: "International Relations", weight: 50, topics: "India and neighbors, bilateral/global groupings.", source: "Standard Books", searchKey: "UPSC Mains GS 2 IR", wikiKey: "Foreign relations of India" }
    ]
  },
  'BPSC': {
    'Prelims (General Studies)': [
      { section: "History of India & Bihar", weight: 30, topics: "Ancient, Medieval, Modern History, Bihar specific history", source: "Standard Books", searchKey: "BPSC Prelims History", wikiKey: "History of Bihar" },
      { section: "General Science", weight: 25, topics: "Physics, Chemistry, Biology", source: "Lucent", searchKey: "BPSC Prelims Science", wikiKey: "Science" },
      { section: "Current Affairs", weight: 30, topics: "National, International, Bihar Current Events", source: "Magazines", searchKey: "BPSC Current Affairs", wikiKey: "Current events" },
      { section: "Geography", weight: 15, topics: "Indian and World Geography, Bihar Geography", source: "NCERT", searchKey: "BPSC Geography", wikiKey: "Geography of Bihar" },
      { section: "Indian Polity & Economy", weight: 20, topics: "Constitution, Panchayati Raj, Bihar Economy", source: "Laxmikanth", searchKey: "BPSC Polity", wikiKey: "Constitution of India" },
      { section: "General Mental Ability", weight: 10, topics: "Basic Math, Reasoning", source: "RS Aggarwal", searchKey: "BPSC Math", wikiKey: "Aptitude" }
    ],
    'Mains (GS 1)': [
      { section: "Modern History & Culture", weight: 114, topics: "Revolt of 1857, Birsa Movement, Champaran Satyagraha, Maurya & Pal Art", source: "Standard Books", searchKey: "BPSC GS 1 History Culture", wikiKey: "History of Bihar" },
      { section: "Current Events", weight: 114, topics: "Major contemporary events of National and International Importance.", source: "Standard Books", searchKey: "BPSC GS 1 Current Affairs", wikiKey: "Current events" },
      { section: "Statistical Analysis", weight: 72, topics: "Data Interpretation, Pie charts, Bar graphs", source: "Standard Books", searchKey: "BPSC GS 1 Statistics", wikiKey: "Statistics" }
    ],
    'Mains (GS 2)': [
      { section: "Indian Polity", weight: 114, topics: "Constitution, Panchayati Raj, Bihar Political System", source: "Standard Books", searchKey: "BPSC GS 2 Polity", wikiKey: "Politics of Bihar" },
      { section: "Economy and Geography", weight: 114, topics: "Economic planning, Poverty, Agriculture, Geography of Bihar", source: "Standard Books", searchKey: "BPSC GS 2 Economy Geography", wikiKey: "Economy of Bihar" },
      { section: "Science and Technology", weight: 72, topics: "Impact of Sci & Tech in development of India and Bihar", source: "Standard Books", searchKey: "BPSC GS 2 Science Tech", wikiKey: "Science and technology in India" }
    ],
    'Mains (Essay)': [
      { section: "General Essay", weight: 200, topics: "Current social issues, philosophy, global events", source: "Standard Books", searchKey: "BPSC Essay", wikiKey: "Essay" },
      { section: "Bihar Specific Essay", weight: 100, topics: "Bihar culture, idioms, local issues, literature", source: "Standard Books", searchKey: "BPSC Essay Bihar", wikiKey: "Culture of Bihar" }
    ]
  },
  'BPSC (Qualifying)': {
    'Mains (General Hindi)': [
      { section: "निबंध लेखन", weight: 30, topics: "सामाजिक, राजनीतिक, आर्थिक और समसामयिक विषय", source: "BPSC PYQ", searchKey: "BPSC Hindi Essay", wikiKey: "Essay" },
      { section: "व्याकरण", weight: 30, topics: "पर्यायवाची, विलोम, मुहावरे, लोकोक्तियाँ, संधि", source: "BPSC PYQ", searchKey: "BPSC Hindi Grammar", wikiKey: "Grammar" },
      { section: "वाक्य विन्यास", weight: 25, topics: "वाक्य शुद्धि, लिंग, वचन, काल, कारक", source: "BPSC PYQ", searchKey: "BPSC Hindi Syntax", wikiKey: "Syntax" },
      { section: "संक्षेपण", weight: 15, topics: "गद्यांश का एक-तिहाई शब्दों में संक्षेपण और सटीक शीर्षक", source: "BPSC PYQ", searchKey: "BPSC Hindi Precis", wikiKey: "Precis" }
    ]
  },
  'BEU (Bihar Engg Univ)': {
    'B.Tech 1st Semester': [
      { section: "Mathematics-I", weight: 20, topics: "Calculus, Multivariable Calculus, Linear Algebra", source: "BS Grewal", searchKey: "BEU Math 1", wikiKey: "Calculus" },
      { section: "Engineering Physics", weight: 20, topics: "Mechanics, Optics, Quantum Physics", source: "HC Verma", searchKey: "BEU Physics", wikiKey: "Engineering physics" },
      { section: "Basic Electrical Engineering", weight: 15, topics: "DC Circuits, AC Circuits, Transformers", source: "Standard Books", searchKey: "BEU Basic Electrical", wikiKey: "Electrical engineering" },
      { section: "Engineering Graphics & Design", weight: 15, topics: "Projections, CAD, Isometric Views", source: "ND Bhatt", searchKey: "BEU Engineering Graphics", wikiKey: "Engineering drawing" }
    ],
    'B.Tech 2nd Semester': [
      { section: "Mathematics-II", weight: 20, topics: "Differential Equations, Complex Variables", source: "BS Grewal", searchKey: "BEU Math 2", wikiKey: "Differential equation" },
      { section: "Engineering Chemistry", weight: 20, topics: "Atomic Structure, Spectroscopy, Polymers", source: "Standard Books", searchKey: "BEU Chemistry", wikiKey: "Chemistry" },
      { section: "Programming for Problem Solving", weight: 25, topics: "C Programming, Loops, Arrays, Pointers", source: "Standard Books", searchKey: "BEU C Programming", wikiKey: "C (programming language)" },
      { section: "English", weight: 10, topics: "Vocabulary, Basic Writing, Comprehension", source: "Standard Books", searchKey: "BEU English", wikiKey: "English language" }
    ]
  },
  'AKTU (UP)': {
    'B.Tech 1st Year': [
      { section: "Engineering Mathematics-I", weight: 20, topics: "Matrices, Differential Calculus, Vector Calculus", source: "Standard Books", searchKey: "AKTU Math 1", wikiKey: "Calculus" },
      { section: "Engineering Physics", weight: 20, topics: "Relativistic Mechanics, Electromagnetic Field, Quantum Mechanics", source: "Standard Books", searchKey: "AKTU Physics", wikiKey: "Engineering physics" },
      { section: "Fundamental of Mechanical Engg", weight: 15, topics: "Statics, Dynamics, Thermodynamics", source: "Standard Books", searchKey: "AKTU FME", wikiKey: "Mechanical engineering" },
      { section: "Soft Skills", weight: 10, topics: "Communication, Presentation", source: "Standard Books", searchKey: "AKTU Soft Skills", wikiKey: "Soft skills" }
    ],
    'B.Tech CSE 2nd Year': [
      { section: "Data Structures", weight: 25, topics: "Arrays, Linked Lists, Trees, Graphs, Sorting", source: "Standard Books", searchKey: "AKTU Data Structures", wikiKey: "Data structure" },
      { section: "Computer Organization", weight: 20, topics: "ALU, Control Unit, Memory, I/O", source: "Standard Books", searchKey: "AKTU COA", wikiKey: "Computer architecture" },
      { section: "Discrete Structures", weight: 20, topics: "Set Theory, Logic, Graph Theory", source: "Standard Books", searchKey: "AKTU DSTL", wikiKey: "Discrete mathematics" },
      { section: "Cyber Security", weight: 10, topics: "Info Sec, Cryptography basics", source: "Standard Books", searchKey: "AKTU Cyber Security", wikiKey: "Computer security" }
    ]
  }
};

// --- GEMINI AI FETCHERS ---
const fetchLivePYQsFromAI = async (exam, sub, topicName, count) => {
  const apiKey = "AIzaSyBsbaozbt3qknzDE2GdnUDOgfTB0jZwt9c"; 
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
  
  const isMains = String(sub).includes('Mains') || String(sub).includes('Hindi');
  const isHindi = String(sub).toLowerCase().includes('hindi');
  
  const langInstruction = isHindi 
    ? "CRITICAL: ALL text, output, questions, and explanations MUST be strictly in Hindi language (Devanagari script). DO NOT output any English words in the question or explanation." 
    : "All content MUST be strictly in English.";
  
  const prompt = isMains ? 
    `You are an expert exam setter for India's ${exam} (${sub}). 
    You MUST act as a strict search engine. Fetch EXACT, REAL Previous Year Questions (PYQs) from actual past ${exam} papers based on the topic '${topicName}'. DO NOT invent or simulate questions.
    These are MAINS SUBJECTIVE/DESCRIPTIVE questions.
    Provide the exact 'year' the question appeared.
    DO NOT provide options. ${langInstruction} ABSOLUTELY NO LaTeX (no $ signs).
    Use raw Unicode symbols directly for Greek letters or math.
    Format JSON: [{ "year": "2022", "text": "${isHindi ? 'यहाँ सटीक प्रश्न लिखें (Hindi में)' : 'Exact Question text from past paper'}", "options": [], "correctAnswer": null, "explanation": "${isHindi ? 'यहाँ उत्तर के मुख्य बिंदु विस्तार से लिखें (Hindi में)' : 'Key points to include in the answer'}" }]`
  :
    `You are an expert exam setter for India's ${exam} (${sub}). 
    You MUST act as a strict search engine. Fetch EXACT, REAL Previous Year Questions (PYQs) from actual past ${exam} papers based on the topic '${topicName}'. DO NOT invent or simulate questions.
    The questions MUST be exact replicas of past papers. Provide the exact 'year' the question appeared.
    Ensure strictly no repetitions. ${langInstruction}
    ABSOLUTELY NO LaTeX (no $ signs). Use raw Unicode symbols directly for Greek letters or math.

    Format the explanation EXACTLY like this using clear line breaks (\\n):
    Solution:
    Step 1: Identify the given values.
    Step 2: Apply the appropriate logic/formula.
    Therefore, the correct answer is...
    
    Format JSON: [{ "year": "2021", "text": "Exact Question text from past paper", "options": ["opt1","opt2","opt3","opt4"], "correctAnswer": 0, "explanation": "Detailed plain text explanation" }]`;

  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: { responseMimeType: "application/json" }
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!response.ok) return [];
    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (text) {
      const cleanedText = text.replace(/```json/gi, '').replace(/```/g, '').trim();
      return JSON.parse(cleanedText);
    }
  } catch(e) {
    console.error("AI Fetch Error", e);
  }
  return [];
};

const fetchAIStrategy = async (exam, sub) => {
  const apiKey = "AIzaSyBsbaozbt3qknzDE2GdnUDOgfTB0jZwt9c"; 
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
  
  const prompt = `Act as an expert academic strategist for a student preparing for India's ${exam} - ${sub} exam.
  Provide a highly effective, structured, and concise 4-phase practice strategy. 
  Keep the format plain text with clear headings and bullet points. No markdown asterisks (**). All content MUST be in English.
  
  Required Structure:
  Phase 1: Foundation & Concept Building
  - [Point 1]
  Phase 2: Targeted Practice & PYQs
  - [Point 1]
  Phase 3: Revision Methodology
  - [Point 1]
  Phase 4: Mock Test Simulation
  - [Point 1]
  
  Make the advice highly specific to the ${exam} ${sub} pattern.`;

  const payload = { contents: [{ parts: [{ text: prompt }] }] };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!response.ok) throw new Error("API Network error");
    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || null;
  } catch(e) {
    return null;
  }
};

const fetchPerformanceReview = async (tasks, tests, avgScore, streak, userName) => {
  const apiKey = "AIzaSyBsbaozbt3qknzDE2GdnUDOgfTB0jZwt9c"; 
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
  
  const prompt = `Act as a sassy, cute gamified AI companion talking to the user named "${userName}". Review their performance:
  Tasks: ${tasks}, Tests: ${tests}, Score: ${avgScore}%, Streak: ${streak}.
  
  Write EXACTLY ONE short, punchy sentence (MAX 15 WORDS). Address them explicitly by their name "${userName}".
  Do NOT use markdown asterisks. Keep it strictly in English.`;

  const payload = { contents: [{ parts: [{ text: prompt }] }] };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!response.ok) return `Level up, ${userName}! Balance your learning and mock tests today!`;
    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || `Level up, ${userName}! Balance your learning and mock tests today!`;
  } catch(e) {
    return `Level up, ${userName}! Balance your learning and mock tests today!`;
  }
};

const getMockPortalUrl = (exam) => {
  switch(exam) {
    case 'GATE': return 'https://testbook.com/gate-test-series';
    case 'UPSC CSE': return 'https://visionias.in/testseries/';
    case 'BPSC': return 'https://www.drishtiias.com/state-pcs-test-series/bpsc';
    case 'BEU (Bihar Engg Univ)': return 'https://www.youtube.com/results?search_query=BEU+pyq+solutions';
    case 'AKTU (UP)': return 'https://www.youtube.com/results?search_query=AKTU+pyq+solutions';
    default: return 'https://testbook.com/';
  }
};

const UPSC_PYQ_BANK = [
  { q: "With reference to the Indian economy, consider the following statements:\n1. A share of the household financial savings goes towards government borrowings.\n2. Dated securities issued at market-related rates in auctions form a large component of internal debt.\nWhich of the above statements is/are correct?", opts: ["1 only", "2 only", "Both 1 and 2", "Neither 1 nor 2"], ans: 2, exp: "Households deposit money in banks which is then invested in government securities, and dated securities constitute the largest segment of the government's internal debt." }
];

const BPSC_PYQ_BANK = [
  { q: "According to 2001 census _______ percent population of India lives in Bihar state.", opts: ["8", "10", "11", "12"], ans: 0, exp: "Around 8.07% of India's population lives in Bihar according to 2001 census." }
];

const generateQuestions = (exam, sub, testType = 'Full Syllabus', topicIndex = 0, sessionIndex = 1) => {
  const questions = [];
  const isSectional = testType === 'Topic-Wise';
  const isDiagnostic = testType === 'Diagnostic';
  const isMains = String(sub).includes('Mains');
  const isCSAT = exam === 'UPSC CSE' && String(sub).includes('CSAT');
  
  const testMeta = getTestMetadata(exam, sub, testType);
  const targetCount = isSectional ? (isMains ? (exam.includes('BPSC (Qualifying)') ? 4 : 5) : 30) : testMeta.qs;

  const topicLists = SYLLABUS_DATA[exam]?.[sub] || [{ section: "General", topics: "Fundamentals, Theories" }];
  const activeTopicObj = isSectional && topicLists[topicIndex] ? topicLists[topicIndex] : null;

  let qCount = 0;
  const usedQuestionTexts = new Set();

  let testPyqBank = [];
  if (!isMains && exam === 'BPSC' && String(sub).includes('Prelims')) testPyqBank = [...BPSC_PYQ_BANK];
  else if (!isMains && exam === 'UPSC CSE' && String(sub).includes('GS')) testPyqBank = [...UPSC_PYQ_BANK];

  for (let i = testPyqBank.length - 1; i > 0; i--) {
    const j = randInt(0, i, (sessionIndex * 1000) + i);
    [testPyqBank[i], testPyqBank[j]] = [testPyqBank[j], testPyqBank[i]];
  }

  while (qCount < targetCount) {
    const baseSeed = (topicIndex * 100000) + (sessionIndex * 50000) + (qCount * 97);
    
    let uniqueText = "";
    let uniqueOptions = [];
    let correctAns = 0;
    let explanation = "";
    let qType = 'mcq'; 
    let marks = 2;
    let negativeMarks = 0.66;

    if (isMains) {
        qType = 'theory';
        if (exam.includes('BPSC (Qualifying)')) {
            const marksArray = [30, 30, 25, 15];
            marks = marksArray[qCount % 4] || 15;
        } else {
            marks = 15;
        }
        negativeMarks = 0;
    } else if (isCSAT) {
        marks = 2.5;
        negativeMarks = 0.83;
    } else if (exam === 'BPSC') {
        marks = 1;
        negativeMarks = 0.25;
    } else {
        marks = qCount < (targetCount / 2) ? 1 : 2; 
        negativeMarks = qCount < (targetCount / 2) ? 0.33 : 0.66;
        if (exam === 'UPSC CSE') { marks = 2; negativeMarks = 0.66; }
    }

    if (!isMains && qCount < testPyqBank.length) {
      const pyq = testPyqBank[qCount];
      const pyqText = `[${exam} PYQ] ${pyq.q}`;
      if (!usedQuestionTexts.has(pyqText)) {
        uniqueText = pyqText;
        uniqueOptions = pyq.opts.map(String);
        correctAns = Number(pyq.ans);
        explanation = String(pyq.exp);
        
        usedQuestionTexts.add(uniqueText);
        questions.push({ id: qCount + 1, type: qType, text: `Q${qCount + 1}: \n\n${uniqueText}`, options: uniqueOptions, correctAnswer: correctAns, marks, negativeMarks, explanation, topic: "Previous Year Concepts" });
        qCount++;
        continue;
      }
    } 
    
    let attempts = 0;
    let generatedText = "";
    let finalTopic = "General Section";
    
    do {
      const currentSeed = baseSeed + (attempts * 1337) + (sessionIndex * 9973);
      const qTopicObj = activeTopicObj || topicLists[qCount % topicLists.length];
      const currentTopic = String(qTopicObj.section);
      finalTopic = currentTopic;
      const subTopics = String(qTopicObj.topics).split(',').map(t => t.trim());
      const randomSubTopic = subTopics[randInt(0, subTopics.length - 1, currentSeed)];
      
      generatedYear = (2005 + randInt(0, 18, currentSeed)).toString();
      const templateType = randInt(0, 3, currentSeed + 5);

      if (isMains && exam.includes('BPSC (Qualifying)')) {
         if (currentTopic.includes('निबंध')) {
            generatedText = `[निबंध लेखन] निम्नलिखित में से किसी एक विषय पर लगभग 500 शब्दों में निबंध लिखें: '${randomSubTopic}' के विभिन्न आयाम और सामाजिक प्रभाव।`;
            explanation = `एक उत्कृष्ट निबंध में स्पष्ट प्रस्तावना, तार्किक मुख्य भाग और संतुलित निष्कर्ष होना चाहिए। व्याकरणिक अशुद्धियों से बचें।`;
         } else if (currentTopic.includes('व्याकरण')) {
            generatedText = `[व्याकरण] '${randomSubTopic}' से संबंधित 5 मुहावरों/लोकोक्तियों का अर्थ बताते हुए वाक्यों में प्रयोग करें।`;
            explanation = `मुहावरों का सटीक अर्थ और वाक्य प्रयोग व्याकरणिक रूप से शुद्ध होना चाहिए।`;
         } else if (currentTopic.includes('वाक्य')) {
            generatedText = `[वाक्य विन्यास] '${randomSubTopic}' के संदर्भ में दिए गए अशुद्ध वाक्यों को शुद्ध करें (लिंग, वचन और कारक संबंधी अशुद्धियां)।`;
            explanation = `संरचनात्मक और व्याकरणिक त्रुटियों को पहचानकर वाक्यों को उनके शुद्ध रूप में फिर से लिखें।`;
         } else {
            generatedText = `[संक्षेपण] '${randomSubTopic}' पर आधारित गद्यांश का एक-तिहाई शब्दों में संक्षेपण करें और उपयुक्त शीर्षक दें।`;
            explanation = `एक अच्छे संक्षेपण में मूल भाव नष्ट नहीं होना चाहिए, शब्द सीमा का पालन करें और प्रासंगिक शीर्षक दें।`;
         }
         uniqueOptions = [];
         correctAns = null;
      } else if (isMains && String(sub).includes('Essay')) {
        const essayTemplates = [
          `[Advanced Essay] Write a comprehensive analytical essay (1000-1200 words) on: The intersection of ${randomSubTopic} and modern ${currentTopic} paradigms.`,
          `[Philosophical Essay] "The true measure of ${currentTopic} lies in its treatment of ${randomSubTopic}." Discuss this statement with historical and contemporary examples.`,
          `[Contemporary Essay] Analyze the socio-economic and ethical challenges posed by the rapid evolution of ${randomSubTopic} in the 21st century.`,
          `[Policy Essay] Evaluate the effectiveness of current global frameworks in addressing issues related to ${randomSubTopic}. Suggest a futuristic roadmap.`
        ];
        generatedText = essayTemplates[templateType];
        uniqueOptions = [];
        correctAns = null;
        explanation = `An excellent essay must feature a captivating introduction, multi-dimensional body paragraphs analyzing the topic from various angles (social, political, economic, ethical), and a forward-looking conclusion with a balanced viewpoint.`;
      } else if (isMains && currentTopic.includes('Statistical')) {
        generatedText = `[Data Analysis] Analyze the assumed data context representing complex pie-charts and bar graphs regarding ${randomSubTopic}. Compute the percentage growth across sectors, extrapolate the specific trend for the next decade, and discuss the policy implications.`;
        uniqueOptions = [];
        correctAns = null;
        explanation = `A correct response must demonstrate highly accurate numerical calculation of the trend, proper interpretation of data variation, followed by a qualitative discussion of the derived insights.`;
      } else if (isMains) {
        const mainsTemplates = [
          `[Advanced Descriptive] Critically evaluate the multi-dimensional impact and functional nuances of ${randomSubTopic} within the broader framework of ${currentTopic}.`,
          `[Analytical] Discuss the historical evolution and contemporary significance of ${randomSubTopic}. How does it shape the landscape of ${currentTopic}?`,
          `[Critical Analysis] "The integration of ${randomSubTopic} has fundamentally altered traditional approaches in ${currentTopic}." Examine this statement with relevant examples.`,
          `[Policy & Impact] Analyze the socio-economic implications of ${randomSubTopic}. Suggest institutional measures for its sustainable integration.`
        ];
        generatedText = mainsTemplates[templateType];
        uniqueOptions = [];
        correctAns = null;
        explanation = `An optimal answer must include an introduction defining the core tenets of ${randomSubTopic}, a highly analytical body discussing its direct and indirect implications on ${currentTopic}, and a balanced, forward-looking conclusion.`;
      } else if ((exam === 'UPSC CSE' || exam === 'BPSC') && !isDiagnostic) {
        const objectiveTemplates = [
          `[Advanced Concept: ${currentTopic}] Consider the following statements regarding ${randomSubTopic}:\n1. It fundamentally establishes a relationship that optimizes the systemic approach.\n2. Its practical application is strictly limited to non-dynamic, isolated environments.\n3. Recent empirical frameworks have integrated it extensively with secondary modules.\nWhich of the statements given above is/are correct?`,
          `[Assertion-Reason: ${currentTopic}] \nAssertion (A): ${randomSubTopic} acts as a primary catalyst for structural changes in the system.\nReason (R): It inherently reduces dynamic scope to maintain absolute stability.\nSelect the correct answer:`,
          `[Fact Check: ${currentTopic}] With reference to ${randomSubTopic}, which of the following statements is NOT correct?`,
          `[Matching: ${currentTopic}] Which of the following is the most accurate characteristic feature of ${randomSubTopic} when applied to real-world scenarios?`
        ];
        generatedText = objectiveTemplates[templateType];
        
        let correctString = "";
        let wrongOptions = [];

        if (templateType === 0) {
           correctString = `1 and 3 only`;
           wrongOptions = [`1 and 2 only`, `2 and 3 only`, `1, 2 and 3`];
           explanation = `Statement 1 is correct as it forms the foundational metric. Statement 2 is incorrect because the scope of ${randomSubTopic} is highly dynamic. Statement 3 is correct per recent literature.`;
        } else if (templateType === 1) {
           correctString = `(A) is true but (R) is false.`;
           wrongOptions = [`Both (A) and (R) are true and (R) is the correct explanation.`, `Both (A) and (R) are true but (R) is not the correct explanation.`, `(A) is false but (R) is true.`];
           explanation = `Assertion is correct as it acts as a catalyst. However, Reason is false because it does not reduce dynamic scope; rather, it expands it for adaptability.`;
        } else if (templateType === 2) {
           correctString = `It eliminates all external dependencies and operates in a complete vacuum.`;
           wrongOptions = [`It integrates smoothly with existing operational frameworks.`, `It requires initial state calibration for optimal performance.`, `It influences secondary sub-systems dynamically over time.`];
           explanation = `The statement claiming it operates in a complete vacuum is NOT correct, as ${randomSubTopic} is highly interdependent on other environmental variables.`;
        } else {
           correctString = `It exhibits highly adaptive traits that align with variable inputs.`;
           wrongOptions = [`It forces the system into a permanent rigid state.`, `It strictly ignores all asynchronous feedback loops.`, `It depreciates the overall efficiency of the primary module.`];
           explanation = `The distinguishing feature of ${randomSubTopic} is its adaptability and integration with variable parameters, making the other options incorrect.`;
        }
        
        correctAns = randInt(0, 3, currentSeed + 9);
        uniqueOptions = [...wrongOptions];
        uniqueOptions.splice(correctAns, 0, correctString);
      } else {
        // Engineering / General Objective
        const engTemplates = [
          `[Concept Check: ${currentTopic}] Regarding the core application of ${randomSubTopic}, which of the following accurately describes its primary function in a complex system?`,
          `[Numerical/Logic: ${currentTopic}] If a system implementing ${randomSubTopic} undergoes a non-linear orthogonal transformation, what is the expected asymptotic effect on the overall state configuration?`,
          `[System Design: ${currentTopic}] Which of the following algorithmic/design strategies is most optimal for handling ${randomSubTopic} under high-load constraints?`,
          `[Troubleshooting: ${currentTopic}] In the context of ${currentTopic}, if ${randomSubTopic} fails to initialize properly, what is the most scientifically sound fallback mechanism?`
        ];
        generatedText = engTemplates[templateType];
        
        const wrongOptionsLists = [
          [`It decreases efficiency by introducing redundant pathways.`, `It isolates the system to prevent dynamic scaling.`, `It serves purely as a theoretical model with no real-world implications.`],
          [`The complexity decreases exponentially due to implicit state reduction.`, `The configuration remains strictly constant.`, `The state space becomes undefined.`],
          [`Strict sequential processing ignoring concurrency.`, `Randomized exhaustive search without heuristics.`, `Static allocation of minimum possible resources.`],
          [`Immediately shutting down all asynchronous processes.`, `Ignoring the failure and proceeding with corrupted memory blocks.`, `Rebooting the hardware without state saving.`]
        ];
        
        const correctStrings = [
          `It establishes a foundational architecture for optimization and scaling.`,
          `The complexity scales proportionally, altering the critical processing path.`,
          `Dynamic resource allocation integrated with predictive heuristic modeling.`,
          `Triggering a graceful degradation protocol while logging the specific fault state.`
        ];
        
        correctAns = randInt(0, 3, currentSeed + 9);
        uniqueOptions = [...wrongOptionsLists[templateType]];
        uniqueOptions.splice(correctAns, 0, correctStrings[templateType]);
        explanation = `The correct answer directly identifies the precise operational nature of ${randomSubTopic} in a realistic system environment. Distractors rely on common logical fallacies.`;
      }
      
      attempts++;
    } while (usedQuestionTexts.has(generatedText) && attempts < 30); 

    uniqueText = generatedText;
    usedQuestionTexts.add(uniqueText);

    questions.push({
      id: qCount + 1,
      type: qType,
      text: uniqueText,
      options: qType === 'mcq' ? uniqueOptions.map(String) : [],
      correctAnswer: qType === 'mcq' ? correctAns : null,
      marks: marks,
      negativeMarks: negativeMarks,
      explanation: String(explanation),
      topic: finalTopic,
      year: generatedYear
    });
    
    qCount++;
  }
  return questions;
};

const getRoadmapForExam = (exam, sub, calculatedDailyHoursStr, startDateStr, examDateStr, planMode = 'standard', diagnosticData = null) => {
  const safeExam = exam || 'GATE';
  const safeSub = sub || 'Computer Science (CS)';
  const fullSyllabus = SYLLABUS_DATA[safeExam]?.[safeSub] || SYLLABUS_DATA['GATE']['Computer Science (CS)'];
  
  const isVVI = planMode === 'vvi_30_days';
  
  // Deep copy to prevent mutating the original database
  let syllabus = fullSyllabus.map(item => ({...item}));

  if (isVVI) {
    // --- BRAND NEW 30-DAY VVI CRASH COURSE PLANNER ---
    // Sort strictly by highest weightage to ensure maximum output.
    syllabus.sort((a, b) => (b.weight || 0) - (a.weight || 0));

    // Extract only the top 3 "Easy & High Yield" important topics
    const topTopics = syllabus.slice(0, 3);
    
    const vviPhases = [
      {
        id: 'vvi_phase_1',
        week: 'Days 1-10',
        title: `Phase 1: High-Yield Essentials (${topTopics[0]?.section || 'Core Fundamentals'})`,
        weight: topTopics[0]?.weight,
        diagnosticScore: diagnosticData ? diagnosticData[topTopics[0]?.section] : 'N/A',
        dateRange: 'First 10 Days',
        tasks: [
          { id: 'vvi_1_t1', type: "video", title: `One-Shot Masterclass: ${topTopics[0]?.section || 'Core Topic'}`, duration: "15 hrs", iconType: "video", color: "text-red-400", bg: "bg-red-400/10", border: "border-red-500/30", xp: "+150 XP", isComingSoon: true },
          { id: 'vvi_1_t2', type: "practice", title: `Solve Top 100 Most Repeated PYQs`, duration: "10 hrs", iconType: "practice", color: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-500/30", xp: "+120 XP" }
        ]
      },
      {
        id: 'vvi_phase_2',
        week: 'Days 11-20',
        title: `Phase 2: Easy Scoring Master (${topTopics[1]?.section || 'Secondary'} & ${topTopics[2]?.section || 'Tertiary'})`,
        dateRange: 'Next 10 Days',
        tasks: [
          { id: 'vvi_2_t1', type: "read", title: `Memorize Cheat Sheets & Factoids`, duration: "8 hrs", iconType: "read", color: "text-amber-400", bg: "bg-amber-400/10", border: "border-amber-500/30", xp: "+80 XP", url: `https://www.google.com/search?q=${encodeURIComponent(safeExam + " " + safeSub + " short notes cheat sheet pdf")}` },
          { id: 'vvi_2_t2', type: "practice", title: `Topic-Wise Mini Mocks for Accuracy`, duration: "12 hrs", iconType: "target", color: "text-blue-400", bg: "bg-blue-400/10", border: "border-blue-500/30", xp: "+100 XP" }
        ]
      },
      {
        id: 'vvi_phase_3',
        week: 'Days 21-30',
        title: `Phase 3: Final Polish & Mega Mocks`,
        dateRange: 'Final 10 Days',
        tasks: [
          { id: 'vvi_3_t1', type: "read", title: "Review Mistake Book (Eliminate Silly Errors)", duration: "5 hrs", iconType: "read", color: "text-purple-400", bg: "bg-purple-400/10", border: "border-purple-500/30", xp: "+50 XP" },
          { id: 'vvi_3_t2', type: "target", title: "Attempt 5 Full-Length Real-Time Mocks", duration: "15 hrs", iconType: "target", color: "text-red-400", bg: "bg-red-400/10", border: "border-red-500/30", xp: "+200 XP" }
        ]
      }
    ];
    
    return vviPhases;
  }

  // --- STANDARD ROADMAP LOGIC (For 6+ Months Prep) ---
  const start = new Date(startDateStr || new Date());
  const end = new Date(examDateStr || new Date(Date.now() + 180 * 24 * 60 * 60 * 1000));
  const totalDays = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
  
  const dailyHours = parseFloat(calculatedDailyHoursStr) || 4;
  const totalAvailableHours = totalDays * dailyHours;

  const syllabusDays = Math.floor(totalDays * 0.8);
  const revisionDays = Math.floor(totalDays * 0.1);
  
  const numSections = syllabus.length || 1;
  const totalMultiplier = syllabus.reduce((sum, item) => sum + (item.timeMultiplier || 1), 0);

  let currentStartDate = new Date(start);

  let phases = syllabus.map((item, idx) => {
    const daysForThisSection = syllabusDays / numSections;
    const hoursForThisSection = (totalAvailableHours * 0.8) / numSections;

    const phaseStart = new Date(currentStartDate);
    const phaseEnd = new Date(currentStartDate.getTime() + Math.max(1, daysForThisSection) * 24 * 60 * 60 * 1000);
    currentStartDate = new Date(phaseEnd);

    const formatDt = (d) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    
    const phaseTitle = String(item.section);

    let phaseTasks = [];
    if (safeExam === 'GATE') {
      phaseTasks = [
        { id: `phase_${idx}_t1`, type: "video", title: `Core Video: ${item.section}`, duration: `${(hoursForThisSection * 0.3).toFixed(1)} hrs`, iconType: "video", color: "text-blue-400", bg: "bg-blue-400/10", border: "border-blue-500/30", xp: `+${Math.round(hoursForThisSection * 10)} XP`, isComingSoon: true },
        { id: `phase_${idx}_t2`, type: "video", title: `High-Yield NPTEL: ${item.section}`, duration: `${(hoursForThisSection * 0.3).toFixed(1)} hrs`, iconType: "video", color: "text-indigo-400", bg: "bg-indigo-400/10", border: "border-indigo-500/30", xp: `+${Math.round(hoursForThisSection * 10)} XP`, isComingSoon: true },
        { id: `phase_${idx}_t3`, type: "read", title: `Quick Notes: ${item.book || "Standard Text"}`, duration: `${(hoursForThisSection * 0.2).toFixed(1)} hrs`, iconType: "read", color: "text-amber-400", bg: "bg-amber-400/10", border: "border-amber-500/30", xp: `+${Math.round(hoursForThisSection * 8)} XP`, url: `https://www.google.com/search?q=${encodeURIComponent(item.book || "Standard Text")}` },
        { id: `phase_${idx}_t4`, type: "practice", title: `Most Expected PYQs`, duration: `${(hoursForThisSection * 0.2).toFixed(1)} hrs`, iconType: "practice", color: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-500/30", xp: `+${Math.round(hoursForThisSection * 12)} XP` }
      ];
    } else {
      phaseTasks = [
        { id: `phase_${idx}_t1`, type: "video", title: `Masterclass: ${String(item.section)}`, duration: `${(hoursForThisSection * 0.4).toFixed(1)} hrs`, iconType: "video", color: "text-blue-400", bg: "bg-blue-400/10", border: "border-blue-500/30", xp: `+${Math.round(hoursForThisSection * 10)} XP`, isComingSoon: true },
        { id: `phase_${idx}_t2`, type: "read", title: `VVI Summary: ${String(item.wikiKey || item.section)}`, duration: `${(hoursForThisSection * 0.3).toFixed(1)} hrs`, iconType: "read", color: "text-amber-400", bg: "bg-amber-400/10", border: "border-amber-500/30", xp: `+${Math.round(hoursForThisSection * 8)} XP`, url: `https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(item.wikiKey || item.section)}` },
        { id: `phase_${idx}_t3`, type: "practice", title: `Top 50 PYQs: ${String(item.section)}`, duration: `${(hoursForThisSection * 0.3).toFixed(1)} hrs`, iconType: "practice", color: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-500/30", xp: `+${Math.round(hoursForThisSection * 12)} XP` }
      ];
    }

    return {
      id: `phase_${idx}`,
      week: `Phase ${idx + 1}`,
      title: phaseTitle,
      weight: item.weight,
      diagnosticScore: item.diagnosticScore,
      dateRange: `${formatDt(phaseStart)} to ${formatDt(phaseEnd)}`,
      tasks: phaseTasks
    };
  });

  const revStart = new Date(currentStartDate);
  const revEnd = new Date(currentStartDate.getTime() + revisionDays * 24 * 60 * 60 * 1000);
  currentStartDate = new Date(revEnd);
  
  phases.push({
    id: 'consolidation',
    week: "Consolidation",
    title: "Complete Syllabus Revision",
    dateRange: `${revStart.toLocaleDateString('en-US', {month:'short', day:'numeric'})} to ${revEnd.toLocaleDateString('en-US', {month:'short', day:'numeric'})}`,
    tasks: [
      { id: 'cons_t1', type: "read", title: "Revise Formula Book & High-Yield Facts", duration: `${(totalAvailableHours * 0.1 * 0.6).toFixed(1)} hrs`, iconType: "read", color: "text-purple-400", bg: "bg-purple-400/10", border: "border-purple-500/30", xp: `+${Math.round((totalAvailableHours * 0.1)*10)} XP` },
      { id: 'cons_t2', type: "practice", title: "Attempt Topic-Wise Mock Tests", duration: `${(totalAvailableHours * 0.1 * 0.4).toFixed(1)} hrs`, iconType: "practice", color: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-500/30", xp: `+${Math.round((totalAvailableHours * 0.1)*8)} XP` }
    ]
  });

  return phases;
};

const calculateUserLevel = (userData) => {
  let level = 1;
  // Base XP level
  level += Math.floor((userData?.xp || 0) / 500);
  // Streak bonus
  level += Math.floor((userData?.streak || 0) / 3);
  // Performance bonus from mock tests
  if (userData?.testHistory?.length > 0) {
    const totalScore = userData.testHistory.reduce((acc, test) => acc + (Number(test.score) / Number(test.maxScore)), 0);
    const avg = (totalScore / userData.testHistory.length) * 100;
    if (avg >= 80) level += 2;
    else if (avg >= 50) level += 1;
  }
  return level;
};
const AuthScreen = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); // Password fixed!

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && password) {
      onLogin({ name: name || email.split('@')[0], email, password, isLogin });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" style={{ animationDelay: '2s' }}></div>

      <MotionDiv className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Brain className="w-8 h-8 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
          {isLogin ? 'Welcome Back' : 'Start Your Journey'}
        </h2>
        <p className="mt-2 text-center text-sm text-slate-400">
          AI-powered learning roadmaps to help you conquer any exam.
        </p>
      </MotionDiv>

      <MotionDiv delay={100} className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-slate-900 py-8 px-4 shadow-2xl shadow-indigo-500/10 sm:rounded-2xl sm:px-10 border border-slate-800">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {!isLogin && (
              <MotionDiv animation="fade-right" delay={100}>
                <label className="block text-sm font-medium text-slate-300">Full Name</label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserPlus className="h-5 w-5 text-slate-500" />
                  </div>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} required className="appearance-none block w-full pl-10 pr-3 py-3 border border-slate-700 rounded-xl bg-slate-800 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all" placeholder="John Doe" />
                </div>
              </MotionDiv>
            )}
            <MotionDiv animation="fade-right" delay={150}>
              <label className="block text-sm font-medium text-slate-300">Email Address</label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-500" />
                </div>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="appearance-none block w-full pl-10 pr-3 py-3 border border-slate-700 rounded-xl bg-slate-800 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all" placeholder="you@example.com" />
              </div>
            </MotionDiv>

            <MotionDiv animation="fade-right" delay={200}>
              <label className="block text-sm font-medium text-slate-300">Password</label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-500" />
                </div>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="appearance-none block w-full pl-10 pr-3 py-3 border border-slate-700 rounded-xl bg-slate-800 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all" placeholder="••••••••" />
              </div>
            </MotionDiv>

            <MotionDiv animation="fade-up" delay={300}>
              <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-indigo-500 transition-all transform hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-500/25 active:scale-95">
                {isLogin ? 'Sign In' : 'Create Account'}
              </button>
            </MotionDiv>
          </form>

          <div className="mt-6 text-center">
            <button onClick={() => setIsLogin(!isLogin)} className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
              {isLogin ? "New user? Create an account" : "Already have an account? Sign in"}
            </button>
          </div>
        </div>
      </MotionDiv>
    </div>
  );
};
  const AIChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hello! I am your AI Study Guide. Do you need help with your GATE, UPSC, BPSC, or Semester strategy?", sender: 'ai' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    if (isOpen) endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userText = input;
    setMessages(prev => [...prev, { text: userText, sender: 'user' }]);
    setInput('');
    setIsTyping(true);

    try {
      const apiKey = process.env.REACT_APP_GEMINI_API_KEY; 
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
      
      const chatHistory = messages.map(m => `${m.sender === 'ai' ? 'EduForge' : 'Student'}: ${m.text}`).join('\n');
      const prompt = `You are EduForge AI, an expert exam tutor for GATE, UPSC, BPSC, and University exams. Provide helpful, encouraging, and concise responses (max 3-4 sentences). Do not use markdown formatting like ** or *. Plain text only. All content MUST be in English.
Conversation History:
${chatHistory}
Student: ${userText}
EduForge:`;

      const payload = {
        contents: [{ parts: [{ text: prompt }] }]
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      // if (!response.ok) throw new Error('API Error');
      const data = await response.json();
      console.log(data)
      const aiReply = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm having trouble connecting right now. Please try again.";
      
      setMessages(prev => [...prev, { text: aiReply.trim(), sender: 'ai' }]);
    } catch (e) {
      console.log(e)
      setMessages(prev => [...prev, { text: "Network constraint detected. Please check your internet connection.", sender: 'ai' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <MotionDiv animation="fade-in" className="bg-slate-900 border border-slate-700 w-80 md:w-96 h-[30rem] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 flex justify-between items-center shadow-md">
            <div className="flex items-center space-x-2">
              <Brain className="w-6 h-6 text-white" />
              <span className="font-bold text-white">AI Assistant</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white hover:bg-white/20 p-1 rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-950">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                  msg.sender === 'user' 
                  ? 'bg-indigo-600 text-white rounded-br-none' 
                  : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-bl-none'
                }`}>
                  {String(msg.text)}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="max-w-[80%] p-3 rounded-2xl text-sm bg-slate-800 text-slate-200 border border-slate-700 rounded-bl-none flex space-x-2 items-center">
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          <div className="p-3 bg-slate-900 border-t border-slate-800">
            <div className="flex items-center bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask anything..." 
                className="flex-1 bg-transparent text-white px-4 py-3 focus:outline-none text-sm"
              />
              <button onClick={handleSend} className="px-4 text-indigo-400 hover:text-indigo-300 transition-colors">
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </MotionDiv>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 w-16 h-16 rounded-full shadow-xl shadow-indigo-500/30 flex items-center justify-center transform hover:scale-105 transition-all active:scale-95"
        >
          <MessageSquare className="w-7 h-7 text-white" />
        </button>
      )}
    </div>
  );
};

const ServerConnectionLoader = ({ exam, sub, testType, topicIndex, sessionIndex, onComplete }) => {
  const [status, setStatus] = useState("Initializing secure connection...");

  useEffect(() => {
    let isMounted = true;
    
    const fetchQuestions = async () => {
      try {
        setStatus("Connecting to EduForge Live AI Servers...");
        
        const topicLists = SYLLABUS_DATA[exam]?.[sub] || [];
        const isMains = String(sub).includes('Mains');
        const testMeta = getTestMetadata(exam, sub);
        
        let topicName = "Full Syllabus Mixed";
        let count = testMeta.qs;

        if (testType === 'Topic-Wise' && topicLists[topicIndex]) {
          topicName = String(topicLists[topicIndex].section) + " - Session " + sessionIndex;
          count = isMains ? 5 : 30;
        }
        
        const fetchCount = count > 30 ? 30 : count; // Max bulk limit for API
        setStatus(`Fetching Live Internet PYQs for ${topicName}...`);
        
        const aiQuestions = await fetchLivePYQsFromAI(exam, sub, topicName, fetchCount);
        
        if (!isMounted) return;
        setStatus("Formatting and structuring the test...");
        
        let finalQuestions = aiQuestions.map((q, i) => {
           let marks = 2, negativeMarks = 0.66, type = 'mcq';
           if (isMains) { 
               type = 'theory'; 
               if (exam.includes('BPSC (Qualifying)')) {
                   const marksArray = [30, 30, 25, 15];
                   marks = marksArray[i % 4] || 15;
               } else {
                   marks = 15; 
               }
               negativeMarks = 0; 
           }
           else if (exam === 'UPSC CSE' && String(sub).includes('CSAT')) { marks = 2.5; negativeMarks = 0.83; }
           else if (exam === 'BPSC') { marks = 1; negativeMarks = 0.25; }

           return {
             id: i + 1,
             type: type,
             text: `Q${i + 1}: \n\n[Live AI PYQ] ${String(q.text)}`,
             options: (q.options || []).map(String),
             correctAnswer: isMains ? null : (Number(q.correctAnswer) || 0),
             marks: marks,
             negativeMarks: negativeMarks,
             explanation: String(q.explanation),
             topic: testType === 'Diagnostic' ? (topicLists[i % topicLists.length]?.section || 'General') : topicName.split(' - ')[0]
           };
        });

        if (finalQuestions.length < count) {
           setStatus("Merging live questions with internal PYQ offline database...");
           const fallback = generateQuestions(exam, sub, testType, topicIndex, sessionIndex).slice(finalQuestions.length);
           const adjustedFallback = fallback.map((q, i) => ({...q, id: finalQuestions.length + i + 1, text: String(q.text).replace(/Q\d+:/, `Q${finalQuestions.length + i + 1}:`)}));
           finalQuestions = [...finalQuestions, ...adjustedFallback];
        }

        setStatus("Ready! Launching Secure CBT Interface...");
        setTimeout(() => { if(isMounted) onComplete(finalQuestions); }, 1000);
        
      } catch (e) {
        if (!isMounted) return;
        setStatus("Network constraint detected. Switching to local offline PYQ database...");
        const fallback = generateQuestions(exam, sub, testType, topicIndex, sessionIndex);
        setTimeout(() => { if(isMounted) onComplete(fallback); }, 1500);
      }
    };
    
    fetchQuestions();
    
    return () => { isMounted = false; };
  }, [exam, sub, testType, topicIndex, sessionIndex, onComplete]);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center fixed inset-0 z-50">
      <div className="relative w-32 h-32 mb-8 flex items-center justify-center">
        <div className="absolute inset-0 bg-indigo-500 rounded-full animate-ping opacity-20"></div>
        <div className="absolute inset-4 bg-emerald-500 rounded-full animate-ping opacity-40" style={{ animationDelay: '0.4s' }}></div>
        <div className="relative z-10 w-20 h-20 bg-slate-900 border-4 border-indigo-500 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(99,102,241,0.5)]">
          <DownloadCloud className="w-8 h-8 text-emerald-400 animate-pulse" />
        </div>
        <Wifi className="absolute top-0 right-0 w-6 h-6 text-indigo-400 animate-bounce" />
        <Database className="absolute bottom-0 left-0 w-6 h-6 text-indigo-400 animate-bounce" style={{ animationDelay: '0.5s' }} />
      </div>
      <h2 className="text-2xl font-bold text-white mb-4 animate-pulse">Live Server Sync Active</h2>
      <div className="bg-slate-900 border border-slate-700 rounded-lg py-3 px-6">
        <p className="text-emerald-400 font-mono text-sm flex items-center">
          <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-ping"></span>
          {String(status)}
        </p>
      </div>
    </div>
  );
};

const StrategyScreen = ({ navigate, context, userData }) => {
  const [selectedExam, setSelectedExam] = useState(context?.exam || userData?.targetExam || 'GATE');
  const [selectedSub, setSelectedSub] = useState(context?.sub || userData?.targetSub || 'Computer Science (CS)');
  const [aiStrategy, setAiStrategy] = useState(null);
  const [isFetching, setIsFetching] = useState(false);

  const exams = Object.keys(SYLLABUS_DATA);
  const subs = SYLLABUS_DATA[selectedExam] ? Object.keys(SYLLABUS_DATA[selectedExam]) : [];

  useEffect(() => {
    if (!subs.includes(selectedSub) && subs.length > 0) {
      setSelectedSub(subs[0]);
    }
  }, [selectedExam, subs, selectedSub]);

  const handleFetchAIStrategy = async () => {
    setIsFetching(true);
    setAiStrategy(null);
    const strategy = await fetchAIStrategy(selectedExam, selectedSub);
    setAiStrategy(strategy);
    setIsFetching(false);
  };

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <MotionDiv className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <button onClick={() => navigate('dashboard')} className="text-slate-400 hover:text-white flex items-center transition-colors mb-4 text-sm">
            <ArrowLeft className="w-4 h-4 mr-1" /> Go Back
          </button>
          <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500 flex items-center">
            <Lightbulb className="w-8 h-8 mr-3 text-amber-400" /> AI Practice Strategy
          </h1>
          <p className="text-slate-400 mt-2 text-lg">Phase-by-phase customized preparation methodology.</p>
        </div>
      </MotionDiv>

      <MotionDiv delay={100} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Select Examination</label>
            <select 
              value={selectedExam}
              onChange={(e) => setSelectedExam(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all appearance-none"
            >
              {exams.map(ex => <option key={ex} value={ex}>{String(ex)}</option>)}
            </select>
          </div>
          {subs.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Select Branch / Stage</label>
              <select 
                value={selectedSub}
                onChange={(e) => setSelectedSub(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all appearance-none"
              >
                {subs.map(sub => <option key={sub} value={sub}>{String(sub)}</option>)}
              </select>
            </div>
          )}
        </div>

        <div className="flex justify-center mb-8 border-b border-slate-800 pb-8">
          <button 
            onClick={handleFetchAIStrategy} 
            disabled={isFetching}
            className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-amber-500/25 flex items-center transform hover:-translate-y-1 active:scale-95 disabled:opacity-70 disabled:scale-100"
          >
            {isFetching ? (
              <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div> Analyzing Pattern...</>
            ) : (
              <><Zap className="w-5 h-5 mr-2" /> Generate Personalized AI Strategy</>
            )}
          </button>
        </div>

        {aiStrategy ? (
          <MotionDiv animation="fade-in" className="bg-slate-950/50 border border-amber-500/30 rounded-2xl p-6 md:p-8">
            <h3 className="text-xl font-bold text-amber-400 mb-4 flex items-center">
              <Brain className="w-6 h-6 mr-2" /> Live Expert AI Advice
            </h3>
            <div className="text-slate-300 leading-relaxed whitespace-pre-wrap text-sm">
              <MathFormatter text={String(aiStrategy)} />
            </div>
          </MotionDiv>
        ) : (
          <div className="space-y-6 relative">
            <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-slate-800 hidden md:block"></div>
            {[
              { title: "Phase 1: Concept Building & Foundation", icon: <BookOpen className="w-5 h-5" />, color: "text-blue-400", bg: "bg-blue-400/20", border: "border-blue-500/30", text: "Focus entirely on standard textbooks and high-quality video lectures. Do not rush to solve complex problems until the base concept is crystal clear. Make short notes specifically containing definitions, formulas, and edge cases." },
              { title: "Phase 2: Targeted Practice & PYQs", icon: <History className="w-5 h-5" />, color: "text-emerald-400", bg: "bg-emerald-400/20", border: "border-emerald-500/30", text: `Solve the last 10 years of ${selectedExam} Previous Year Questions (PYQs). Analyze each question's explanation, even if your answer was correct. This reveals the examiner's mindset and helps identify the most frequently tested subtopics in ${selectedSub}.` },
              { title: "Phase 3: Topic-wise Micro Tests", icon: <PenTool className="w-5 h-5" />, color: "text-purple-400", bg: "bg-purple-400/20", border: "border-purple-500/30", text: "Take short, topic-wise tests immediately after finishing a module. Use this phase to identify silly mistakes and time-consuming question traps. Strictly adhere to the negative marking scheme to build accuracy." },
              { title: "Phase 4: Full-Length Simulation", icon: <Target className="w-5 h-5" />, color: "text-red-400", bg: "bg-red-400/20", border: "border-red-500/30", text: "During the final month, simulate the exact exam environment. For Mains/Descriptive: write full-length answers focusing on structure (Intro, Body, Conclusion). For Prelims/GATE: take 3-hour CBT mocks to perfect time management and pressure handling." }
            ].map((phase, idx) => (
              <MotionDiv key={idx} delay={idx * 100} animation="fade-up" className="relative z-10 flex flex-col md:flex-row items-start">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 mb-4 md:mb-0 md:mr-6 ${phase.bg} ${phase.color} border ${phase.border} shadow-lg`}>
                  {phase.icon}
                </div>
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 flex-1 hover:border-slate-600 transition-colors">
                  <h3 className={`text-lg font-bold mb-2 ${phase.color}`}>{phase.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{phase.text}</p>
                </div>
              </MotionDiv>
            ))}
          </div>
        )}
      </MotionDiv>
    </div>
  );
};

const SyllabusScreen = ({ navigate, context, userData }) => {
  const [selectedExam, setSelectedExam] = useState(context?.exam || userData?.targetExam || 'GATE');
  const [selectedSub, setSelectedSub] = useState(context?.sub || userData?.targetSub || 'Computer Science (CS)');
  const [viewingPdf, setViewingPdf] = useState(null);

  const exams = Object.keys(SYLLABUS_DATA);
  const subs = SYLLABUS_DATA[selectedExam] ? Object.keys(SYLLABUS_DATA[selectedExam]) : [];

  useEffect(() => {
    if (!subs.includes(selectedSub) && subs.length > 0) {
      setSelectedSub(subs[0]);
    }
  }, [selectedExam, subs, selectedSub]);

  const currentSyllabus = SYLLABUS_DATA[selectedExam]?.[selectedSub] || [];

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <MotionDiv className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <button onClick={() => navigate('dashboard')} className="text-slate-400 hover:text-white flex items-center transition-colors mb-4 text-sm">
            <ArrowLeft className="w-4 h-4 mr-1" /> Go Back
          </button>
          <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400 flex items-center">
            <Layers className="w-8 h-8 mr-3 text-indigo-400" /> Syllabus Library
          </h1>
          <p className="text-slate-400 mt-2 text-lg">Official examination topics and breakdown.</p>
        </div>
      </MotionDiv>

      <MotionDiv delay={100} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Select Examination</label>
            <select 
              value={selectedExam}
              onChange={(e) => setSelectedExam(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all appearance-none"
            >
              {exams.map(ex => <option key={ex} value={ex}>{String(ex)}</option>)}
            </select>
          </div>
          {subs.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Select Branch / Stage</label>
              <select 
                value={selectedSub}
                onChange={(e) => setSelectedSub(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all appearance-none"
              >
                {subs.map(sub => <option key={sub} value={sub}>{String(sub)}</option>)}
              </select>
            </div>
          )}
        </div>

        {/* EXAM METADATA & PATTERN SECTION */}
        {EXAM_METADATA[selectedExam] && (
          <MotionDiv animation="fade-in" delay={100} className="mb-10 p-6 bg-slate-950/50 border border-slate-700 rounded-2xl shadow-inner">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 border-b border-slate-800 pb-4">
              <h3 className="text-xl font-bold text-white flex items-center">
                <Target className="w-5 h-5 mr-2 text-indigo-400" /> Exam Pattern & Overview
              </h3>
              <button 
                onClick={(e) => { e.preventDefault(); setViewingPdf(EXAM_METADATA[selectedExam]); }} 
                className="flex items-center px-4 py-2 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 border border-indigo-500/30 rounded-lg text-sm font-bold transition-colors cursor-pointer"
              >
                <DownloadCloud className="w-4 h-4 mr-2" /> {EXAM_METADATA[selectedExam].pdfTitle}
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 text-sm">
                    <th className="py-3 px-4 font-medium">Stage</th>
                    <th className="py-3 px-4 font-medium">Type</th>
                    <th className="py-3 px-4 font-medium">Marks</th>
                    <th className="py-3 px-4 font-medium">Duration</th>
                  </tr>
                </thead>
                <tbody className="text-slate-300">
                  {EXAM_METADATA[selectedExam].pattern.map((row, idx) => (
                    <tr key={idx} className="border-b border-slate-800/50 hover:bg-slate-900/50 transition-colors">
                      <td className="py-4 px-4 font-bold text-white whitespace-nowrap">{row.stage}</td>
                      <td className="py-4 px-4 text-sm">{row.type}<br/><span className="text-xs text-slate-500 mt-1 block">{row.details}</span></td>
                      <td className="py-4 px-4 font-medium text-emerald-400 whitespace-nowrap">{row.marks}</td>
                      <td className="py-4 px-4 text-sm whitespace-nowrap">{row.duration}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </MotionDiv>
        )}

        <div className="space-y-4">
          {currentSyllabus.length > 0 ? (
            currentSyllabus.map((item, idx) => (
              <MotionDiv key={idx} delay={idx * 50} animation="fade-up">
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-colors shadow-md">
                  <div className="flex items-start">
                    <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center shrink-0 mr-4">
                      <FileText className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">{String(item.section)}</h3>
                      <p className="text-slate-400 leading-relaxed mb-3">{String(item.topics)}</p>
                      <span className="text-xs font-bold px-3 py-1 bg-indigo-500/20 text-indigo-400 rounded-full border border-indigo-500/30">
                        Best Content: {String(item.source)}
                      </span>
                    </div>
                  </div>
                </div>
              </MotionDiv>
            ))
          ) : (
            <div className="text-center py-12 text-slate-500">
              Syllabus for this selection is not available yet.
            </div>
          )}
        </div>

        {viewingPdf && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
            <MotionDiv animation="fade-in" className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[80vh] flex flex-col overflow-hidden">
              <div className="flex justify-between items-center p-4 border-b border-slate-800 bg-slate-800/50">
                <h3 className="text-white font-bold flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-indigo-400" /> {viewingPdf.pdfTitle}
                </h3>
                <button onClick={() => setViewingPdf(null)} className="text-slate-400 hover:text-white transition-colors p-1">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6 overflow-y-auto flex-1 text-slate-300 whitespace-pre-wrap font-mono text-sm leading-relaxed bg-slate-950">
                {viewingPdf.pdfContent}
              </div>
              <div className="p-4 border-t border-slate-800 bg-slate-800/50 flex justify-end">
                <button 
                  onClick={() => {
                    const blob = new Blob([viewingPdf.pdfContent], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = viewingPdf.pdfTitle.replace('.pdf', '.txt');
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                  }}
                  className="flex items-center px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold transition-colors shadow-lg"
                >
                  <DownloadCloud className="w-5 h-5 mr-2" /> Download as Text
                </button>
              </div>
            </MotionDiv>
          </div>
        )}
      </MotionDiv>
    </div>
  );
};

const RoadmapSetupScreen = ({ navigate, context, onGenerate, userData }) => {
  const exams = Object.keys(SYLLABUS_DATA);
  const defaultExam = context?.exam || userData?.targetExam || 'GATE';
  const defaultSub = context?.sub || userData?.targetSub || (SYLLABUS_DATA[defaultExam] ? Object.keys(SYLLABUS_DATA[defaultExam])[0] : 'Computer Science (CS)');

  const [planMode, setPlanMode] = useState('standard'); // 'standard' or 'vvi_30_days'
  const [selectedExam, setSelectedExam] = useState(defaultExam);
  const [selectedSub, setSelectedSub] = useState(defaultSub);
  const [hours, setHours] = useState('4');
  const [isFetchingDiagnostic, setIsFetchingDiagnostic] = useState(false);
  
  const today = new Date().toISOString().split('T')[0];
  const defaultExamDate = new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  
  const [startDate, setStartDate] = useState(today);
  const [examDate, setExamDate] = useState(defaultExamDate);
  const [isSuggesting, setIsSuggesting] = useState(false);

  const subs = SYLLABUS_DATA[selectedExam] ? Object.keys(SYLLABUS_DATA[selectedExam]) : [];

  useEffect(() => {
    if (!subs.includes(selectedSub) && subs.length > 0) {
      setSelectedSub(subs[0]);
    }
  }, [selectedExam, subs, selectedSub]);

  const handleSuggestHours = async () => {
    setIsSuggesting(true);
    try {
      const start = new Date(startDate);
      const end = new Date(examDate);
      const totalDays = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
      
      const apiKey = "AIzaSyBsbaozbt3qknzDE2GdnUDOgfTB0jZwt9c"; 
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
      const prompt = `Calculate ideal daily study hours for ${selectedExam} - ${selectedSub} with ${totalDays} days left until the exam. Respond with ONLY a single integer between 2 and 12. No other text.`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });
      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
      const num = parseInt(text);
      if (num >= 2 && num <= 12) {
        setHours(num.toString());
      }
    } catch (error) {
      console.error("AI Suggestion Failed", error);
    }
    setIsSuggesting(false);
  };

  const handleModeChange = (mode) => {
    setPlanMode(mode);
    if (mode === 'vvi_30_days') {
      setHours('8'); // Force higher hours for crash course
      setStartDate(today);
      const crashEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      setExamDate(crashEnd);
    }
  };

  const handleGenerate = () => {
    if (planMode === 'vvi_30_days') {
      setIsFetchingDiagnostic(true);
      return;
    }

    const roadmap = getRoadmapForExam(selectedExam, selectedSub, hours, startDate, examDate, planMode);
    const start = new Date(startDate);
    const end = new Date(examDate);
    const totalDays = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
    
    const generatedData = { 
      exam: selectedExam, 
      sub: selectedSub, 
      hours, 
      totalDays, 
      startDate, 
      examDate: end.toISOString().split('T')[0], 
      planMode,
      roadmapData: roadmap 
    };
    
    onGenerate(generatedData);
    navigate('roadmap', generatedData);
  };

  if (isFetchingDiagnostic) {
    return (
      <ServerConnectionLoader 
        exam={selectedExam} 
        sub={selectedSub} 
        testType="Diagnostic" 
        topicIndex={0} 
        sessionIndex={1} 
        onComplete={(questions) => {
          navigate('active-test', { 
            exam: selectedExam, 
            sub: selectedSub, 
            testType: 'Diagnostic', 
            topicIndex: 0,
            sessionIndex: 1,
            questions: questions,
            isDiagnostic: true,
            diagnosticSetupContext: { exam: selectedExam, sub: selectedSub, hours, startDate, examDate, planMode }
          });
        }} 
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <MotionDiv className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <button onClick={() => navigate('dashboard')} className="text-slate-400 hover:text-white flex items-center transition-colors mb-4 text-sm">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
          </button>
          <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400 flex items-center">
            <Map className="w-8 h-8 mr-3 text-indigo-400" /> Create Your Roadmap
          </h1>
          <p className="text-slate-400 mt-2 text-lg">Customize your AI-generated preparation schedule.</p>
        </div>
      </MotionDiv>

      <MotionDiv delay={100} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row gap-4 mb-10 border-b border-slate-800 pb-8">
          <button 
            onClick={() => handleModeChange('standard')}
            className={`flex-1 p-6 rounded-2xl border-2 transition-all flex flex-col items-center justify-center text-center ${planMode === 'standard' ? 'border-indigo-500 bg-indigo-500/10 shadow-[0_0_20px_rgba(99,102,241,0.2)]' : 'border-slate-700 bg-slate-950 hover:border-slate-500'}`}
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${planMode === 'standard' ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-400'}`}>
              <Map className="w-6 h-6" />
            </div>
            <h3 className={`text-lg font-bold ${planMode === 'standard' ? 'text-white' : 'text-slate-300'}`}>Standard Program</h3>
            <p className="text-sm text-slate-500 mt-2">Comprehensive syllabus coverage with custom dates.</p>
          </button>
          
          <button 
            onClick={() => handleModeChange('vvi_30_days')}
            className={`flex-1 p-6 rounded-2xl border-2 transition-all flex flex-col items-center justify-center text-center relative overflow-hidden ${planMode === 'vvi_30_days' ? 'border-red-500 bg-red-500/10 shadow-[0_0_20px_rgba(239,68,68,0.2)]' : 'border-slate-700 bg-slate-950 hover:border-slate-500'}`}
          >
            {planMode === 'vvi_30_days' && <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-orange-500 animate-pulse"></div>}
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${planMode === 'vvi_30_days' ? 'bg-red-500 text-white' : 'bg-slate-800 text-slate-400'}`}>
              <Flame className="w-6 h-6" />
            </div>
            <h3 className={`text-lg font-bold ${planMode === 'vvi_30_days' ? 'text-red-400' : 'text-slate-300'}`}>30-Day VVI Crash Course</h3>
            <p className="text-sm text-slate-500 mt-2">Fast-tracked roadmap focusing only on the most important (VVI) topics.</p>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Select Examination</label>
            <select 
              value={selectedExam}
              onChange={(e) => setSelectedExam(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all appearance-none"
            >
              {exams.map(ex => <option key={ex} value={ex}>{String(ex)}</option>)}
            </select>
          </div>
          {subs.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Select Branch / Stage</label>
              <select 
                value={selectedSub}
                onChange={(e) => setSelectedSub(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all appearance-none"
              >
                {subs.map(sub => <option key={sub} value={sub}>{String(sub)}</option>)}
              </select>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-slate-300">Daily Study Hours</label>
              <button 
                onClick={handleSuggestHours} 
                disabled={isSuggesting || planMode === 'vvi_30_days'}
                className={`text-xs font-bold transition-colors flex items-center px-2 py-1 rounded-md ${planMode === 'vvi_30_days' ? 'text-slate-500 bg-slate-800 cursor-not-allowed' : 'text-amber-400 hover:text-amber-300 bg-amber-500/10'}`}
              >
                {isSuggesting ? <div className="w-3 h-3 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mr-1"></div> : <Brain className="w-3 h-3 mr-1" />}
                {planMode === 'vvi_30_days' ? 'Locked (Intense)' : 'AI Suggest'}
              </button>
            </div>
            <select 
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              disabled={planMode === 'vvi_30_days'}
              className={`w-full border rounded-xl px-4 py-3 text-white focus:outline-none transition-all appearance-none ${planMode === 'vvi_30_days' ? 'bg-slate-900 border-slate-700 opacity-70 cursor-not-allowed' : 'bg-slate-950 border-slate-700 focus:ring-2 focus:ring-indigo-500'}`}
            >
              {[2, 3, 4, 5, 6, 8, 10, 12].map(h => <option key={h} value={h}>{h} Hours / Day</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Start Date</label>
            <input 
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              disabled={planMode === 'vvi_30_days'}
              className={`w-full border rounded-xl px-4 py-3 text-white focus:outline-none transition-all ${planMode === 'vvi_30_days' ? 'bg-slate-900 border-slate-700 opacity-70 cursor-not-allowed' : 'bg-slate-950 border-slate-700 focus:ring-2 focus:ring-indigo-500'}`}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Exam Date</label>
            <input 
              type="date"
              value={examDate}
              onChange={(e) => setExamDate(e.target.value)}
              disabled={planMode === 'vvi_30_days'}
              className={`w-full border rounded-xl px-4 py-3 text-white focus:outline-none transition-all ${planMode === 'vvi_30_days' ? 'bg-slate-900 border-slate-700 opacity-70 cursor-not-allowed' : 'bg-slate-950 border-slate-700 focus:ring-2 focus:ring-indigo-500'}`}
            />
          </div>
        </div>

        <div className="flex justify-center pt-6 border-t border-slate-800">
          <button 
            onClick={handleGenerate} 
            className={`px-8 py-4 text-white font-bold rounded-xl transition-all shadow-lg flex items-center transform hover:-translate-y-1 active:scale-95 ${planMode === 'vvi_30_days' ? 'bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 shadow-red-500/25' : 'bg-gradient-to-r from-indigo-600 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500 shadow-indigo-500/25'}`}
          >
            {planMode === 'vvi_30_days' ? <><Target className="w-5 h-5 mr-2" /> Start VVI Diagnostic Test</> : <><Zap className="w-5 h-5 mr-2" /> Generate Complete Roadmap</>}
          </button>
        </div>
      </MotionDiv>
    </div>
  );
};

const RoadmapScreen = ({ navigate, context, userData, onTaskDone }) => {
  const [lockedTaskReq, setLockedTaskReq] = useState(null);
  const safeContext = context || userData.activeRoadmap || { exam: 'GATE', sub: 'Computer Science (CS)', hours: '4', startDate: new Date().toISOString(), examDate: new Date(Date.now() + 180*24*60*60*1000).toISOString(), totalDays: 180, planMode: 'standard', roadmapData: [] };
  const roadmapData = safeContext.roadmapData && safeContext.roadmapData.length > 0 ? safeContext.roadmapData : getRoadmapForExam(safeContext.exam, safeContext.sub, safeContext.hours, safeContext.startDate, safeContext.examDate, safeContext.planMode);

  const getIcon = (type) => {
    switch(type) {
      case 'video': return <Video className="w-5 h-5" />;
      case 'read': return <BookMarked className="w-5 h-5" />;
      case 'practice': return <PenTool className="w-5 h-5" />;
      case 'target': return <Target className="w-5 h-5" />;
      default: return <CheckCircle className="w-5 h-5" />;
    }
  };

  const handleMarkClick = (task, moduleTitle) => {
    // Lock logic: Video/Read tasks need >=80% in associated mock test
    if (task.type === 'video' || task.type === 'read') {
      const hasPassed = userData.testHistory.some(t => 
        t.testName.includes(moduleTitle) && ((Number(t.score) / Number(t.maxScore)) * 100 >= 80)
      );
      if (!hasPassed) {
        setLockedTaskReq({ taskTitle: task.title, moduleTitle });
        return;
      }
    }
    onTaskDone(task.id, task.xp);
  };

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <MotionDiv className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-6">
        <div>
          <button onClick={() => navigate('dashboard')} className="text-slate-400 hover:text-white flex items-center transition-colors mb-4 text-sm">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
          </button>
          <h1 className={`text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r ${safeContext.planMode === 'vvi_30_days' ? 'from-red-400 to-orange-400' : 'from-indigo-400 to-emerald-400'}`}>
            {safeContext.planMode === 'vvi_30_days' ? '30-Day VVI Crash Course' : 'Full Preparation Journey'}
          </h1>
          <p className="text-slate-400 mt-2 text-lg">
            {String(safeContext.exam)} • {String(safeContext.sub) !== 'General' ? String(safeContext.sub) : ''} • {safeContext.totalDays} Days • <span className="font-bold text-white">{safeContext.hours} Hours/Day</span>
          </p>
        </div>
        <div className={`flex items-center space-x-2 border rounded-full px-6 py-3 shadow-xl ${safeContext.planMode === 'vvi_30_days' ? 'bg-red-950/30 border-red-500/30 text-red-400' : 'bg-slate-900 border-slate-800 text-amber-400'}`}>
          {safeContext.planMode === 'vvi_30_days' ? <Flame className="w-5 h-5" /> : <Award className="w-5 h-5" />}
          <span className="text-white font-bold">{safeContext.planMode === 'vvi_30_days' ? 'High-Yield Mode Active' : '100% Syllabus Covered'}</span>
        </div>
      </MotionDiv>

      <div className="space-y-12">
        {roadmapData.map((module, mIdx) => (
          <MotionDiv key={module.id || mIdx} delay={mIdx * 100} className="relative">
            <div className="absolute left-8 md:left-10 top-16 bottom-0 w-0.5 bg-slate-800"></div>

            <div className="flex items-center mb-6 relative z-10">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-900 border border-slate-700 rounded-2xl flex flex-col items-center justify-center shadow-lg shadow-black/50 shrink-0">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider text-center">{String(module.week).split(' ')[0]}</span>
                <span className="text-xl md:text-2xl font-black text-white text-center px-1">{String(module.week).split(' ').slice(1).join(' ') || module.week}</span>
              </div>
              <div className="ml-6">
                <h2 className="text-2xl font-bold text-white">{String(module.title)}</h2>
                <div className="flex flex-wrap space-x-4 mt-1 gap-y-2">
                  <span className="text-sm text-slate-500 flex items-center"><Clock className="w-3 h-3 mr-1" /> {(module.tasks || []).length} Modules</span>
                  {module.dateRange && (
                    <span className="text-sm text-indigo-400 flex items-center font-medium"><Calendar className="w-3 h-3 mr-1" /> {String(module.dateRange)}</span>
                  )}
                  {module.weight && safeContext.planMode === 'vvi_30_days' && (
                    <span className="text-sm text-red-400 flex items-center font-bold px-3 py-1 bg-red-500/10 rounded-lg border border-red-500/20">
                      <Target className="w-3 h-3 mr-1" /> Weightage: {module.weight}% | Your Test Score: {module.diagnosticScore !== undefined ? module.diagnosticScore : 'N/A'}%
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4 pl-20 md:pl-28">
              {(module.tasks || []).map((task, tIdx) => {
                const isDone = userData.completedTasks.includes(task.id);
                return (
                  <MotionDiv key={task.id || tIdx} delay={mIdx * 100 + tIdx * 50} animation="fade-left">
                    <div 
                      className={`group bg-slate-900 border ${isDone ? 'border-emerald-500/50' : task.border} rounded-2xl p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between transition-colors relative overflow-hidden`}
                    >
                      <div className={`absolute left-0 top-0 bottom-0 w-1 ${isDone ? 'bg-emerald-500' : task.bg} transition-all duration-300 group-hover:w-full opacity-10`}></div>
                      
                      <div className="flex items-center relative z-10 mb-4 md:mb-0">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isDone ? 'bg-emerald-500/20 text-emerald-400' : `${task.bg} ${task.color}`} mr-4 shrink-0`}>
                          {isDone ? <CheckCircle className="w-6 h-6" /> : getIcon(task.iconType)}
                        </div>
                        <div>
                          <h3 className={`text-lg font-bold flex items-center flex-wrap ${isDone ? 'text-slate-400 line-through' : 'text-white'}`}>
                            {String(task.title)}
                          </h3>
                          <div className="flex items-center space-x-4 mt-1">
                            <span className="text-sm text-slate-400 flex items-center">
                              <Clock className="w-3 h-3 mr-1" /> {String(task.duration)}
                            </span>
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${isDone ? 'bg-emerald-500/10 text-emerald-400' : `${task.bg} ${task.color}`}`}>
                              {String(task.xp)}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto mt-4 md:mt-0">
                        {task.type === 'video' || task.isComingSoon ? (
                          <button disabled className="px-5 py-2.5 rounded-lg text-sm font-bold bg-slate-800/50 text-slate-500 cursor-not-allowed flex items-center justify-center relative z-10 border border-slate-700 border-dashed">
                            <Video className="w-4 h-4 mr-2 opacity-50" /> Lecture Video Updating (Coming Soon)
                          </button>
                        ) : task.url ? (
                          <a href={task.url} target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 rounded-lg text-sm font-bold bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600 hover:text-white transition-all flex items-center justify-center relative z-10">
                            <ExternalLink className="w-4 h-4 mr-2" /> Open Link
                          </a>
                        ) : null}
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleMarkClick(task, module.title); }}
                          disabled={isDone}
                          className={`relative z-10 w-full md:w-auto px-5 py-2.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${isDone ? 'bg-emerald-500/20 text-emerald-400 cursor-not-allowed' : 'bg-slate-800 text-slate-300 hover:bg-emerald-500 hover:text-white border border-transparent'}`}
                        >
                          {isDone ? 'Completed' : 'Mark Done'}
                        </button>
                      </div>
                    </div>
                  </MotionDiv>
                );
              })}
            </div>
          </MotionDiv>
        ))}
      </div>

      {lockedTaskReq && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <MotionDiv animation="fade-in" className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-md p-6 relative">
            <button onClick={() => setLockedTaskReq(null)} className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
            <div className="w-16 h-16 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(239,68,68,0.3)] mx-auto">
              <Lock className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white text-center mb-2">Completion Locked</h3>
            <p className="text-slate-400 text-center mb-6">
              To mark <span className="text-white font-bold">"{lockedTaskReq.taskTitle}"</span> as done, you must first take the topic test for <span className="text-indigo-400 font-bold">"{lockedTaskReq.moduleTitle}"</span> and score a minimum of <span className="text-emerald-400 font-bold">80% marks</span>. (Or it will auto-complete once passed!)
            </p>
            <div className="flex gap-4">
              <button onClick={() => setLockedTaskReq(null)} className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-colors">
                Cancel
              </button>
              <button onClick={() => { setLockedTaskReq(null); navigate('test-hub'); }} className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-colors shadow-lg shadow-indigo-500/25">
                Go to Tests
              </button>
            </div>
          </MotionDiv>
        </div>
      )}
    </div>
  );
};

const TestHubScreen = ({ navigate, userData }) => {
  const exams = Object.keys(SYLLABUS_DATA);
  const initialExam = userData?.targetExam && exams.includes(userData.targetExam) ? userData.targetExam : exams[0];
  const initialSub = userData?.targetSub && SYLLABUS_DATA[initialExam]?.[userData.targetSub] ? userData.targetSub : Object.keys(SYLLABUS_DATA[initialExam])[0];

  const [selectedExam, setSelectedExam] = useState(initialExam);
  const [selectedSub, setSelectedSub] = useState(initialSub);
  const [activeTab, setActiveTab] = useState('sectional'); 
  const [isFetchingTest, setIsFetchingTest] = useState(false);
  const [fetchingDetails, setFetchingDetails] = useState(null);

  const isQualifying = String(selectedExam).includes('Qualifying');
  const fullMocksCount = isQualifying ? 10 : 20;

  const startTest = (type, topicIndex, sessionIndex = 1) => {
    setFetchingDetails({ type, topicIndex, sessionIndex });
    setIsFetchingTest(true);
  };

  const handleFetchComplete = (generatedQuestions) => {
    setIsFetchingTest(false);
    navigate('active-test', { 
      exam: selectedExam, 
      sub: selectedSub, 
      testType: fetchingDetails.type, 
      topicIndex: fetchingDetails.topicIndex,
      sessionIndex: fetchingDetails.sessionIndex,
      questions: generatedQuestions
    });
  };

  if (isFetchingTest) {
    return <ServerConnectionLoader 
      exam={selectedExam} 
      sub={selectedSub} 
      testType={fetchingDetails.type}
      topicIndex={fetchingDetails.topicIndex}
      sessionIndex={fetchingDetails.sessionIndex}
      onComplete={handleFetchComplete} 
    />;
  }

  const renderTopicGrid = () => {
    const topics = SYLLABUS_DATA[selectedExam]?.[selectedSub] || [];
    
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {topics.map((topicItem, topicIdx) => (
          <MotionDiv key={topicIdx} delay={topicIdx * 50} animation="pop">
            <div className="w-full bg-slate-950 border border-slate-700 rounded-2xl p-6 flex flex-col items-start text-left transition-all hover:bg-slate-900 shadow-lg relative overflow-hidden group">
              <div className="absolute top-4 right-4 flex space-x-1">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-indigo-500/20 text-indigo-400 mb-4 flex items-center justify-center transform group-hover:scale-110 transition-transform relative">
                {String(selectedSub).includes('Mains') ? <Edit3 className="w-6 h-6" /> : <BookOpen className="w-6 h-6" />}
              </div>
              <span className="text-white font-bold text-lg mb-2 line-clamp-2">{String(topicItem.section)}</span>
              <span className="text-slate-500 text-xs font-medium mb-4">6 Test Sessions Available</span>

              <div className="grid grid-cols-3 gap-2 w-full mt-auto">
                {[1, 2, 3, 4, 5, 6].map(sessionNum => (
                  <button 
                    key={sessionNum}
                    onClick={(e) => { e.stopPropagation(); startTest('Topic-Wise', topicIdx, sessionNum); }}
                    className="py-1.5 text-xs font-bold rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:bg-indigo-600 hover:border-indigo-500 hover:text-white transition-all flex items-center justify-center"
                  >
                    Test {sessionNum}
                  </button>
                ))}
              </div>
            </div>
          </MotionDiv>
        ))}
      </div>
    );
  };

  const renderFullGrid = () => {
    const meta = getTestMetadata(selectedExam, selectedSub);
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {Array.from({ length: fullMocksCount }).map((_, i) => (
          <MotionDiv key={i} delay={i * 30} animation="pop">
            <button 
              onClick={() => startTest('Full Syllabus', null, i + 1)} 
              className="w-full bg-slate-950 border border-slate-700 hover:border-emerald-500 rounded-xl p-4 flex flex-col items-center justify-center text-center transition-all hover:bg-slate-900 group shadow-lg relative overflow-hidden"
            >
              <div className="absolute top-2 right-2 flex space-x-1">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
              </div>
              <div className="w-10 h-10 rounded-full mb-3 flex items-center justify-center bg-emerald-500/20 text-emerald-400 transform group-hover:scale-110 transition-transform relative">
                {String(selectedSub).includes('Mains') ? <PenTool className="w-5 h-5" /> : <Target className="w-5 h-5" />}
              </div>
              <span className="text-white font-bold text-sm mb-1">Mock Test {i + 1}</span>
              <span className="text-slate-500 text-xs">{meta.qs} Qs | {meta.mins} Mins</span>
            </button>
          </MotionDiv>
        ))}
      </div>
    );
  };

  const currentMeta = getTestMetadata(selectedExam, selectedSub);

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <MotionDiv className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <button onClick={() => navigate('dashboard')} className="text-slate-400 hover:text-white flex items-center transition-colors mb-4 text-sm">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
          </button>
          <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400 flex items-center">
            <ClipboardList className="w-8 h-8 mr-3 text-indigo-400" /> Mock Test Center
          </h1>
          <p className="text-slate-400 mt-2 text-lg">Live generated CBT Exams connected to main server.</p>
        </div>
      </MotionDiv>

      <MotionDiv delay={100} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Select Examination</label>
            <select 
              value={selectedExam}
              onChange={(e) => {
                setSelectedExam(e.target.value);
                setSelectedSub(Object.keys(SYLLABUS_DATA[e.target.value])[0]);
              }}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all appearance-none"
            >
              {exams.map(ex => <option key={ex} value={ex}>{String(ex)}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Select Branch / Stage</label>
            <select 
              value={selectedSub}
              onChange={(e) => setSelectedSub(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all appearance-none"
            >
              {Object.keys(SYLLABUS_DATA[selectedExam]).map(sub => <option key={sub} value={sub}>{String(sub)}</option>)}
            </select>
          </div>
        </div>

        <div className="mb-6 flex space-x-4 border-b border-slate-800">
          <button 
            onClick={() => setActiveTab('sectional')}
            className={`py-3 px-6 font-bold text-sm border-b-2 transition-all flex items-center ${activeTab === 'sectional' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
          >
            <Wifi className="w-4 h-4 mr-2" /> Topic-Wise Tests
          </button>
          <button 
            onClick={() => setActiveTab('full')}
            className={`py-3 px-6 font-bold text-sm border-b-2 transition-all flex items-center ${activeTab === 'full' ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
          >
            <Wifi className="w-4 h-4 mr-2" /> {fullMocksCount} Full Syllabus Mocks
          </button>
        </div>

        <div className="bg-slate-950/50 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">
              {activeTab === 'sectional' ? 'Master Every Topic Individually (6 Sessions per topic)' : `Real Exam Simulation (${currentMeta.mins} Mins)`}
            </h3>
            <span className="px-3 py-1 bg-slate-800 text-emerald-400 text-xs font-bold rounded-full flex items-center">
              <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-ping"></span> Live Server Active
            </span>
          </div>
          {activeTab === 'sectional' ? renderTopicGrid() : renderFullGrid()}
        </div>
      </MotionDiv>
    </div>
  );
};

const ActiveTestScreen = ({ navigate, context, onTestComplete }) => {
  const safeContext = context || { exam: 'GATE', sub: 'Computer Science (CS)', testType: 'Full Syllabus', topicIndex: 0, sessionIndex: 1, questions: null };
  const [questions] = useState(safeContext.questions || (() => generateQuestions(safeContext.exam, safeContext.sub, safeContext.testType, safeContext.topicIndex, safeContext.sessionIndex)));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [reviewMarked, setReviewMarked] = useState({});
  
  const testMeta = getTestMetadata(safeContext.exam, safeContext.sub);
  const initialTime = safeContext.testType === 'Full Syllabus' ? testMeta.mins * 60 : (testMeta.mins / 2) * 60;
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          submitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleOptionSelect = (qIdx, value) => setAnswers({ ...answers, [qIdx]: value });
  
  const handleMarkReview = () => {
    setReviewMarked({ ...reviewMarked, [currentIndex]: !reviewMarked[currentIndex] });
    if (currentIndex < (questions.length - 1)) setCurrentIndex(currentIndex + 1);
  };

  const handleSaveNext = () => {
    if (currentIndex < (questions.length - 1)) setCurrentIndex(currentIndex + 1);
  };

  const handleClear = () => {
    const newAnswers = { ...answers };
    delete newAnswers[currentIndex];
    setAnswers(newAnswers);
  };

  const submitTest = () => {
    let score = 0;
    let totalMaxScore = 0;
    let subjectiveCount = 0;
    let correctCount = 0;
    let incorrectCount = 0;

    questions.forEach((q, i) => {
      totalMaxScore += q.marks;
      
      if (q.type === 'mcq') {
        if (answers[i] === q.correctAnswer) {
          score += q.marks;
          correctCount++;
        }
        else if (answers[i] !== undefined && answers[i] !== '') {
          score -= q.negativeMarks;
          incorrectCount++;
        }
      } else if (q.type === 'nat') {
        if (answers[i] && String(answers[i]) === String(q.correctAnswer)) {
          score += q.marks;
          correctCount++;
        } else if (answers[i] !== undefined && answers[i] !== '') {
          incorrectCount++;
        }
      } else if (q.type === 'theory') {
        if (answers[i] && String(answers[i]).length > 20) {
          score += q.marks;
          subjectiveCount++;
          correctCount++;
        } else if (answers[i] !== undefined && answers[i] !== '') {
          incorrectCount++;
        }
      }
    });

    const testNameDisplay = safeContext.testType === 'Topic-Wise' 
      ? String(SYLLABUS_DATA[safeContext.exam]?.[safeContext.sub]?.[safeContext.topicIndex]?.section || 'Topic Test') + " - Session " + safeContext.sessionIndex
      : safeContext.testType === 'Diagnostic' ? '30-Day VVI Diagnostic Assessment' : `${safeContext.testType} Test ${safeContext.sessionIndex || 1}`;

    const resultData = { 
      id: Date.now().toString(),
      date: new Date().toLocaleDateString(),
      score: Math.max(0, score).toFixed(2), 
      totalAttempted: Object.keys(answers).length, 
      correctCount,
      incorrectCount,
      unattemptedCount: questions.length - Object.keys(answers).length,
      exam: safeContext.exam, 
      sub: safeContext.sub, 
      maxScore: totalMaxScore,
      testName: testNameDisplay,
      subjectiveEvaluated: subjectiveCount > 0,
      questions: questions,
      answers: answers,
      isDiagnostic: safeContext.isDiagnostic,
      diagnosticSetupContext: safeContext.diagnosticSetupContext
    };

    if (onTestComplete && !safeContext.isDiagnostic) {
      onTestComplete(resultData);
    }
    navigate('test-result', resultData);
  };

  const q = questions[currentIndex] || {};
  
  const testNameDisplay = safeContext.testType === 'Topic-Wise' 
      ? String(SYLLABUS_DATA[safeContext.exam]?.[safeContext.sub]?.[safeContext.topicIndex]?.section || 'Topic Test') + " - Session " + safeContext.sessionIndex
      : safeContext.testType === 'Diagnostic' ? '30-Day VVI Diagnostic Assessment' : `${safeContext.testType} Test ${safeContext.sessionIndex || 1}`;

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col fixed inset-0 z-50">
      <div className="bg-slate-900 border-b border-slate-800 h-16 px-6 flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center">
            <Globe className="w-5 h-5 mr-2 text-indigo-400" /> {String(safeContext.exam)} - {String(safeContext.sub)}
          </h1>
          <p className="text-xs text-indigo-400 font-bold">{String(testNameDisplay)} (Live Sync)</p>
        </div>
        <div className="flex items-center gap-6">
          <div className={`font-mono text-xl font-bold flex items-center ${timeLeft < 600 ? 'text-red-500 animate-pulse' : 'text-emerald-400'}`}>
            <Timer className="w-5 h-5 mr-2" /> {formatTime(timeLeft)}
          </div>
          <button onClick={submitTest} className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg transition-colors">Submit Test</button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <MotionDiv keyProp={currentIndex} animation="fade-left" className="flex-1 flex flex-col border-r border-slate-800 p-8 overflow-y-auto">
          <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
            <div className="flex items-center flex-wrap gap-3">
              <span className="text-xl font-bold text-indigo-400 mr-2">Question {currentIndex + 1}</span>
              <span className="px-3 py-1 bg-slate-800 rounded-md text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center">
                {q.type === 'theory' ? <Edit3 className="w-3 h-3 mr-1" /> : ''}
                {q.type === 'theory' ? 'Subjective / Theory' : (q.type === 'nat' ? 'Numerical Answer' : 'Multiple Choice')}
              </span>
            </div>
            <span className="text-slate-500 text-sm font-medium bg-slate-800/50 px-3 py-1 rounded-lg">
              Marks: <span className="text-emerald-400">+{q.marks}</span>, Negative: <span className="text-red-400">-{Number(q.negativeMarks || 0).toFixed(2)}</span>
            </span>
          </div>

          <div className="mb-8 text-xl leading-relaxed whitespace-pre-wrap">
            <span className="text-white">
              <CleanTextFormatter text={q.text || ''} />
            </span>
            {q.year && (
              <span className="inline-block ml-3 px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-black rounded-md shadow-sm align-middle tracking-widest">
                [{q.year}]
              </span>
            )}
          </div>

          {q.type === 'mcq' && (
            <div className="space-y-4">
              {(q.options || []).map((opt, oIdx) => (
                <MotionDiv key={oIdx} delay={oIdx * 50} animation="fade-up">
                  <div 
                    onClick={() => handleOptionSelect(currentIndex, oIdx)}
                    className={`w-full text-left px-6 py-4 rounded-xl border cursor-pointer transition-all flex items-center transform hover:scale-[1.01] ${
                      answers[currentIndex] === oIdx 
                      ? 'border-indigo-500 bg-indigo-500/20 text-white shadow-[0_0_15px_rgba(99,102,241,0.2)]' 
                      : 'border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full border mr-4 flex items-center justify-center shrink-0 ${answers[currentIndex] === oIdx ? 'border-indigo-500 bg-indigo-500' : 'border-slate-500'}`}>
                      {answers[currentIndex] === oIdx && <div className="w-2 h-2 bg-white rounded-full"></div>}
                    </div>
                    <span className="text-lg"><CleanTextFormatter text={opt} /></span>
                  </div>
                </MotionDiv>
              ))}
            </div>
          )}

          {q.type === 'theory' && (
            <div className="flex-1 flex flex-col">
              <textarea 
                value={answers[currentIndex] || ''}
                onChange={(e) => handleOptionSelect(currentIndex, e.target.value)}
                placeholder="Type your descriptive answer here... (Mains Subjective Pattern)"
                className="w-full flex-1 bg-slate-900 border border-slate-700 rounded-xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none min-h-[300px] transition-all"
              />
            </div>
          )}

          {q.type === 'nat' && (
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
              <label className="block text-slate-400 mb-4 font-medium">Enter your answer below (Numbers only):</label>
              <input 
                type="number"
                step="0.01"
                value={answers[currentIndex] || ''}
                onChange={(e) => handleOptionSelect(currentIndex, e.target.value)}
                placeholder="e.g. 14.50"
                className="w-full md:w-1/2 bg-slate-950 border border-slate-700 rounded-xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xl font-mono shadow-inner transition-all"
              />
            </div>
          )}

          <div className="mt-auto pt-8 flex gap-4">
            <button onClick={handleClear} className="px-6 py-3 bg-slate-800 text-white font-medium rounded-xl hover:bg-slate-700 transition-colors">Clear Response</button>
            <button onClick={handleMarkReview} className="px-6 py-3 bg-amber-500/10 text-amber-400 border border-amber-500/50 font-medium rounded-xl hover:bg-amber-500/20 transition-colors">Mark for Review & Next</button>
            <button onClick={handleSaveNext} className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-500 ml-auto shadow-lg shadow-indigo-500/25 transition-all transform hover:scale-105">Save & Next</button>
          </div>
        </MotionDiv>

        <div className="w-80 bg-slate-900 p-4 flex flex-col shrink-0 border-l border-slate-800">
          <h3 className="text-white font-bold mb-4">Question Palette</h3>
          <div className="grid grid-cols-5 gap-2 overflow-y-auto pr-2 pb-4">
            {questions.map((_, i) => {
              let statusClass = "bg-slate-800 border-slate-700 text-slate-400";
              if (answers[i] !== undefined && answers[i] !== '') statusClass = "bg-emerald-500 border-emerald-400 text-white";
              if (reviewMarked[i]) statusClass = "bg-amber-500 border-amber-400 text-white";
              if (reviewMarked[i] && answers[i] !== undefined && answers[i] !== '') statusClass = "bg-purple-500 border-purple-400 text-white";
              
              return (
                <MotionDiv key={i} delay={i * 10} animation="pop">
                  <button 
                    onClick={() => setCurrentIndex(i)}
                    className={`w-full aspect-square rounded-lg border font-bold text-sm flex items-center justify-center transition-all ${statusClass} ${currentIndex === i ? 'ring-2 ring-white scale-110 z-10 shadow-lg' : 'hover:opacity-80'}`}
                  >
                    {i + 1}
                  </button>
                </MotionDiv>
              );
            })}
          </div>

          <div className="mt-auto border-t border-slate-800 pt-4 space-y-3 text-sm text-slate-300">
            <div className="flex items-center"><div className="w-4 h-4 bg-emerald-500 rounded mr-3 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div> Answered</div>
            <div className="flex items-center"><div className="w-4 h-4 bg-slate-800 border border-slate-600 rounded mr-3"></div> Not Answered</div>
            <div className="flex items-center"><div className="w-4 h-4 bg-amber-500 rounded mr-3 shadow-[0_0_8px_rgba(245,158,11,0.5)]"></div> Marked for Review</div>
            <div className="flex items-center"><div className="w-4 h-4 bg-purple-500 rounded mr-3 shadow-[0_0_8px_rgba(168,85,247,0.5)]"></div> Answered & Marked</div>
          </div>
        </div>
      </div>
    </div>
  );
};
 const fetchAiForExplanation = async (q, correctAnsText, fallbackExp) => {
  // Aapki Gemini API Key (Screenshot wali)
  const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
  
  // Naya Stable Model
  const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
  
  const isTheory = q.type === 'theory';
  const isHindi = /[\u0900-\u097F]/.test(q.text) || String(q.text).toLowerCase().includes('hindi');
  
  const langInstruction = isHindi 
    ? "Answer strictly in Hindi." 
    : "Answer strictly in English.";

  const prompt = `Explain why the answer is correct. 
  Question: "${q.text}"
  Correct Answer: "${correctAnsText}"
  ${langInstruction}`;

  const payload = {
    contents: [{ parts: [{ text: prompt }] }]
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      return `🔴 GOOGLE GEMINI ERROR: ${errorData.error?.message || response.statusText} (Status: ${response.status})`; 
    }
    
    const data = await response.json();
    console.log(data)
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "No text generated.";
    
  } catch (err) {
    console.log(err)
    return `🔴 NETWORK ERROR: ${err.message}`;
  }
};

const LiveAIExplanation = ({ q, correctAnsText, fallbackExp }) => {
  const [aiText, setAiText] = useState("");
  const [status, setStatus] = useState("idle"); 

  const handleFetchAi = async () => {
    setStatus("loading");
    // Button click hone par direct call hogi
    const text = await fetchAiForExplanation(q, correctAnsText, fallbackExp);
    setAiText(text);
    setStatus("done");
  };

  return (
    <div className="bg-indigo-500/5 border border-indigo-500/20 p-5 rounded-xl mt-4">
      {/* Standard Explanation Wala Hissa */}
      <div className="mb-4">
        <p className="text-sm font-bold text-slate-400 mb-2">Standard Explanation:</p>
        <div className="text-base text-slate-200 leading-relaxed whitespace-pre-wrap antialiased">
          <CleanTextFormatter text={fallbackExp || "Detailed explanation not available."} />
        </div>
      </div>
      
      {/* Live AI Explanation Wala Hissa */}
      <div className="pt-4 border-t border-indigo-500/20">
        <p className="text-sm font-bold text-indigo-400 mb-3 flex items-center">
          <Zap className="w-4 h-4 mr-2 text-amber-400" /> Live AI Explanation (Internet Active)
        </p>
        
        {status === "idle" && (
          <button 
            onClick={handleFetchAi}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-sm text-white font-medium transition-colors"
          >
            Generate AI Insight
          </button>
        )}

        {status === "loading" && (
          <div className="animate-pulse space-y-3">
             <div className="h-3 bg-indigo-500/20 rounded w-3/4"></div>
             <div className="h-3 bg-indigo-500/20 rounded w-full"></div>
             <div className="h-3 bg-indigo-500/20 rounded w-5/6"></div>
          </div>
        )}

        {status === "done" && (
          <div className="text-base text-white leading-relaxed whitespace-pre-wrap font-sans antialiased tracking-wide">
             <CleanTextFormatter text={aiText} />
          </div>
        )}
      </div>
    </div>
  );
}; 

const TestResultScreen = ({ navigate, context, onRoadmapGenerate, userData }) => {
  const safeContext = context || { exam: '', sub: '', score: '0.00', totalAttempted: 0, maxScore: 100, testName: 'Test', subjectiveEvaluated: false, questions: [], answers: {}, correctCount: 0, incorrectCount: 0, unattemptedCount: 100, isDiagnostic: false };
  const [activeTab, setActiveTab] = useState('overview');

  const topicAnalytics = React.useMemo(() => {
    const analytics = {};
    (safeContext.questions || []).forEach((q, idx) => {
      const t = q.topic || 'General Concepts';
      if (!analytics[t]) {
        analytics[t] = { totalQs: 0, correctQs: 0, maxMarks: 0, obtainedMarks: 0 };
      }
      analytics[t].totalQs += 1;
      analytics[t].maxMarks += q.marks;

      const userAns = safeContext.answers[idx];
      const isAttempted = userAns !== undefined && userAns !== '';
      let isCorrect = false;

      if (q.type === 'mcq') isCorrect = userAns === q.correctAnswer;
      else if (q.type === 'nat') isCorrect = userAns && String(userAns) === String(q.correctAnswer);
      else if (q.type === 'theory') isCorrect = userAns && String(userAns).length > 20;

      if (isCorrect) {
        analytics[t].correctQs += 1;
        analytics[t].obtainedMarks += q.marks;
      } else if (isAttempted) {
         analytics[t].obtainedMarks -= (q.negativeMarks || 0);
      }
    });

    return Object.keys(analytics).map(topic => {
      const data = analytics[topic];
      
      // Calculate perfectly bounded real percentage [0 to 100]
      const rawPercentage = data.maxMarks > 0 ? (data.obtainedMarks / data.maxMarks) * 100 : 0;
      const percentage = Math.max(0, Math.min(100, Math.round(rawPercentage)));
      
      let strength = 'Weak';
      let color = 'text-red-400';
      let barColor = 'bg-red-500';
      
      if (percentage >= 75) { 
        strength = 'Strong'; 
        color = 'text-emerald-400'; 
        barColor = 'bg-emerald-500'; 
      }
      else if (percentage >= 50) { 
        strength = 'Average'; 
        color = 'text-amber-400'; 
        barColor = 'bg-amber-500'; 
      }

      return { topic, ...data, percentage, strength, color, barColor };
    }).sort((a, b) => b.percentage - a.percentage);
  }, [safeContext.questions, safeContext.answers]);

  const handleGenerateVVI = () => {
    const diagnosticDataMap = {};
    topicAnalytics.forEach(t => diagnosticDataMap[t.topic] = t.percentage);
    
    const dContext = safeContext.diagnosticSetupContext;
    const roadmap = getRoadmapForExam(dContext.exam, dContext.sub, dContext.hours, dContext.startDate, dContext.examDate, dContext.planMode, diagnosticDataMap);
    
    const newRoadmapData = {
      exam: dContext.exam, 
      sub: dContext.sub, 
      hours: dContext.hours, 
      totalDays: 30, 
      startDate: dContext.startDate, 
      examDate: dContext.examDate, 
      planMode: dContext.planMode,
      roadmapData: roadmap 
    };
    
    onRoadmapGenerate(newRoadmapData);
    navigate('roadmap', newRoadmapData);
  };

  return (
    <div className="max-w-5xl mx-auto py-10">
      <MotionDiv animation="fade-in" className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        
        <div className="flex border-b border-slate-800 mb-8">
          <button onClick={() => setActiveTab('overview')} className={`pb-4 px-6 font-bold text-lg transition-colors border-b-2 ${activeTab === 'overview' ? 'text-indigo-400 border-indigo-500' : 'text-slate-500 border-transparent hover:text-white'}`}>Overview</button>
          <button onClick={() => setActiveTab('analysis')} className={`pb-4 px-6 font-bold text-lg transition-colors border-b-2 ${activeTab === 'analysis' ? 'text-emerald-400 border-emerald-500' : 'text-slate-500 border-transparent hover:text-white'}`}>Detailed Analysis</button>
        </div>

        {activeTab === 'overview' && (
          <div className="text-center">
            <div className={`w-24 h-24 ${safeContext.isDiagnostic ? 'bg-red-500/20 text-red-500 shadow-[0_0_30px_rgba(239,68,68,0.3)]' : 'bg-emerald-500/20 text-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.3)]'} rounded-full flex items-center justify-center mx-auto mb-6`}>
              {safeContext.isDiagnostic ? <Brain className="w-12 h-12" /> : <Award className="w-12 h-12" />}
            </div>
            <h1 className="text-4xl font-extrabold text-white mb-2">{safeContext.isDiagnostic ? 'Diagnostic Evaluation Complete' : 'Test Completed!'}</h1>
            <p className="text-slate-400 mb-8">{String(safeContext.exam)} - {String(safeContext.sub)} <br/> <span className="font-bold text-indigo-300">{String(safeContext.testName)}</span></p>

            {safeContext.subjectiveEvaluated && (
              <div className="mb-6 p-4 bg-indigo-500/10 border border-indigo-500/30 rounded-xl text-indigo-300 text-sm font-medium flex items-center justify-center">
                <Edit3 className="w-5 h-5 mr-2" /> Note: This test contained Descriptive/Mains questions. They have been temporarily auto-evaluated based on length for mock scoring purposes.
              </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto mb-10">
              <MotionDiv delay={100} animation="pop" className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-inner transform hover:scale-105 transition-transform">
                <p className="text-slate-400 text-sm mb-1">Final Score</p>
                <p className="text-3xl font-black text-indigo-400">{String(safeContext.score)} <span className="text-lg text-slate-500">/ {String(safeContext.maxScore)}</span></p>
              </MotionDiv>
              <MotionDiv delay={200} animation="pop" className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-inner transform hover:scale-105 transition-transform">
                <p className="text-slate-400 text-sm mb-1">{safeContext.subjectiveEvaluated ? 'Evaluated' : 'Correct'}</p>
                <p className="text-3xl font-black text-emerald-400">{String(safeContext.correctCount)}</p>
              </MotionDiv>
              <MotionDiv delay={300} animation="pop" className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-inner transform hover:scale-105 transition-transform">
                <p className="text-slate-400 text-sm mb-1">Incorrect</p>
                <p className="text-3xl font-black text-red-400">{String(safeContext.incorrectCount)}</p>
              </MotionDiv>
              <MotionDiv delay={400} animation="pop" className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-inner transform hover:scale-105 transition-transform">
                <p className="text-slate-400 text-sm mb-1">Unattempted</p>
                <p className="text-3xl font-black text-slate-400">{String(safeContext.unattemptedCount)}</p>
              </MotionDiv>
            </div>

            {/* NEW: DYNAMIC PERFORMANCE GRAPHS AFTER TEST */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-10">
              {/* Accuracy Distribution Pie Chart */}
              <MotionDiv delay={420} animation="fade-up" className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-inner relative overflow-hidden h-full flex flex-col">
                <h3 className="text-xl font-bold text-white mb-2 flex items-center relative z-10">
                  <Target className="w-5 h-5 mr-2 text-amber-400" /> Accuracy Distribution
                </h3>
                <p className="text-sm text-slate-400 mb-4 relative z-10">Your attempt ratio for this specific test.</p>
                <div className="flex-1 min-h-[250px] relative z-10">
                  <TestPerformancePieChart 
                    correct={safeContext.correctCount} 
                    incorrect={safeContext.incorrectCount} 
                    unattempted={safeContext.unattemptedCount} 
                  />
                </div>
              </MotionDiv>

              {/* Live Performance Trend */}
              {userData?.testHistory?.length > 1 && !safeContext.isDiagnostic ? (
                <MotionDiv delay={450} animation="fade-up" className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-inner relative overflow-hidden h-full flex flex-col">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
                  <h3 className="text-xl font-bold text-white mb-2 flex items-center relative z-10">
                    <TrendingUp className="w-5 h-5 mr-2 text-emerald-400" /> Live Performance Trend
                  </h3>
                  <p className="text-sm text-slate-400 mb-6 relative z-10">See how this test impacts your trajectory.</p>
                  <div className="relative z-10 flex-1 min-h-[250px]">
                    <PerformanceTrendChart testHistory={userData.testHistory} />
                  </div>
                </MotionDiv>
              ) : (
                <MotionDiv delay={450} animation="fade-up" className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-inner flex flex-col items-center justify-center text-center h-full min-h-[250px]">
                  <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mb-4">
                    <TrendingUp className="w-8 h-8 text-slate-700" />
                  </div>
                  <h4 className="text-slate-300 font-bold mb-2">Trend Locked</h4>
                  <p className="text-slate-500 text-sm">Take more mock tests to unlock your live trajectory graph.</p>
                </MotionDiv>
              )}
            </div>

            <MotionDiv delay={500} animation="fade-up">
              <div className="mt-8 mb-10 text-left bg-slate-950 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-inner max-w-4xl mx-auto">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                  <Activity className="w-5 h-5 mr-2 text-indigo-400" /> Topic Mastery & Insights
                </h3>
                <div className="space-y-6">
                  {topicAnalytics.map((item, idx) => (
                    <div key={idx} className="relative">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-white font-bold text-sm md:text-base">{item.topic}</span>
                        <div className="flex items-center space-x-3">
                          <span className={`text-xs font-bold px-3 py-1 rounded-md bg-slate-900 border border-slate-700 ${item.color}`}>
                            {item.strength}
                          </span>
                          <span className={`font-black ${item.color} w-12 text-right`}>{item.percentage}%</span>
                        </div>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden flex">
                        <div className={`h-full rounded-full transition-all duration-1000 ${item.barColor}`} style={{ width: `${item.percentage}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </MotionDiv>

            <div className="flex justify-center gap-4 flex-col sm:flex-row">
              <button onClick={() => setActiveTab('analysis')} className="px-8 py-4 border border-indigo-500 text-indigo-400 font-bold rounded-xl hover:bg-indigo-500/10 transition-colors">
                View Analysis
              </button>
              
              {safeContext.isDiagnostic ? (
                <button onClick={handleGenerateVVI} className="px-8 py-4 bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold rounded-xl hover:from-red-500 hover:to-orange-500 transition-colors shadow-lg shadow-red-500/25 flex items-center justify-center">
                  <Flame className="w-5 h-5 mr-2" /> Analyze & Build 30-Day VVI Plan
                </button>
              ) : (
                <button onClick={() => navigate('dashboard')} className="px-8 py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-500 transition-colors shadow-lg">
                  Return to Dashboard
                </button>
              )}
            </div>
          </div>
        )}

        {activeTab === 'analysis' && (
          <div className="space-y-8 text-left">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-white">Question Breakdown</h2>
              <button onClick={() => navigate('dashboard')} className="text-indigo-400 hover:text-indigo-300 text-sm font-bold flex items-center">
                <ArrowLeft className="w-4 h-4 mr-1" /> Back to Home
              </button>
            </div>
            
            {safeContext.questions && safeContext.questions.length > 0 ? safeContext.questions.map((q, idx) => {
              const userAns = safeContext.answers[idx];
              const isAttempted = userAns !== undefined && userAns !== '';
              let isCorrect = false;
              
              if (q.type === 'mcq') isCorrect = userAns === q.correctAnswer;
              else if (q.type === 'nat') isCorrect = userAns && String(userAns) === String(q.correctAnswer);
              else if (q.type === 'theory') isCorrect = userAns && String(userAns).length > 20;

              return (
                <MotionDiv key={idx} delay={idx * 100} animation="fade-up">
                  <div className={`bg-slate-950 border-l-4 rounded-xl p-6 shadow-lg ${isCorrect ? 'border-emerald-500' : (isAttempted ? 'border-red-500' : 'border-slate-500')}`}>
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-indigo-400 font-bold">Question {idx + 1}</span>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${isCorrect ? 'bg-emerald-500/20 text-emerald-400' : (isAttempted ? 'bg-red-500/20 text-red-400' : 'bg-slate-800 text-slate-400')}`}>
                        {isCorrect ? (q.type === 'theory' ? 'Evaluated' : 'Correct') : (isAttempted ? 'Incorrect' : 'Unattempted')}
                      </span>
                    </div>
                    <div className="mb-4 whitespace-pre-wrap">
                      <span className="text-white">
                        <CleanTextFormatter text={q.text} />
                      </span>
                      {q.year && (
                        <span className="inline-block ml-2 px-2 py-0.5 bg-slate-800 text-slate-400 text-xs font-bold rounded border border-slate-700 tracking-wider align-middle">
                          [{q.year}]
                        </span>
                      )}
                    </div>
                    
                    {q.type === 'mcq' && (
                      <div className="space-y-2 mb-4">
                        {(q.options || []).map((opt, oIdx) => {
                          const isSelected = userAns === oIdx;
                          const isActualCorrect = q.correctAnswer === oIdx;
                          let optClass = "border-slate-800 text-slate-400";
                          
                          if (isActualCorrect) optClass = "border-emerald-500/50 bg-emerald-500/10 text-emerald-400 font-bold";
                          else if (isSelected && !isActualCorrect) optClass = "border-red-500/50 bg-red-500/10 text-red-400";

                          return (
                            <div key={oIdx} className={`p-3 border rounded-lg flex items-center ${optClass}`}>
                              {isActualCorrect && <Check className="w-4 h-4 mr-2 text-emerald-500" />}
                              {isSelected && !isActualCorrect && <X className="w-4 h-4 mr-2 text-red-500" />}
                              {!isSelected && !isActualCorrect && <div className="w-4 h-4 mr-2"></div>}
                              <CleanTextFormatter text={opt} />
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {q.type === 'nat' && (
                      <div className="flex gap-4 mb-4">
                        <div className="bg-slate-900 px-4 py-2 rounded-lg border border-slate-700">
                          <span className="text-sm text-slate-500 block">Your Answer:</span>
                          <span className={`font-mono text-lg ${isCorrect ? 'text-emerald-400' : 'text-red-400'}`}>{isAttempted ? String(userAns) : '---'}</span>
                        </div>
                        <div className="bg-slate-900 px-4 py-2 rounded-lg border border-emerald-500/30">
                          <span className="text-sm text-slate-500 block">Correct Answer:</span>
                          <span className="font-mono text-lg text-emerald-400">{String(q.correctAnswer)}</span>
                        </div>
                      </div>
                    )}

                    {q.type === 'theory' && (
                      <div className="mb-4 space-y-4">
                        <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                          <span className="text-sm text-slate-500 block mb-2">Your Answer:</span>
                          <span className="text-slate-300 whitespace-pre-wrap">{isAttempted ? String(userAns) : 'No answer provided.'}</span>
                        </div>
                      </div>
                    )}

                    <LiveAIExplanation 
                      q={q} 
                      correctAnsText={
                        q.type === 'mcq' ? String(q.options[q.correctAnswer] || '') : 
                        q.type === 'nat' ? String(q.correctAnswer) : 
                        "Detailed descriptive analysis covering key concepts."
                      } 
                      fallbackExp={String(q.explanation || '')} 
                    />
                  </div>
                </MotionDiv>
              );
            }) : (
               <p className="text-slate-400">No question data available for analysis.</p>
            )}
          </div>
        )}
      </MotionDiv>
    </div>
  );
};

const Mascot = ({ mood, className = "w-16 h-16" }) => {
  let eyes, mouth, extra;
  
  switch(mood) {
    case 'excited':
      eyes = (
        <g>
          <path d="M 36 32 L 40 36 L 36 40 M 40 32 L 36 36 L 40 40" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />
          <path d="M 60 32 L 64 36 L 60 40 M 64 32 L 60 36 L 64 40" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />
        </g>
      );
      mouth = <path d="M 42 45 Q 46 42 50 45 T 58 45" stroke="#fbbf24" strokeWidth="2" fill="none" strokeLinecap="round" className="animate-pulse" />;
      break;
    case 'sleepy':
      eyes = (
        <g>
          <line x1="34" y1="36" x2="42" y2="36" stroke="#64748b" strokeWidth="3" strokeLinecap="round" />
          <line x1="58" y1="36" x2="66" y2="36" stroke="#64748b" strokeWidth="3" strokeLinecap="round" />
        </g>
      );
      mouth = <circle cx="50" cy="44" r="1.5" fill="#64748b" />;
      extra = <text x="76" y="20" fill="#94a3b8" fontSize="12" fontWeight="bold" className="animate-pulse">Zzz</text>;
      break;
    case 'angry':
      eyes = (
        <g>
          <line x1="34" y1="32" x2="44" y2="38" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
          <line x1="66" y1="32" x2="56" y2="38" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
          <circle cx="39" cy="39" r="2" fill="#ef4444" />
          <circle cx="61" cy="39" r="2" fill="#ef4444" />
        </g>
      );
      mouth = <path d="M 44 46 L 47 43 L 50 46 L 53 43 L 56 46" stroke="#ef4444" strokeWidth="2" fill="none" strokeLinecap="round" />;
      extra = <path d="M 20 15 L 26 10 L 24 18 Z" fill="#ef4444" className="animate-bounce" />;
      break;
    case 'happy':
    default:
      eyes = (
        <g>
          <path d="M 34 38 Q 38 32 42 38" stroke="#38bdf8" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M 58 38 Q 62 32 66 38" stroke="#38bdf8" strokeWidth="3" fill="none" strokeLinecap="round" />
        </g>
      );
      mouth = <path d="M 44 44 Q 50 48 56 44" stroke="#38bdf8" strokeWidth="2" fill="none" strokeLinecap="round" />;
      break;
  }

  return (
    <svg viewBox="0 0 100 100" className={className}>
      <defs>
        <linearGradient id="robotMetal" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#cbd5e1" />
          <stop offset="100%" stopColor="#64748b" />
        </linearGradient>
        <linearGradient id="robotDarkMetal" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#475569" />
          <stop offset="100%" stopColor="#1e293b" />
        </linearGradient>
        <linearGradient id="screenGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#020617" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
      </defs>

      {/* Floating animation group for the main body */}
      <g className="animate-bounce" style={{ animationDuration: '3s' }}>
        {/* Antenna */}
        <line x1="50" y1="20" x2="50" y2="8" stroke="#94a3b8" strokeWidth="2" />
        <circle cx="50" cy="8" r="3" fill={mood === 'angry' ? '#ef4444' : mood === 'excited' ? '#fbbf24' : '#38bdf8'} className="animate-pulse" />

        {/* Head Frame */}
        <rect x="22" y="20" width="56" height="40" rx="10" fill="url(#robotMetal)" className="drop-shadow-xl" />
        
        {/* Ears / Side Nodes */}
        <rect x="16" y="32" width="6" height="16" rx="2" fill="url(#robotDarkMetal)" />
        <rect x="78" y="32" width="6" height="16" rx="2" fill="url(#robotDarkMetal)" />

        {/* Face Screen */}
        <rect x="28" y="26" width="44" height="28" rx="6" fill="url(#screenGrad)" stroke="#1e293b" strokeWidth="2" />

        {/* Expressions overlay */}
        {eyes}
        {mouth}
        {extra}

        {/* Neck Joint */}
        <rect x="42" y="60" width="16" height="6" fill="url(#robotDarkMetal)" />
        <line x1="42" y1="63" x2="58" y2="63" stroke="#0f172a" strokeWidth="1" opacity="0.5" />

        {/* Torso Chassis */}
        <path d="M 30 66 Q 50 62 70 66 L 65 82 Q 50 86 35 82 Z" fill="url(#robotMetal)" />
        
        {/* Chest Core / Arc Reactor */}
        <circle cx="50" cy="74" r="4" fill={mood === 'angry' ? '#ef4444' : '#38bdf8'} opacity="0.8" className="animate-pulse" style={{animationDuration: '2s'}} />

        {/* Bottom Thruster Engine */}
        <path d="M 42 83 L 58 83 L 54 88 L 46 88 Z" fill="url(#robotDarkMetal)" />

        {/* Propulsion Flame */}
        <path d="M 46 88 Q 50 100 54 88 Q 50 95 46 88" fill={mood === 'angry' ? '#ef4444' : '#fbbf24'} className="animate-pulse" style={{ transformOrigin: '50% 88%', animationDuration: '0.5s' }} />
      </g>

      {/* Floating Hands (Independent rhythmic animations) */}
      <g className="animate-bounce" style={{ animationDuration: '2.5s', animationDelay: '0.2s' }}>
        {/* Left Claw */}
        <path d="M 22 65 C 15 65 10 70 12 78 C 15 74 18 74 22 75 C 20 72 20 68 22 65" fill="url(#robotDarkMetal)" />
        <circle cx="24" cy="65" r="3" fill="url(#robotMetal)" />
      </g>
      <g className="animate-bounce" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }}>
        {/* Right Claw */}
        <path d="M 78 65 C 85 65 90 70 88 78 C 85 74 82 74 78 75 C 80 72 80 68 78 65" fill="url(#robotDarkMetal)" />
        <circle cx="76" cy="65" r="3" fill="url(#robotMetal)" />
      </g>
    </svg>
  );
};

const PerformanceMonitor = ({ userData }) => {
  const [feedback, setFeedback] = useState("");
  const [mood, setMood] = useState("happy");
  const [statusTitle, setStatusTitle] = useState("");

  useEffect(() => {
    const completedTasksCount = userData.completedTasks?.length || 0;
    const testsTakenCount = userData.testHistory?.length || 0;
    let avgScore = 0;
    
    if (testsTakenCount > 0) {
      const totalScore = userData.testHistory.reduce((acc, test) => acc + (Number(test.score) / Number(test.maxScore)), 0);
      avgScore = Math.round((totalScore / testsTakenCount) * 100);
    }

    const userName = userData.name || 'Student';
    let currentMood = "happy";
    let title = "Good Going!";

    // Calculate Mascot's Mood & Title based on performance
    if (completedTasksCount === 0 && testsTakenCount === 0) {
        currentMood = "sleepy";
        title = "Plzzzzzzzzzzzz Wake Up!";
    }
    else if (userData.streak === 0 || (testsTakenCount > 0 && avgScore < 50)) {
        currentMood = "angry";
        title = "Plz Improve Your Practice!";
    }
    else if (userData.streak >= 3 || avgScore >= 80) {
        currentMood = "excited";
        title = "Excellent Work!";
    }
    else {
        currentMood = "happy";
        title = "Good Going!";
    }

    setMood(currentMood);
    setStatusTitle(title);

    const getFeedback = async () => {
      const msg = await fetchPerformanceReview(completedTasksCount, testsTakenCount, avgScore, userData.streak, userName);
      setFeedback(msg);
    };
    getFeedback();
  }, [userData]);

  return (
    <div className="flex flex-col md:flex-row items-center md:items-center relative w-full xl:max-w-md group">
      <div className="shrink-0 mb-4 md:mb-0 md:mr-6 relative">
        <Mascot mood={mood} className="w-24 h-24 transform group-hover:scale-110 transition-transform duration-300 drop-shadow-[0_0_15px_rgba(99,102,241,0.3)]" />
      </div>
      <div className="bg-slate-800/80 backdrop-blur-md border border-slate-700 p-5 rounded-2xl flex-1 relative w-full shadow-xl">
        {/* Chat bubble pointer */}
        <div className="absolute top-1/2 -left-2 w-4 h-4 bg-slate-800/80 border-l border-b border-slate-700 transform -translate-y-1/2 rotate-45 hidden md:block"></div>
        <div className="absolute -top-2 left-1/2 w-4 h-4 bg-slate-800/80 border-t border-l border-slate-700 transform -translate-x-1/2 rotate-45 md:hidden"></div>

        <h4 className="text-indigo-400 font-bold mb-1.5 tracking-wide uppercase text-[10px] flex items-center">
          <Zap className="w-3 h-3 mr-1 text-amber-400" /> Quick Feedback
        </h4>
        {feedback ? (
          <p className="text-slate-200 text-sm leading-relaxed font-medium italic">"{feedback}"</p>
        ) : (
          <div className="animate-pulse space-y-2 mt-2">
            <div className="h-2 bg-slate-700 rounded w-3/4"></div>
            <div className="h-2 bg-slate-700 rounded w-1/2"></div>
          </div>
        )}
      </div>
    </div>
  );
};

const CustomRoadmapPlanner = ({ navigate, userData, setUserData }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDuration, setNewTaskDuration] = useState('1 hr');
  const [plannerTab, setPlannerTab] = useState('daily'); // 'daily' or 'monthly'

  const customTasks = userData.customTasks || [];

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());

  const handlePrevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return;
    const newTask = {
      id: Date.now().toString(),
      type: plannerTab,
      date: plannerTab === 'daily' ? selectedDate.toDateString() : `${currentDate.getFullYear()}-${currentDate.getMonth()}`,
      title: newTaskTitle,
      duration: newTaskDuration,
      completed: false
    };
    setUserData(prev => ({
      ...prev,
      customTasks: [...(prev.customTasks || []), newTask]
    }));
    setNewTaskTitle('');
  };

  const toggleTask = (taskId) => {
    setUserData(prev => ({
      ...prev,
      customTasks: prev.customTasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t)
    }));
  };

  const deleteTask = (taskId) => {
    setUserData(prev => ({
      ...prev,
      customTasks: prev.customTasks.filter(t => t.id !== taskId)
    }));
  };

  const dailyTasks = customTasks.filter(t => (t.type === 'daily' || !t.type) && t.date === selectedDate.toDateString());
  const monthlyTasks = customTasks.filter(t => t.type === 'monthly' && t.date === `${currentDate.getFullYear()}-${currentDate.getMonth()}`);
  const activeTasks = plannerTab === 'daily' ? dailyTasks : monthlyTasks;
  
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const renderCalendar = () => {
    const days = [];
    const todayStr = new Date().toDateString();

    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="p-2 md:p-4 opacity-0 pointer-events-none"></div>);
    }
    
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), d);
      const isSelected = selectedDate.toDateString() === date.toDateString();
      const isToday = todayStr === date.toDateString();
      const dayTasks = customTasks.filter(t => (t.type === 'daily' || !t.type) && t.date === date.toDateString());
      const allCompleted = dayTasks.length > 0 && dayTasks.every(t => t.completed);

      days.push(
        <div
          key={d}
          onClick={() => { setSelectedDate(date); setPlannerTab('daily'); }}
          className={`p-3 md:p-4 rounded-2xl border flex flex-col items-center justify-center cursor-pointer transition-all transform hover:scale-[1.05] min-h-[4rem] ${
            isSelected ? 'bg-amber-600 border-amber-500 text-white shadow-lg shadow-amber-500/25' :
            isToday ? 'bg-amber-500/20 border-amber-500/50 text-amber-300' :
            'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <span className={`text-lg ${isSelected || isToday ? 'font-black' : 'font-medium'}`}>{d}</span>
          <div className="flex space-x-1 mt-1 h-2">
            {dayTasks.length > 0 && (
              <div className={`w-2 h-2 rounded-full ${allCompleted ? 'bg-emerald-400' : 'bg-amber-400'}`}></div>
            )}
          </div>
        </div>
      );
    }
    return days;
  };

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <MotionDiv className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <button onClick={() => navigate('dashboard')} className="text-slate-400 hover:text-white flex items-center transition-colors mb-4 text-sm">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
          </button>
          <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500 flex items-center">
            <Calendar className="w-8 h-8 mr-3 text-amber-400" /> Custom Planner
          </h1>
          <p className="text-slate-400 mt-2 text-lg">Build your personalized study schedule and track progress manually.</p>
        </div>
      </MotionDiv>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calendar Section */}
        <MotionDiv delay={100} className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <div className="flex space-x-3">
              <button onClick={handlePrevMonth} className="p-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors border border-slate-700">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button onClick={handleNextMonth} className="p-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors border border-slate-700">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-7 gap-2 md:gap-4 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-sm font-bold text-slate-500 uppercase tracking-wider">{day}</div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-2 md:gap-4">
            {renderCalendar()}
          </div>
        </MotionDiv>

        {/* Tasks Section */}
        <MotionDiv delay={200} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl flex flex-col h-full">
          <div className="flex border-b border-slate-800 mb-6">
            <button onClick={() => setPlannerTab('daily')} className={`flex-1 pb-3 px-2 font-bold text-sm transition-colors border-b-2 ${plannerTab === 'daily' ? 'text-amber-400 border-amber-500' : 'text-slate-500 border-transparent hover:text-white'}`}>Daily Plan</button>
            <button onClick={() => setPlannerTab('monthly')} className={`flex-1 pb-3 px-2 font-bold text-sm transition-colors border-b-2 ${plannerTab === 'monthly' ? 'text-amber-400 border-amber-500' : 'text-slate-500 border-transparent hover:text-white'}`}>Monthly Goals</button>
          </div>

          <h3 className="text-xl font-bold text-white mb-2 flex items-center">
            <List className="w-5 h-5 mr-2 text-amber-400" /> 
            {plannerTab === 'daily' ? `Tasks for ${selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}` : `${monthNames[currentDate.getMonth()]} Goals`}
          </h3>
          <p className="text-slate-400 text-sm mb-6 border-b border-slate-800 pb-4">
            {plannerTab === 'daily' ? "Organize your study goals for this specific day." : "Set high-level targets to achieve by the end of this month."}
          </p>

          <div className="flex-1 overflow-y-auto mb-6 space-y-3 pr-2">
            {activeTasks.length === 0 ? (
              <div className="text-center text-slate-500 py-8 flex flex-col items-center">
                <Coffee className="w-10 h-10 mb-3 opacity-20" />
                <p>No tasks planned for this {plannerTab === 'daily' ? 'day' : 'month'}.</p>
              </div>
            ) : (
              activeTasks.map((task, idx) => (
                <MotionDiv key={task.id} delay={idx * 50} animation="fade-left">
                  <div className={`p-4 rounded-xl border flex flex-col transition-all ${task.completed ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-slate-950 border-slate-700'}`}>
                    <div className="flex justify-between items-start">
                      <div className="flex items-start flex-1 cursor-pointer" onClick={() => toggleTask(task.id)}>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-3 mt-0.5 shrink-0 transition-colors ${task.completed ? 'bg-emerald-500 border-emerald-500' : 'border-slate-500'}`}>
                          {task.completed && <Check className="w-4 h-4 text-white" />}
                        </div>
                        <div>
                          <h4 className={`font-bold ${task.completed ? 'text-slate-400 line-through' : 'text-white'}`}>{task.title}</h4>
                          <span className="text-xs text-slate-500 flex items-center mt-1"><Clock className="w-3 h-3 mr-1" /> {task.duration}</span>
                        </div>
                      </div>
                      <button onClick={() => deleteTask(task.id)} className="text-slate-500 hover:text-red-400 transition-colors p-1 shrink-0">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </MotionDiv>
              ))
            )}
          </div>

          <div className="mt-auto bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <input 
              type="text" 
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
              placeholder={plannerTab === 'daily' ? "e.g. Read Physics Ch 2" : "e.g. Complete Mechanics Module"} 
              className="w-full bg-transparent border-b border-slate-700 px-2 py-2 text-white focus:outline-none focus:border-amber-500 text-sm mb-4"
            />
            <div className="flex justify-between items-center">
              <select 
                value={newTaskDuration}
                onChange={(e) => setNewTaskDuration(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-300 text-sm focus:outline-none focus:border-amber-500 appearance-none"
              >
                <option value="30 min">30 min</option>
                <option value="1 hr">1 hr</option>
                <option value="2 hrs">2 hrs</option>
                <option value="3 hrs">3 hrs</option>
                <option value="4+ hrs">4+ hrs</option>
              </select>
              <button onClick={handleAddTask} className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-lg transition-colors flex items-center text-sm shadow-md">
                <Plus className="w-4 h-4 mr-1" /> Add {plannerTab === 'daily' ? 'Task' : 'Goal'}
              </button>
            </div>
          </div>
        </MotionDiv>
      </div>
    </div>
  );
};

const OnboardingScreen = ({ navigate, userData, setUserData }) => {
  const exams = Object.keys(SYLLABUS_DATA);
  const [selectedExam, setSelectedExam] = useState(userData?.targetExam || exams[0]);
  const [selectedSub, setSelectedSub] = useState(userData?.targetSub || Object.keys(SYLLABUS_DATA[exams[0]])[0]);

  const subs = SYLLABUS_DATA[selectedExam] ? Object.keys(SYLLABUS_DATA[selectedExam]) : [];

  useEffect(() => {
    if (!subs.includes(selectedSub) && subs.length > 0) {
      setSelectedSub(subs[0]);
    }
  }, [selectedExam, subs, selectedSub]);

  const handleSave = () => {
    setUserData(prev => ({ ...prev, targetExam: selectedExam, targetSub: selectedSub }));
    navigate('dashboard');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <MotionDiv className="max-w-xl w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden text-center">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 to-emerald-500"></div>
        <div className="w-20 h-20 bg-indigo-500/10 text-indigo-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-500/20">
          <Target className="w-10 h-10" />
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3">What is your Goal?</h1>
        <p className="text-slate-400 mb-10 text-lg">Select your primary target examination so we can dynamically tailor your dashboard, roadmaps, and simulations.</p>
        
        <div className="space-y-6 text-left mb-10">
          <div>
            <label className="block text-sm font-bold text-slate-300 mb-2">Target Examination</label>
            <select 
              value={selectedExam}
              onChange={(e) => setSelectedExam(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all appearance-none font-medium text-lg"
            >
              {exams.map(ex => <option key={ex} value={ex}>{String(ex)}</option>)}
            </select>
          </div>
          {subs.length > 0 && (
            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2">Specific Branch / Stage</label>
              <select 
                value={selectedSub}
                onChange={(e) => setSelectedSub(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all appearance-none font-medium text-lg"
              >
                {subs.map(sub => <option key={sub} value={sub}>{String(sub)}</option>)}
              </select>
            </div>
          )}
        </div>

        <button onClick={handleSave} className="w-full py-4 bg-gradient-to-r from-indigo-600 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500 text-white text-lg font-bold rounded-xl shadow-lg shadow-indigo-500/25 transition-all transform hover:-translate-y-1">
          Personalize My Experience
        </button>
      </MotionDiv>
    </div>
  );
};

const DashboardScreen = ({ navigate, userData, onRoadmapGenerate }) => {
  const exams = [
    { id: 'gate', title: 'GATE', icon: <Compass className="w-6 h-6" />, color: 'from-orange-500 to-red-500', desc: 'Engineering (CS, ME, CE...)' },
    { id: 'upsc', title: 'UPSC CSE', icon: <Target className="w-6 h-6" />, color: 'from-emerald-500 to-teal-600', desc: 'Civil Services (Pre/Mains)' },
    { id: 'bpsc', title: 'BPSC', icon: <Map className="w-6 h-6" />, color: 'from-blue-500 to-indigo-600', desc: 'Bihar Public Service' },
    { id: 'beu', title: 'BEU (Bihar Engg Univ)', icon: <BookOpen className="w-6 h-6" />, color: 'from-purple-500 to-pink-600', desc: 'B.Tech 1st and 2nd Sem' },
    { id: 'aktu', title: 'AKTU (UP)', icon: <Layers className="w-6 h-6" />, color: 'from-indigo-500 to-blue-600', desc: 'B.Tech Semester Exams' }
  ];

  let totalTasks = 0;
  if (userData.activeRoadmap && userData.activeRoadmap.roadmapData) {
    userData.activeRoadmap.roadmapData.forEach(phase => totalTasks += (phase.tasks || []).length);
  }
  const syllabusPct = totalTasks > 0 ? Math.round((userData.completedTasks.length / totalTasks) * 100) : 0;
  
  const dailyProgress = userData.dailyProgress || { xpGained: 0, targetXp: 120 };
  const targetXp = dailyProgress.targetXp || 120;
  const currentXp = dailyProgress.xpGained || 0;
  const dailyGoalPct = Math.min(100, Math.round((currentXp / targetXp) * 100));
  const lastTest = userData.testHistory?.[0] || null;

  return (
    <div className="space-y-8 pb-10">
      
      {/* 1. HERO SECTION - Personalized Greeting */}
      <MotionDiv className="relative bg-slate-900 border border-slate-800 rounded-3xl p-8 md:p-10 overflow-hidden shadow-xl">
        {/* Sleeker Background effects */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full filter blur-[100px] transform translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-purple-500/10 rounded-full filter blur-[80px] transform -translate-x-1/3 translate-y-1/3 pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col xl:flex-row items-center justify-between gap-10">
          <div className="flex-1 text-center xl:text-left">
            <div className="inline-flex items-center px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-full text-indigo-300 text-xs font-bold mb-6 shadow-sm">
              <Zap className="w-3.5 h-3.5 mr-1.5 text-amber-400" /> Level {calculateUserLevel(userData)} Scholar
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight leading-tight">
              Welcome Back, <br className="hidden md:block" />
              <span className="text-indigo-400">{String(userData.name) || 'Student'}</span>!
            </h1>
            <p className="text-base md:text-lg text-slate-400 max-w-xl leading-relaxed mx-auto xl:mx-0">
              {userData.targetExam ? (
                <>Your primary goal is <strong className="text-slate-200">{userData.targetExam} ({userData.targetSub})</strong>. You're currently on a <strong className="text-amber-400">{userData.streak} day streak</strong>. Let's make today count!</>
              ) : (
                <>You haven't set a target exam yet! Head over to the <strong className="text-slate-200">Goal Settings</strong> to generate your personalized roadmap and mock tests.</>
              )}
            </p>
          </div>
          <div className="shrink-0 w-full xl:w-auto flex justify-center xl:justify-end">
             <PerformanceMonitor userData={userData} />
          </div>
        </div>
      </MotionDiv>

      {/* 2. QUICK ACCESS BUTTONS */}
      <MotionDiv delay={100} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button onClick={() => navigate('test-hub')} className="bg-slate-900 border border-slate-800 hover:border-emerald-500/50 rounded-2xl p-4 md:p-6 flex flex-col items-center justify-center text-center transition-all hover:bg-slate-800 group shadow-lg">
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <CheckSquare className="w-6 h-6" />
          </div>
          <span className="font-bold text-white mb-1">Start Test</span>
          <span className="text-xs text-slate-400">Mock & Topic</span>
        </button>

        <button onClick={() => navigate('analytics')} className="bg-slate-900 border border-slate-800 hover:border-blue-500/50 rounded-2xl p-4 md:p-6 flex flex-col items-center justify-center text-center transition-all hover:bg-slate-800 group shadow-lg">
          <div className="w-12 h-12 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <BarChart2 className="w-6 h-6" />
          </div>
          <span className="font-bold text-white mb-1">View Progress</span>
          <span className="text-xs text-slate-400">Detailed Analytics</span>
        </button>

        <button onClick={() => navigate('custom-roadmap')} className="bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-4 md:p-6 flex flex-col items-center justify-center text-center transition-all hover:bg-slate-800 group shadow-lg">
          <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Calendar className="w-6 h-6" />
          </div>
          <span className="font-bold text-white mb-1">Daily Planner</span>
          <span className="text-xs text-slate-400">Custom Schedule</span>
        </button>

        <button className="bg-slate-900 border border-slate-800 rounded-2xl p-4 md:p-6 flex flex-col items-center justify-center text-center transition-all opacity-70 cursor-not-allowed shadow-lg relative overflow-hidden">
          <div className="absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 bg-slate-800 text-slate-400 rounded-full">Soon</div>
          <div className="w-12 h-12 rounded-full bg-purple-500/10 text-purple-400 flex items-center justify-center mb-3">
            <Users className="w-6 h-6" />
          </div>
          <span className="font-bold text-white mb-1">Study Room</span>
          <span className="text-xs text-slate-400">Co-learning</span>
        </button>
      </MotionDiv>

      {/* 3. MAIN DASHBOARD CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        
        {/* Left Column: Graphs & Roadmaps (Takes up 2/3) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Test Analysis Graph Section directly on Dashboard */}
          <MotionDiv delay={200} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl">
            <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
              <h3 className="text-xl font-bold text-white flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-emerald-400" /> Recent Performance Trend
              </h3>
              <button onClick={() => navigate('analytics')} className="text-sm font-bold text-indigo-400 hover:text-indigo-300 flex items-center transition-colors">
                Full Analysis <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
            
            {userData?.testHistory && userData.testHistory.length > 1 ? (
              <div className="h-64 mt-4">
                <PerformanceTrendChart testHistory={userData.testHistory} />
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-slate-800 rounded-2xl bg-slate-900/50 mt-4">
                 <TrendingUp className="w-10 h-10 text-slate-600 mb-3" />
                 <p className="text-slate-400 font-medium">Take at least 2 mock tests to unlock your trend graph.</p>
                 <button onClick={() => navigate('test-hub')} className="mt-4 px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-lg transition-colors shadow-md shadow-indigo-500/20">Go to Test Hub</button>
              </div>
            )}
          </MotionDiv>

          {/* Current Roadmap Action */}
          <MotionDiv delay={300}>
            <div className="bg-gradient-to-r from-indigo-900/40 to-slate-900 border border-indigo-500/30 rounded-3xl p-6 md:p-8 shadow-xl flex flex-col md:flex-row items-center justify-between relative overflow-hidden mb-8">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl"></div>
              
              <div className="flex items-center mb-6 md:mb-0 relative z-10 w-full md:w-auto">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mr-6 shrink-0 shadow-lg shadow-indigo-500/20">
                  <Target className="w-8 h-8 md:w-10 md:h-10" />
                </div>
                <div>
                  <h2 className="text-xs md:text-sm font-bold text-indigo-400 uppercase tracking-wider mb-1">
                    {userData.targetExam ? 'Primary Goal Assigned' : 'No Goal Selected'}
                  </h2>
                  <h3 className="text-2xl md:text-3xl font-black text-white">
                    {userData.targetExam || 'Setup Required'} 
                    <span className="text-slate-400 font-medium text-xl">
                      {userData.targetSub ? ` | ${userData.targetSub}` : ''}
                    </span>
                  </h3>
                  <p className="text-slate-400 text-sm mt-1 hidden md:block">
                    {userData.targetExam ? 'Your entire dashboard and AI suggestions are optimized for this specific exam.' : 'Please set a goal to unlock your personalized AI roadmap.'}
                  </p>
                  {userData.activeRoadmap?.planMode === 'vvi_30_days' && (
                    <span className="inline-flex items-center mt-2 px-3 py-1 bg-red-500/10 text-red-400 border border-red-500/20 rounded-full text-xs font-bold">
                      <Flame className="w-3 h-3 mr-1" /> 30-Day VVI Challenge Active
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto relative z-10">
                <button onClick={() => navigate('onboarding')} className={`flex-1 md:flex-none px-6 py-3 ${userData.targetExam ? 'bg-slate-800 hover:bg-slate-700 border border-slate-600' : 'bg-amber-600 hover:bg-amber-500 border border-amber-500 shadow-lg shadow-amber-500/25'} rounded-xl text-sm font-bold text-white transition-colors flex items-center justify-center`}>
                  <Edit3 className="w-4 h-4 mr-2" /> {userData.targetExam ? 'Switch Goal' : 'Set Your Goal Now'}
                </button>
                {!userData.activeRoadmap && userData.targetExam && (
                  <button onClick={() => navigate('roadmap-setup', { exam: userData.targetExam, sub: userData.targetSub })} className="flex-1 md:flex-none px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-sm font-bold text-white transition-colors shadow-lg shadow-indigo-500/25 flex items-center justify-center">
                    <Zap className="w-4 h-4 mr-2" /> Generate Complete Roadmap
                  </button>
                )}
              </div>
            </div>

            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white flex items-center">
                <Map className="w-5 h-5 mr-2 text-indigo-400" /> Active AI Roadmap
              </h3>
            </div>

            {userData.activeRoadmap ? (
              <div className={`bg-slate-900 border rounded-3xl p-6 md:p-8 flex flex-col justify-between group transition-all shadow-xl ${userData.activeRoadmap.planMode === 'vvi_30_days' ? 'border-red-500/30 hover:border-red-500/50' : 'border-indigo-500/30 hover:border-indigo-500/50'}`}>
                <div className="flex items-start space-x-6 mb-6">
                  <div className={`w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center border-4 shrink-0 shadow-inner ${userData.activeRoadmap.planMode === 'vvi_30_days' ? 'border-red-500/30' : 'border-indigo-500/30'}`}>
                    {userData.activeRoadmap.planMode === 'vvi_30_days' ? <Flame className="w-8 h-8 text-red-400" /> : <Compass className="w-8 h-8 text-indigo-400" />}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-1">
                      {String(userData.activeRoadmap.exam)} - {String(userData.activeRoadmap.sub)} 
                    </h3>
                    <p className="text-sm text-slate-400 mb-4">{userData.activeRoadmap.planMode === 'vvi_30_days' ? '30-Day VVI Crash Course' : 'Complete Syllabus Mastery'}</p>
                    <div className="flex items-center">
                      <div className="flex-1 bg-slate-800 h-2.5 rounded-full overflow-hidden mr-4">
                        <div className={`${userData.activeRoadmap.planMode === 'vvi_30_days' ? 'bg-gradient-to-r from-red-500 to-orange-500' : 'bg-gradient-to-r from-indigo-500 to-emerald-500'} h-full rounded-full`} style={{ width: `${syllabusPct}%` }}></div>
                      </div>
                      <span className="text-white font-bold text-sm bg-slate-800 px-2 py-1 rounded-md">{syllabusPct}%</span>
                    </div>
                  </div>
                </div>
                <button onClick={() => navigate('roadmap')} className={`w-full px-6 py-4 text-white font-bold rounded-xl transition-all transform hover:scale-[1.02] active:scale-95 shadow-lg flex justify-center items-center ${userData.activeRoadmap.planMode === 'vvi_30_days' ? 'bg-gradient-to-r from-red-600 to-orange-600 shadow-red-500/25' : 'bg-gradient-to-r from-indigo-600 to-blue-600 shadow-indigo-500/25'}`}>
                  Resume Guided Path <ArrowRight className="w-5 h-5 ml-2" />
                </button>
              </div>
            ) : (
               <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 flex flex-col items-center justify-center text-center border-dashed shadow-inner h-48">
                  <Map className="w-10 h-10 mb-3 text-slate-600" />
                  <p className="mb-4 text-slate-400 text-sm">You haven't generated a personalized AI roadmap yet.</p>
                  <button onClick={() => navigate('roadmap-setup', { exam: userData.targetExam, sub: userData.targetSub })} className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-xl transition-colors shadow-lg">Generate Roadmap Now</button>
               </div>
            )}
          </MotionDiv>
        </div>

        {/* Right Column: Activity & Summaries (Takes up 1/3) */}
        <div className="space-y-8">
          
          {/* Daily Progress / Streak */}
          <MotionDiv delay={400} className="bg-slate-900 border border-slate-800 p-6 rounded-3xl relative overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl"></div>
            <h3 className="text-lg font-bold text-white mb-4 flex items-center relative z-10">
              <Flame className="w-5 h-5 mr-2 text-amber-500" /> Daily Goal Progress
            </h3>
            <div className="flex items-center justify-between mb-2 relative z-10">
              <span className="text-sm font-bold text-slate-300">XP Progress</span>
              <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full">{currentXp} / {targetXp} XP</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden mb-4 relative z-10">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full transition-all duration-1000" style={{ width: `${dailyGoalPct}%` }}></div>
            </div>
            <p className="text-xs text-slate-400 text-center relative z-10 bg-slate-950/50 p-2 rounded-lg">
              {dailyGoalPct >= 75 ? <span className="text-emerald-400 font-bold">Awesome! Streak secured for today.</span> : `Earn ${Math.floor(targetXp * 0.75) - currentXp} more XP to keep your streak alive!`}
            </p>
          </MotionDiv>

        </div>
      </div>
    </div>
  );
};

const ProfileScreen = ({ navigate, userData, setUserData }) => {
  return (
    <div className="max-w-4xl mx-auto pb-20">
      <MotionDiv className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <button onClick={() => navigate('dashboard')} className="text-slate-400 hover:text-white flex items-center transition-colors mb-4 text-sm">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
          </button>
          <h1 className="text-3xl font-extrabold text-white">User Profile</h1>
        </div>
      </MotionDiv>

      <MotionDiv delay={100} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
          <div className="w-32 h-32 rounded-full bg-indigo-900 border-4 border-indigo-500 flex items-center justify-center text-5xl text-indigo-200 font-bold uppercase shadow-lg shadow-indigo-500/20">
            {userData?.name ? userData.name[0] : 'U'}
          </div>
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-bold text-white mb-2">{userData?.name || 'Student'}</h2>
            <p className="text-slate-400 text-lg mb-4">{userData?.email}</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-2">
              <span className="px-4 py-1.5 bg-indigo-500/20 text-indigo-400 text-sm font-bold rounded-full border border-indigo-500/30 flex items-center">
                <Zap className="w-4 h-4 mr-2" /> {userData?.xp || 0} XP
              </span>
              <span className="px-4 py-1.5 bg-amber-500/20 text-amber-400 text-sm font-bold rounded-full border border-amber-500/30 flex items-center">
                <Flame className="w-4 h-4 mr-2" /> {userData?.streak || 0} Day Streak
              </span>
              <span className="px-4 py-1.5 bg-emerald-500/20 text-emerald-400 text-sm font-bold rounded-full border border-emerald-500/30 flex items-center">
                <Target className="w-4 h-4 mr-2" /> Lvl {calculateUserLevel(userData)}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-800 pt-8">
          <div>
            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
              <History className="w-5 h-5 mr-2 text-indigo-400" /> Recent Test History
            </h3>
            {userData?.testHistory && userData.testHistory.length > 0 ? (
              <div className="space-y-4">
                {userData.testHistory.slice(0, 5).map((test, idx) => (
                  <div key={idx} className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between hover:border-slate-600 transition-colors">
                    <div>
                      <h4 className="text-white font-bold">{test.exam} - {test.sub}</h4>
                      <p className="text-slate-500 text-sm">{test.testName} • {test.date}</p>
                    </div>
                    <div className="mt-4 md:mt-0 flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm text-slate-400">Score</p>
                        <p className="text-lg font-bold text-indigo-400">{test.score} <span className="text-slate-600 text-sm">/ {test.maxScore}</span></p>
                      </div>
                      <button onClick={() => navigate('test-result', test)} className="px-5 py-2 text-sm bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600 hover:text-white font-bold rounded-lg transition-all border border-indigo-500/30">
                        Review
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 bg-slate-950 border border-slate-800 rounded-2xl p-6 text-center">No test history available yet. Take a mock test to see your performance here.</p>
            )}
          </div>
        </div>
      </MotionDiv>
    </div>
  );
};

const AnalyticsScreen = ({ navigate, userData }) => {
  const testHistory = userData?.testHistory || [];
  const hasData = testHistory.length > 0;

  // 1. Trend Data: Puraane tests pehle aayenge
  const trendData = [...testHistory].reverse().map((test, index) => ({
    name: `T${index + 1}`,
    fullTestName: test.testName,
    marks: Math.round((Number(test.score) / Number(test.maxScore)) * 100) || 0
  }));

  // 2. Topic/Subject Data Calculation
  const topicStats = {};
  testHistory.forEach(test => {
    (test.questions || []).forEach((q, idx) => {
      const t = q.topic || 'General Concepts';
      if (!topicStats[t]) topicStats[t] = { max: 0, obtained: 0 };
      topicStats[t].max += q.marks;

      const ans = test.answers?.[idx];
      let isCorrect = false;
      if (q.type === 'mcq') isCorrect = ans === q.correctAnswer;
      else if (q.type === 'nat') isCorrect = ans && String(ans) === String(q.correctAnswer);
      else if (q.type === 'theory') isCorrect = ans && String(ans).length > 20;

      if (isCorrect) topicStats[t].obtained += q.marks;
      else if (ans !== undefined && ans !== '') topicStats[t].obtained -= (q.negativeMarks || 0);
    });
  });

  const subjectData = [];
  let strongCount = 0, averageCount = 0, weakCount = 0;

  Object.keys(topicStats).forEach(topic => {
    const stat = topicStats[topic];
    const pct = stat.max > 0 ? Math.max(0, Math.round((stat.obtained / stat.max) * 100)) : 0;
    
    // Bar chart ke liye top 5 topics nikalenge
    subjectData.push({ 
      name: topic.length > 12 ? topic.substring(0, 10) + '..' : topic, 
      fullTopic: topic, 
      marks: pct, 
      full: 100 
    });

    // Pie chart ke liye categories
    if (pct >= 75) strongCount++;
    else if (pct >= 50) averageCount++;
    else weakCount++;
  });

  // Sort and limit to top 5 subjects for clean bar chart
  const topSubjectData = subjectData.sort((a, b) => b.marks - a.marks).slice(0, 5);

  const strengthData = [
    { name: 'Strong Concepts', value: strongCount },
    { name: 'Average Areas', value: averageCount },
    { name: 'Weaknesses', value: weakCount },
  ].filter(d => d.value > 0);

  const COLORS = ['#10b981', '#f59e0b', '#ef4444']; // Emerald, Amber, Red

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <MotionDiv className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <button onClick={() => navigate('dashboard')} className="text-slate-400 hover:text-white flex items-center transition-colors mb-4 text-sm">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
          </button>
          <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center">
            <BarChart2 className="w-8 h-8 mr-3 text-blue-400" /> Performance Analytics
          </h1>
          <p className="text-slate-400 mt-2 text-lg">Deep dive into your actual test scores, subject mastery, and progress trends.</p>
        </div>
      </MotionDiv>

      {!hasData ? (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center shadow-xl">
          <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-slate-700 border-dashed">
             <BarChart2 className="w-10 h-10 text-slate-600" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">No Analytics Available Yet</h2>
          <p className="text-slate-400 mb-6 max-w-md mx-auto">Your charts are currently at zero. Take your first Mock Test or Topic Test to generate your personalized performance graphs.</p>
          <button onClick={() => navigate('test-hub')} className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-colors shadow-lg">
            Start a Test
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Line Chart - Marks Trend */}
          <MotionDiv delay={100} className="lg:col-span-3 bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-emerald-400" /> Marks Trend Over Time
            </h3>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis dataKey="name" stroke="#94a3b8" tick={{ fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8' }} axisLine={false} tickLine={false} domain={[0, 100]} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#f8fafc' }}
                    itemStyle={{ color: '#818cf8' }}
                    formatter={(value) => [`${value}%`, 'Score']}
                  />
                  <Line type="monotone" dataKey="marks" stroke="#818cf8" strokeWidth={4} dot={{ r: 6, fill: '#818cf8', strokeWidth: 2, stroke: '#1e293b' }} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </MotionDiv>

          {/* Bar Chart - Subject-wise */}
          <MotionDiv delay={200} className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
              <BookOpen className="w-5 h-5 mr-2 text-blue-400" /> Topic-wise Mastery (%)
            </h3>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topSubjectData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis dataKey="name" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8' }} axisLine={false} tickLine={false} domain={[0, 100]} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#f8fafc' }}
                    cursor={{ fill: '#1e293b' }}
                    labelFormatter={(label, payload) => payload?.[0]?.payload?.fullTopic || label}
                    formatter={(value) => [`${value}%`, 'Accuracy']}
                  />
                  <Bar dataKey="marks" fill="#3b82f6" radius={[6, 6, 0, 0]} maxBarSize={60} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </MotionDiv>

          {/* Pie Chart - Strengths vs Weaknesses */}
          <MotionDiv delay={300} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl flex flex-col">
            <h3 className="text-xl font-bold text-white mb-2 flex items-center">
              <Target className="w-5 h-5 mr-2 text-amber-400" /> Topic Health
            </h3>
            <p className="text-slate-400 text-sm mb-4">Number of topics in each category</p>
            <div className="flex-1 w-full min-h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={strengthData.length > 0 ? strengthData : [{ name: 'No Data', value: 1 }]}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {(strengthData.length > 0 ? strengthData : [{ name: 'No Data', value: 1 }]).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={strengthData.length > 0 ? COLORS[index % COLORS.length] : '#334155'} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#f8fafc' }}
                    itemStyle={{ color: '#f8fafc' }}
                    formatter={(value, name) => [value, name]}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '13px', color: '#cbd5e1' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </MotionDiv>
        </div>
      )}
    </div>
  );
};

export default function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [contextData, setContextData] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [authError, setAuthError] = useState('');
  const [isDbReady, setIsDbReady] = useState(false);

  const defaultUserData = {
    name: '', email: '', targetExam: '', targetSub: '', testHistory: [], activeRoadmap: null, completedTasks: [], customTasks: [], xp: 0, streak: 0, dailyProgress: { date: '', xpGained: 0, targetXp: 120, isStreakCounted: false }, isPro: false, profilePhoto: null
  };

  const [userData, setUserData] = useState(defaultUserData);

  // --- 1. FIREBASE AUTH LISTENER ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setFirebaseUser(u);
      if (u) {
        setCurrentUser(u.email);
      } else {
        // Logout par sab clean kar do
        setCurrentUser(null);
        setIsDbReady(false);
        setUserData(defaultUserData);
      }
    });
    return () => unsubscribe();
  }, []);

  // --- 2. DATA FETCHING (SAFE LOAD) ---
  // --- 2. DATA FETCHING (SAFE LOAD) ---
  useEffect(() => {
    if (!firebaseUser) return;
    const docRef = doc(db, 'apps', appId, 'users', firebaseUser.uid);

    const unsubscribe = onSnapshot(docRef, (snap) => {
      if (snap.exists()) {
        // ✅ PURANA USER: Data mil gaya, load karo
        const fetchedData = snap.data();
        setUserData(checkAndResetStreak(fetchedData));
      } else {
        // 🆕 DATA NAHI HAI: Toh automatically naya data bana lo
        setUserData({ ...defaultUserData, email: firebaseUser.email });
      }
      
      // 🚨 MERI GALTI YAHAN THI: Is line ko if-else ke bahar hona chahiye tha
      // Taaki check hone ke baad Auto-save chalu ho sake!
      setIsDbReady(true); 
      
    }, (error) => console.error("Firestore Read Error:", error));

    return () => unsubscribe();
  }, [firebaseUser]);

  // --- 3. AUTO-SAVE (SAFE OVERWRITE PREVENTION) ---
  useEffect(() => {
    // 🚨 MAGIC FIX: Sirf tabhi save karega jab isDbReady true ho aur data mein email ho.
    // Isse empty data kabhi Firebase par overwrite nahi hoga!
    if (isDbReady && firebaseUser && userData && userData.email) {
      const cleanData = JSON.parse(JSON.stringify(userData));
      setDoc(doc(db, 'apps', appId, 'users', firebaseUser.uid), cleanData, {merge: true}).catch(console.error);
    }
  }, [userData, isDbReady, firebaseUser]);

  // --- HELPER FUNCTIONS ---
  const checkAndResetStreak = (user) => {
    if (!user) return user;
    const today = new Date().toDateString();
    if (!user.dailyProgress) {
       user.dailyProgress = { date: today, xpGained: 0, targetXp: 120, isStreakCounted: false };
       return user;
    }
    if (user.dailyProgress.date === today) return user;

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    let newStreak = user.streak || 0;
    if (user.dailyProgress.date !== yesterday.toDateString() || !user.dailyProgress.isStreakCounted) {
       newStreak = 0;
    }

    return {
      ...user,
      streak: newStreak,
      dailyProgress: { date: today, xpGained: 0, targetXp: user.dailyProgress.targetXp || 120, isStreakCounted: false }
    };
  };

  const sanitizeRoadmap = (parsedData) => {
    if (parsedData?.activeRoadmap?.roadmapData) {
      parsedData.activeRoadmap.roadmapData.forEach(phase => {
        (phase.tasks || []).forEach(task => {
          if (task.icon) delete task.icon;
        });
      });
    }
    return parsedData;
  };

  // --- LOGIN / LOGOUT ---
  const handleLogin = async ({ email, password, name, isLogin }) => {
    setAuthError('');
    try {
      if (isLogin) {
        // Login wale case mein kuch setDoc mat karo. Upar wala useEffect (Safe Load) khud data laayega!
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        // Sirf Naye account banne par setDoc chalao
        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        const initialProfile = { ...defaultUserData, name, email };
        await setDoc(doc(db, 'apps', appId, 'users', userCred.user.uid), initialProfile);
        setUserData(initialProfile);
        setIsDbReady(true);
      }
      setCurrentUser(email);
      setCurrentView('dashboard');
    } catch (e) {
      alert("Firebase Error: " + e.message);
      setAuthError(e.message);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setCurrentUser(null);
    setCurrentView('dashboard');
    setContextData(null);
    setUserData(defaultUserData);
    setIsDbReady(false);
  };

  // --- PROGRESS & XP LOGIC ---
  const updateDailyXP = (gain) => {
    const today = new Date().toDateString();
    setUserData(prev => {
      let currentDaily = prev.dailyProgress || { date: today, xpGained: 0, targetXp: 120, isStreakCounted: false };
      let newStreak = prev.streak || 0;

      if (currentDaily.date !== today) {
         const yesterday = new Date();
         yesterday.setDate(yesterday.getDate() - 1);
         if (currentDaily.date !== yesterday.toDateString() || !currentDaily.isStreakCounted) {
             newStreak = 0;
         }
         currentDaily = { date: today, xpGained: 0, targetXp: currentDaily.targetXp || 120, isStreakCounted: false };
      }

      const newXp = currentDaily.xpGained + gain;
      let isCounted = currentDaily.isStreakCounted;

      if (!isCounted && newXp >= (currentDaily.targetXp * 0.75)) {
         newStreak += 1;
         isCounted = true;
      }

      return {
        ...prev,
        xp: (prev.xp || 0) + gain,
        streak: newStreak,
        dailyProgress: { ...currentDaily, xpGained: newXp, isStreakCounted: isCounted }
      };
    });
  };

  const navigate = (view, data = null) => {
    setCurrentView(view);
    if (data) setContextData(data);
  };

  const handleTestComplete = (resultData) => {
    const xpGain = Math.max(0, Math.floor(Number(resultData.score) * 5));
    setUserData(prev => {
      const percentage = (Number(resultData.score) / Number(resultData.maxScore)) * 100;
      let newlyCompleted = [];
      if (percentage >= 80 && prev.activeRoadmap && prev.activeRoadmap.roadmapData) {
        prev.activeRoadmap.roadmapData.forEach(phase => {
          if (resultData.testName.includes(phase.title)) {
            (phase.tasks || []).forEach(task => {
              if ((task.type === 'video' || task.type === 'read') && !prev.completedTasks.includes(task.id)) {
                newlyCompleted.push(task.id);
              }
            });
          }
        });
      }
      return {
        ...prev,
        testHistory: [resultData, ...prev.testHistory].slice(0, 5),
        completedTasks: [...prev.completedTasks, ...newlyCompleted]
      };
    });
    updateDailyXP(xpGain);
  };

  const handleRoadmapGenerate = (roadmap) => {
    setUserData(prev => ({ ...prev, activeRoadmap: roadmap, completedTasks: [] }));
  };

  const handleTaskDone = (taskId, xpString) => {
    if (!userData.completedTasks.includes(taskId)) {
      const gain = parseInt(String(xpString).replace(/[^0-9]/g, '')) || 0;
      setUserData(prev => ({ ...prev, completedTasks: [...prev.completedTasks, taskId] }));
      updateDailyXP(gain);
    }
  };

  if (!currentUser) return <AuthScreen onLogin={handleLogin} authError={authError} />;

  // YAHAN SE AAPKA PURANA RETURN (...) WALA UI SHURU HOTA HAI
  return (
  <div className="min-h-screen bg-slate-950 font-sans selection:bg-indigo-500/30 text-slate-200">
      {currentView !== 'active-test' && currentView !== 'fetching-test' && (
        <nav className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-lg border-b border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
            <div className="flex items-center cursor-pointer" onClick={() => navigate('dashboard')}>
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20"><Brain className="w-6 h-6 text-white" /></div>
              <span className="ml-3 text-xl font-extrabold text-white tracking-tight">Edu<span className="text-indigo-500">Forge</span></span>
            </div>
            <div className="flex items-center space-x-2 md:space-x-4">
              <button onClick={() => navigate('custom-roadmap')} className="hidden lg:flex text-amber-400 hover:text-amber-300 bg-amber-500/10 border border-amber-500/30 text-sm font-bold px-4 py-2 rounded-lg transition-colors items-center">
                <Calendar className="w-4 h-4 mr-2" /> Custom Plan
              </button>

              <button onClick={() => navigate('test-hub')} className="flex text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 text-sm font-bold px-4 py-2 rounded-lg transition-colors items-center shadow-lg shadow-emerald-500/10">
                <CheckSquare className="w-4 h-4 mr-2" /> Mock Tests
              </button>
              <button onClick={() => navigate('analytics')} className="hidden lg:flex text-blue-400 hover:text-blue-300 bg-blue-500/10 border border-blue-500/30 text-sm font-bold px-4 py-2 rounded-lg transition-colors items-center shadow-lg shadow-blue-500/10">
                <BarChart2 className="w-4 h-4 mr-2" /> Analytics
              </button>
              <button onClick={() => navigate('strategy')} className="hidden md:flex text-slate-300 hover:text-white text-sm font-medium px-4 py-2 transition-colors items-center">
                <Lightbulb className="w-4 h-4 mr-2 text-amber-400" /> AI Strategy
              </button>
              <button onClick={() => navigate('syllabus')} className="hidden md:flex text-slate-300 hover:text-white text-sm font-medium px-4 py-2 transition-colors items-center">
                <List className="w-4 h-4 mr-2" /> Syllabus Library
              </button>
              
              <div onClick={() => navigate('profile')} className="w-10 h-10 rounded-full bg-indigo-900 border-2 border-indigo-500 flex items-center justify-center text-indigo-200 font-bold overflow-hidden cursor-pointer hover:ring-2 hover:ring-indigo-400 transition-all shadow-lg uppercase relative group" title="My Profile & History">
                {userData.profilePhoto ? <img src={userData.profilePhoto} alt="Profile" className="w-full h-full object-cover" /> : (userData.name ? String(userData.name)[0] : 'U')}
              </div>
              <button onClick={handleLogout} className="text-slate-500 hover:text-red-400 p-2" title="Logout"><LogIn className="w-5 h-5 rotate-180" /></button>
            </div>
          </div>
        </nav>
      )}

      <main className={`${(currentView === 'active-test' || currentView === 'fetching-test') ? 'p-0 h-screen' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 relative'}`}>
        {currentView === 'dashboard' && <DashboardScreen navigate={navigate} userData={userData} onRoadmapGenerate={handleRoadmapGenerate} />}
        {currentView === 'strategy' && <StrategyScreen navigate={navigate} context={contextData} userData={userData} />}
        {currentView === 'syllabus' && <SyllabusScreen navigate={navigate} context={contextData} userData={userData} />}
        {currentView === 'roadmap-setup' && <RoadmapSetupScreen navigate={navigate} context={contextData} onGenerate={handleRoadmapGenerate} userData={userData} />}
        {currentView === 'roadmap' && <RoadmapScreen navigate={navigate} context={contextData} userData={userData} onTaskDone={handleTaskDone} />}
        {currentView === 'custom-roadmap' && <CustomRoadmapPlanner navigate={navigate} userData={userData} setUserData={setUserData} />}
        {currentView === 'test-hub' && <TestHubScreen navigate={navigate} userData={userData} />}
        {currentView === 'analytics' && <AnalyticsScreen navigate={navigate} userData={userData} />}
        {currentView === 'onboarding' && <OnboardingScreen navigate={navigate} userData={userData} setUserData={setUserData} />}
        {currentView === 'active-test' && <ActiveTestScreen navigate={navigate} context={contextData} onTestComplete={handleTestComplete} />}
        {currentView === 'test-result' && <TestResultScreen navigate={navigate} context={contextData} onRoadmapGenerate={handleRoadmapGenerate} userData={userData} />}
        {currentView === 'profile' && <ProfileScreen navigate={navigate} userData={userData} setUserData={setUserData} />}
      </main>

      {currentView !== 'active-test' && currentView !== 'fetching-test' && <AIChatWidget />}
    </div>
  );
}