"""
Official AICTE Model Curriculum Benchmark
Discipline: B.Tech Computer Science & Engineering (160 Credits Framework)
Standardized by AICTE National Committee under NEP 2020.
"""

from .schemas import Curriculum, Semester, Course, Unit, CourseOutcome

def get_aicte_cse_model() -> Curriculum:
    semesters = []

    # Semester 1 (Total: 19 Credits)
    sem1_courses = [
        Course(
            code="BSC101",
            title="Linear Algebra & Calculus",
            category="BSC",
            credits=4.0,
            lecture_hours=3,
            tutorial_hours=1,
            practical_hours=0,
            semester=1,
            description="Matrices, Eigenvalues, vector spaces, multivariable calculus, and infinite series.",
            units=[
                Unit(unit_number=1, title="Matrices & Systems of Linear Equations", hours=9, topics=["Rank of matrix", "Row echelon form", "Eigenvalues and eigenvectors", "Cayley-Hamilton theorem"]),
                Unit(unit_number=2, title="Differential Calculus", hours=8, topics=["Rolle's theorem", "Mean value theorems", "Taylor's and Maclaurin's series", "Indeterminate forms"]),
                Unit(unit_number=3, title="Multivariable Calculus", hours=9, topics=["Partial derivatives", "Total derivative", "Euler's theorem", "Jacobians", "Maxima and minima of two variables"]),
                Unit(unit_number=4, title="Integral Calculus", hours=9, topics=["Double and triple integrals", "Change of order of integration", "Applications to area and volume"]),
                Unit(unit_number=5, title="Vector Calculus", hours=7, topics=["Gradient, divergence, curl", "Line, surface and volume integrals", "Green, Gauss, Stokes theorems"])
            ],
            course_outcomes=[
                CourseOutcome(code="CO1", description="Understand mathematical foundations of linear transformations and matrix decomposition", bloom_level="Understand"),
                CourseOutcome(code="CO2", description="Apply matrix eigenvalues to solve systems of linear differential equations", bloom_level="Apply"),
                CourseOutcome(code="CO3", description="Analyze multivariate functions for engineering optimization problems", bloom_level="Analyze"),
                CourseOutcome(code="CO4", description="Evaluate volume and surface integrals in curvilinear coordinates", bloom_level="Evaluate")
            ],
            textbooks=["B.S. Grewal, Higher Engineering Mathematics, Khanna Publishers", "Erwin Kreyszig, Advanced Engineering Mathematics, John Wiley & Sons"]
        ),
        Course(
            code="ESC101",
            title="Programming for Problem Solving (C / Python)",
            category="ESC",
            credits=3.0,
            lecture_hours=3,
            tutorial_hours=0,
            practical_hours=0,
            semester=1,
            description="Algorithmic problem solving, structured programming, control flows, arrays, functions, pointers and files.",
            units=[
                Unit(unit_number=1, title="Introduction to Programming & Algorithms", hours=8, topics=["Von Neumann architecture", "Flowcharts, Pseudocode", "Variables, Data types", "Expressions and operators"]),
                Unit(unit_number=2, title="Conditional Execution & Loops", hours=8, topics=["If-else, Switch statements", "While, For, Do-while loops", "Nested loops, break and continue"]),
                Unit(unit_number=3, title="Arrays and Strings", hours=8, topics=["1D and 2D arrays", "Matrix operations", "String manipulation", "Character arrays"]),
                Unit(unit_number=4, title="Functions and Pointers", hours=9, topics=["Pass by value and reference", "Recursion", "Pointer arithmetic", "Dynamic memory allocation (malloc/free)"]),
                Unit(unit_number=5, title="Structures, Unions and File I/O", hours=7, topics=["Defining structs", "Array of structures", "File read/write operations", "Error handling"])
            ],
            course_outcomes=[
                CourseOutcome(code="CO1", description="Formulate algorithmic solutions to logical and numerical computational tasks", bloom_level="Apply"),
                CourseOutcome(code="CO2", description="Implement structured modular code utilizing functions and pointer manipulations", bloom_level="Apply"),
                CourseOutcome(code="CO3", description="Analyze algorithmic complexity and memory management with dynamic allocation", bloom_level="Analyze"),
                CourseOutcome(code="CO4", description="Design file-based persistent data processing applications", bloom_level="Create")
            ],
            textbooks=["Kernighan and Ritchie, The C Programming Language, PHI", "E. Balagurusamy, Programming in ANSI C, Tata McGraw Hill"]
        ),
        Course(
            code="ESC102",
            title="Programming for Problem Solving Laboratory",
            category="ESC",
            credits=1.5,
            lecture_hours=0,
            tutorial_hours=0,
            practical_hours=3,
            semester=1,
            description="Hands-on coding lab covering branching, loops, functions, array processing, and file management.",
            units=[
                Unit(unit_number=1, title="Basic Syntax and Control Structures", hours=6, topics=["Arithmetic operations", "Branching exercises", "Nested loop patterns"]),
                Unit(unit_number=2, title="Array Processing & Strings", hours=6, topics=["Array sorting (Bubble/Selection)", "Matrix multiplication", "String palidrome check"]),
                Unit(unit_number=3, title="Pointers & Dynamic Storage", hours=6, topics=["Swapping via pointers", "Dynamic memory allocation", "Struct array processing"])
            ],
            course_outcomes=[
                CourseOutcome(code="CO1", description="Implement, compile and debug programs in modern development environments", bloom_level="Apply"),
                CourseOutcome(code="CO2", description="Develop modular command-line applications for engineering calculations", bloom_level="Create")
            ],
            textbooks=["Reema Thareja, Programming in C, Oxford University Press"]
        ),
        Course(
            code="BSC102",
            title="Engineering Physics / Semiconductor Physics",
            category="BSC",
            credits=4.0,
            lecture_hours=3,
            tutorial_hours=1,
            practical_hours=0,
            semester=1,
            description="Quantum mechanics fundamentals, band theory of solids, semiconductor devices, lasers and fiber optics.",
            units=[
                Unit(unit_number=1, title="Quantum Mechanics Fundamentals", hours=9, topics=["Wave-particle duality", "de Broglie hypothesis", "Schrodinger wave equation", "Particle in a box"]),
                Unit(unit_number=2, title="Band Theory of Solids", hours=8, topics=["Kronig-Penney model", "Direct and indirect band gaps", "Fermi-Dirac distribution", "Carrier concentrations"]),
                Unit(unit_number=3, title="Semiconductors and Junctions", hours=9, topics=["Carrier transport: drift & diffusion", "p-n junction diode", "Zener diode", "LED and photodetectors"]),
                Unit(unit_number=4, title="Lasers and Fiber Optics", hours=8, topics=["Stimulated emission", "Einstein coefficients", "Ruby and He-Ne lasers", "Optical fiber numerical aperture"]),
                Unit(unit_number=5, title="Nanotechnology & Superconductivity", hours=6, topics=["Quantum wells and quantum dots", "Carbon nanotubes", "Meissner effect", "Type I and II superconductors"])
            ],
            course_outcomes=[
                CourseOutcome(code="CO1", description="Understand quantum mechanical behavior of matter at subatomic scale", bloom_level="Understand"),
                CourseOutcome(code="CO2", description="Analyze semiconductor transport mechanisms and optoelectronic characteristics", bloom_level="Analyze"),
                CourseOutcome(code="CO3", description="Evaluate optical fiber waveguides for modern telecommunication channels", bloom_level="Evaluate")
            ],
            textbooks=["H.K. Malik and A.K. Singh, Engineering Physics, McGraw Hill", "S.M. Sze, Physics of Semiconductor Devices, Wiley"]
        ),
        Course(
            code="HSMC101",
            title="English for Professional Communication",
            category="HSMC",
            credits=3.0,
            lecture_hours=2,
            tutorial_hours=0,
            practical_hours=2,
            semester=1,
            description="Technical communication, vocabulary building, report writing, presentation skills and listening comprehension.",
            units=[
                Unit(unit_number=1, title="Communication Foundations", hours=6, topics=["Barriers to communication", "Verbal & non-verbal communication", "Active listening skills"]),
                Unit(unit_number=2, title="Technical Writing & Documentation", hours=8, topics=["Technical report writing", "Executive summaries", "Email etiquette", "White papers"]),
                Unit(unit_number=3, title="Professional Presentations & Group Dynamics", hours=6, topics=["Designing visual decks", "Debate & GD dynamics", "Interview preparation"])
            ],
            course_outcomes=[
                CourseOutcome(code="CO1", description="Compose clear and concise technical documentation and project briefs", bloom_level="Apply"),
                CourseOutcome(code="CO2", description="Deliver persuasive oral presentations to interdisciplinary stakeholders", bloom_level="Apply")
            ],
            textbooks=["Meenakshi Raman and Sangeeta Sharma, Technical Communication, Oxford University Press"]
        ),
        Course(
            code="MC101",
            title="Induction Program & Human Values (Mandatory)",
            category="MC",
            credits=0.0,
            lecture_hours=2,
            tutorial_hours=0,
            practical_hours=0,
            semester=1,
            description="AICTE Universal Human Values (UHV) mandatory induction program.",
            units=[
                Unit(unit_number=1, title="Self-Exploration and Basic Aspirations", hours=6, topics=["Continuous happiness and prosperity", "Right understanding and relationship"]),
                Unit(unit_number=2, title="Harmony in the Human Being", hours=6, topics=["Co-existence of Self and Body", "Sanyam and Swasthya"]),
                Unit(unit_number=3, title="Harmony in Family, Society and Nature", hours=6, topics=["Trust and Respect", "Comprehensive Human Goal", "Holistic perception of harmony in existence"])
            ],
            course_outcomes=[
                CourseOutcome(code="CO1", description="Recognize the holistic framework of ethical human conduct and sustainable living", bloom_level="Understand")
            ],
            textbooks=["R.R. Gaur, R. Sangal, G.P. Bagaria, A Foundation Course in Human Values and Professional Ethics, Excel Books"]
        )
    ]
    semesters.append(Semester(semester_number=1, courses=sem1_courses, total_credits=sum(c.credits for c in sem1_courses)))

    # Semester 2 (Total: 20 Credits)
    sem2_courses = [
        Course(
            code="BSC201",
            title="Differential Equations & Complex Variables",
            category="BSC",
            credits=4.0,
            lecture_hours=3,
            tutorial_hours=1,
            practical_hours=0,
            semester=2,
            description="Ordinary and partial differential equations, Cauchy-Riemann equations, contour integration, Laplace transforms.",
            units=[
                Unit(unit_number=1, title="Ordinary Differential Equations", hours=9, topics=["First order linear ODEs", "Second order linear differential equations", "Method of variation of parameters"]),
                Unit(unit_number=2, title="Partial Differential Equations", hours=8, topics=["First order linear PDEs", "Lagrange's method", "Wave equation, heat equation"]),
                Unit(unit_number=3, title="Complex Analysis & Integration", hours=9, topics=["Analytic functions", "Cauchy-Riemann equations", "Cauchy integral theorem and formula", "Residue theorem"]),
                Unit(unit_number=4, title="Laplace Transforms", hours=8, topics=["Properties of Laplace transform", "Inverse Laplace transform", "Convolution theorem", "Solving initial value problems"])
            ],
            course_outcomes=[
                CourseOutcome(code="CO1", description="Formulate and solve partial differential equations for physical systems", bloom_level="Apply"),
                CourseOutcome(code="CO2", description="Analyze complex functions using contour integration and residue calculus", bloom_level="Analyze")
            ],
            textbooks=["Erwin Kreyszig, Advanced Engineering Mathematics, Wiley"]
        ),
        Course(
            code="PCC201",
            title="Data Structures & Algorithms",
            category="PCC",
            credits=4.0,
            lecture_hours=3,
            tutorial_hours=1,
            practical_hours=0,
            semester=2,
            description="Arrays, linked lists, stacks, queues, trees, graphs, sorting, searching, hashing and algorithmic analysis.",
            units=[
                Unit(unit_number=1, title="Linear Data Structures: Stacks, Queues, Linked Lists", hours=9, topics=["Singly, doubly, circular linked lists", "Stack applications (expression evaluation)", "Circular and priority queues"]),
                Unit(unit_number=2, title="Non-Linear Structures: Trees", hours=9, topics=["Binary search trees (BST)", "AVL trees", "B-trees and B+ trees", "Tree traversals"]),
                Unit(unit_number=3, title="Graph Algorithms", hours=9, topics=["Adjacency matrix/list representation", "BFS and DFS", "Dijkstra's shortest path", "Prim's and Kruskal's MST"]),
                Unit(unit_number=4, title="Sorting, Searching & Hashing", hours=8, topics=["Merge sort, Quick sort, Heap sort", "Hash functions and collision resolution strategies", "Direct addressing"]),
                Unit(unit_number=5, title="Algorithm Complexity & Asymptotics", hours=5, topics=["Big-O, Omega, Theta notations", "Recurrence relations", "Master theorem"])
            ],
            course_outcomes=[
                CourseOutcome(code="CO1", description="Understand space and time complexity tradeoffs for core data representations", bloom_level="Understand"),
                CourseOutcome(code="CO2", description="Implement dynamic linear and hierarchical data structures for efficient data lookup", bloom_level="Apply"),
                CourseOutcome(code="CO3", description="Analyze graph traversal and shortest-path heuristics on large network topologies", bloom_level="Analyze"),
                CourseOutcome(code="CO4", description="Design optimized algorithmic workflows applying balanced tree and hashing structures", bloom_level="Create")
            ],
            textbooks=["Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest, Clifford Stein, Introduction to Algorithms (CLRS), MIT Press", "Ellis Horowitz, Sartaj Sahni, Fundamentals of Data Structures in C++, Universities Press"]
        ),
        Course(
            code="PCC202",
            title="Data Structures Laboratory",
            category="PCC",
            credits=1.5,
            lecture_hours=0,
            tutorial_hours=0,
            practical_hours=3,
            semester=2,
            description="Practical implementation of trees, stacks, graphs, sorting benchmarks, and hash tables.",
            units=[
                Unit(unit_number=1, title="Linear Structure Implementation", hours=8, topics=["Linked list manipulations", "Stack postfix calculator", "Queue simulator"]),
                Unit(unit_number=2, title="Tree and Graph Benchmarking", hours=10, topics=["BST insert/delete/search", "Graph traversal BFS/DFS", "Dijkstra routing"])
            ],
            course_outcomes=[
                CourseOutcome(code="CO1", description="Develop tested implementations of abstract data types in C/C++", bloom_level="Apply")
            ],
            textbooks=["Mark Allen Weiss, Data Structures and Algorithm Analysis, Pearson"]
        ),
        Course(
            code="ESC201",
            title="Digital Electronics & Logic Design",
            category="ESC",
            credits=4.0,
            lecture_hours=3,
            tutorial_hours=1,
            practical_hours=0,
            semester=2,
            description="Boolean algebra, Karnaugh maps, combinational logic (adders, multiplexers), sequential circuits (flip-flops, counters, registers).",
            units=[
                Unit(unit_number=1, title="Number Systems & Boolean Algebra", hours=8, topics=["Binary, Octal, Hexadecimal arithmetic", "Boolean theorems", "SOP and POS forms", "Karnaugh Map minimization (up to 5 variables)"]),
                Unit(unit_number=2, title="Combinational Logic Circuits", hours=9, topics=["Adders, Subtractors", "Multiplexers and Demultiplexers", "Decoders and Encoders", "Priority Encoders"]),
                Unit(unit_number=3, title="Sequential Logic Circuits", hours=9, topics=["Latches and Flip-Flops (SR, JK, D, T)", "Master-Slave flip-flops", "State transition tables", "Excitation tables"]),
                Unit(unit_number=4, title="Registers & Counters", hours=8, topics=["Shift registers (SISO, SIPO, PISO, PIPO)", "Synchronous and asynchronous counters", "Ring and Johnson counters"]),
                Unit(unit_number=5, title="Memory Devices & Programmable Logic", hours=6, topics=["RAM, ROM, PROM, EPROM", "PLAs, PALs and FPGA architecture overview"])
            ],
            course_outcomes=[
                CourseOutcome(code="CO1", description="Design minimal combinational circuits using Boolean algebra and K-Maps", bloom_level="Apply"),
                CourseOutcome(code="CO2", description="Analyze synchronous sequential finite state machines and counters", bloom_level="Analyze"),
                CourseOutcome(code="CO3", description="Evaluate memory architectures and programmable logic devices for embedded systems", bloom_level="Evaluate")
            ],
            textbooks=["M. Morris Mano and Michael D. Ciletti, Digital Design, Pearson Education", "A. Anand Kumar, Fundamentals of Digital Circuits, PHI"]
        ),
        Course(
            code="ESC202",
            title="Digital Electronics Laboratory",
            category="ESC",
            credits=1.5,
            lecture_hours=0,
            tutorial_hours=0,
            practical_hours=3,
            semester=2,
            description="Hardware breadboard and simulation verification of logic gates, adders, multiplexers, and flip-flops.",
            units=[
                Unit(unit_number=1, title="Gate Experiments & Combinational Logic", hours=8, topics=["Verification of logic gates", "Half and Full Adder circuits", "Multiplexer 4:1"]),
                Unit(unit_number=2, title="Sequential Logic & Counter Experiments", hours=8, topics=["JK and D flip-flops", "Asynchronous 4-bit up/down counter", "Shift register operations"])
            ],
            course_outcomes=[
                CourseOutcome(code="CO1", description="Construct and verify combinational and sequential logic circuits on breadboards and CAD simulators", bloom_level="Apply")
            ],
            textbooks=["David J. Comer, Digital Logic & State Machine Design, Oxford University Press"]
        ),
        Course(
            code="HSMC201",
            title="Universal Human Values - II: Understanding Harmony",
            category="HSMC",
            credits=3.0,
            lecture_hours=3,
            tutorial_hours=0,
            practical_hours=0,
            semester=2,
            description="AICTE mandatory credit course on understanding harmony in self, family, society and existence.",
            units=[
                Unit(unit_number=1, title="Introduction to Value Education", hours=8, topics=["Holistic perception of values", "Guidelines and process for value education", "Continuous Happiness and Prosperity"]),
                Unit(unit_number=2, title="Harmony in Society and Nature", hours=9, topics=["Universal Human Order", "Interconnectedness and mutual fulfillment in nature", "Holistic technologies and production systems"]),
                Unit(unit_number=3, title="Implications of the Holistic Understanding", hours=8, topics=["Professional ethics in the light of right understanding", "Strategies for transition to universal human order"])
            ],
            course_outcomes=[
                CourseOutcome(code="CO1", description="Internalize professional ethics, social responsibility, and ecological stewardship in engineering practice", bloom_level="Apply")
            ],
            textbooks=["R.R. Gaur et al., A Foundation Course in Human Values and Professional Ethics, Excel Books"]
        )
    ]
    semesters.append(Semester(semester_number=2, courses=sem2_courses, total_credits=sum(c.credits for c in sem2_courses)))

    # Semester 3 (Total: 21 Credits)
    sem3_courses = [
        Course(
            code="BSC301",
            title="Discrete Mathematics & Graph Theory",
            category="BSC",
            credits=4.0,
            lecture_hours=3,
            tutorial_hours=1,
            practical_hours=0,
            semester=3,
            description="Propositional logic, predicate calculus, set theory, relations, recurrence relations, generating functions, and graph theory.",
            units=[
                Unit(unit_number=1, title="Mathematical Logic & Proof Techniques", hours=9, topics=["Propositions and truth tables", "Tautologies and contradictions", "Predicates and quantifiers", "Direct proof, proof by contradiction, induction"]),
                Unit(unit_number=2, title="Relations and Functions", hours=8, topics=["Equivalence relations and partitions", "Partial orderings and Hasse diagrams", "Lattices and Boolean algebras"]),
                Unit(unit_number=3, title="Combinatorics & Recurrence Relations", hours=9, topics=["Pigeonhole principle", "Permutations and combinations", "Generating functions", "Solving linear recurrence relations"]),
                Unit(unit_number=4, title="Algebraic Structures", hours=7, topics=["Groups, subgroups, semi-groups, monoids", "Homomorphism and isomorphism", "Cosets and Lagrange's theorem"]),
                Unit(unit_number=5, title="Graph Theory Fundamentals", hours=7, topics=["Eulerian and Hamiltonian graphs", "Planar graphs and graph coloring", "Trees and minimum spanning trees"])
            ],
            course_outcomes=[
                CourseOutcome(code="CO1", description="Formulate formal proofs using propositional calculus and mathematical induction", bloom_level="Apply"),
                CourseOutcome(code="CO2", description="Analyze algebraic structures and recurrence relations modeling computing processes", bloom_level="Analyze"),
                CourseOutcome(code="CO3", description="Apply graph theory algorithms to network routing and topological analysis", bloom_level="Apply")
            ],
            textbooks=["Kenneth H. Rosen, Discrete Mathematics and its Applications, McGraw Hill", "C.L. Liu, Elements of Discrete Mathematics, Tata McGraw Hill"]
        ),
        Course(
            code="PCC301",
            title="Computer Organization & Architecture",
            category="PCC",
            credits=4.0,
            lecture_hours=3,
            tutorial_hours=1,
            practical_hours=0,
            semester=3,
            description="Instruction set architecture (RISC/CISC), CPU datapath, pipelining, memory hierarchy (cache, virtual memory), I/O systems.",
            units=[
                Unit(unit_number=1, title="Machine Instructions & Addressing Modes", hours=8, topics=["Memory locations and addresses", "Instruction formats", "Addressing modes", "RISC vs CISC comparison"]),
                Unit(unit_number=2, title="Processing Unit & Control Design", hours=9, topics=["Fundamental concepts of execution", "Single cycle datapath", "Hardwired control vs microprogrammed control"]),
                Unit(unit_number=3, title="Pipelining & Superscalar Architecture", hours=9, topics=["Basic pipeline concepts", "Data hazards and forwarding", "Control hazards and branch prediction", "Structural hazards"]),
                Unit(unit_number=4, title="Memory Organization", hours=8, topics=["Memory hierarchy", "Cache memory mapping (direct, associative, set associative)", "Cache replacement policies", "Virtual memory and TLB"]),
                Unit(unit_number=5, title="Input/Output Organization", hours=6, topics=["Accessing I/O devices", "Interrupts and interrupt handling", "Direct Memory Access (DMA)", "Bus structures (PCI, USB)"])
            ],
            course_outcomes=[
                CourseOutcome(code="CO1", description="Understand instruction execution pipelining and memory hierarchies in modern processors", bloom_level="Understand"),
                CourseOutcome(code="CO2", description="Analyze hardware hazard mitigations and cache hit/miss latency optimizations", bloom_level="Analyze"),
                CourseOutcome(code="CO3", description="Evaluate parallel computing paradigms and DMA bus bandwidth tradeoffs", bloom_level="Evaluate")
            ],
            textbooks=["David A. Patterson and John L. Hennessy, Computer Organization and Design: The Hardware/Software Interface, Morgan Kaufmann", "William Stallings, Computer Organization and Architecture, Pearson"]
        ),
        Course(
            code="PCC302",
            title="Object-Oriented Programming (Java / C++)",
            category="PCC",
            credits=3.0,
            lecture_hours=3,
            tutorial_hours=0,
            practical_hours=0,
            semester=3,
            description="Encapsulation, inheritance, polymorphism, abstract classes, interfaces, exception handling, generics, and multithreading.",
            units=[
                Unit(unit_number=1, title="Object-Oriented Paradigms & Classes", hours=8, topics=["Classes and objects", "Constructors and destructors", "Access specifiers", "Memory layout of objects"]),
                Unit(unit_number=2, title="Inheritance and Polymorphism", hours=9, topics=["Single, multiple, multilevel inheritance", "Method overriding and overloading", "Virtual functions and dynamic binding", "Abstract classes & interfaces"]),
                Unit(unit_number=3, title="Exception Handling & I/O Streams", hours=7, topics=["Try, catch, throw, throws, finally", "Custom exceptions", "Byte and character streams", "Object serialization"]),
                Unit(unit_number=4, title="Generics, Collections & Multithreading", hours=9, topics=["Generic classes and methods", "Collections framework (List, Set, Map)", "Thread lifecycle", "Synchronization and inter-thread communication"]),
                Unit(unit_number=5, title="Design Patterns Overview", hours=7, topics=["Singleton pattern", "Factory pattern", "Observer pattern", "SOLID design principles"])
            ],
            course_outcomes=[
                CourseOutcome(code="CO1", description="Design robust object-oriented software architectures utilizing polymorphism and interfaces", bloom_level="Create"),
                CourseOutcome(code="CO2", description="Implement concurrent multi-threaded applications with thread synchronization", bloom_level="Apply"),
                CourseOutcome(code="CO3", description="Analyze software coupling and cohesion according to SOLID design guidelines", bloom_level="Analyze")
            ],
            textbooks=["Herbert Schildt, Java: The Complete Reference, McGraw Hill", "Joshua Bloch, Effective Java, Addison-Wesley"]
        ),
        Course(
            code="PCC303",
            title="Object-Oriented Programming Laboratory",
            category="PCC",
            credits=1.5,
            lecture_hours=0,
            tutorial_hours=0,
            practical_hours=3,
            semester=3,
            description="Lab projects in OOP, design patterns, file IO, collections framework and GUI development.",
            units=[
                Unit(unit_number=1, title="Inheritance & Polymorphism Lab", hours=8, topics=["Hierarchy modeling", "Interface-based decoupled services"]),
                Unit(unit_number=2, title="Collections and Concurrency Lab", hours=8, topics=["Producer-Consumer queue implementation", "Collections sorting and stream API"])
            ],
            course_outcomes=[
                CourseOutcome(code="CO1", description="Develop maintainable, testable software solutions using OOP paradigms", bloom_level="Create")
            ],
            textbooks=["Cay S. Horstmann, Core Java Volume I – Fundamentals, Prentice Hall"]
        ),
        Course(
            code="PCC304",
            title="Database Management Systems",
            category="PCC",
            credits=4.0,
            lecture_hours=3,
            tutorial_hours=1,
            practical_hours=0,
            semester=3,
            description="Relational data model, ER modeling, SQL, normalization (1NF-BCNF), transaction processing, ACID properties, indexing.",
            units=[
                Unit(unit_number=1, title="Database Architecture & ER Modeling", hours=8, topics=["Database system concepts and architecture", "Data abstraction and independence", "Entity-Relationship model", "Extended ER features"]),
                Unit(unit_number=2, title="Relational Model & Relational Algebra", hours=8, topics=["Relational algebra operations", "Tuple relational calculus", "Domain relational calculus", "Integrity constraints"]),
                Unit(unit_number=3, title="SQL & Schema Normalization", hours=10, topics=["DDL, DML, DCL commands", "Complex queries, joins, subqueries, views", "Functional dependencies", "1NF, 2NF, 3NF, BCNF", "Lossless decomposition"]),
                Unit(unit_number=4, title="Transaction Processing & Concurrency", hours=8, topics=["Transaction states and ACID properties", "Concurrent executions and serializability", "Two-phase locking protocol (2PL)", "Deadlock prevention and detection"]),
                Unit(unit_number=5, title="Storage & Indexing & NoSQL Overview", hours=6, topics=["File organization and B+ Tree indexing", "Hashing techniques", "Introduction to MongoDB & Document stores"])
            ],
            course_outcomes=[
                CourseOutcome(code="CO1", description="Construct normalized relational database schemas adhering to functional dependency theory", bloom_level="Create"),
                CourseOutcome(code="CO2", description="Formulate complex SQL queries and transactional operations with ACID compliance", bloom_level="Apply"),
                CourseOutcome(code="CO3", description="Analyze concurrency protocols and query optimization plans using B+ Tree indexes", bloom_level="Analyze")
            ],
            textbooks=["Abraham Silberschatz, Henry F. Korth, S. Sudarshan, Database System Concepts, McGraw-Hill", "Ramez Elmasri and Shamkant B. Navathe, Fundamentals of Database Systems, Pearson"]
        ),
        Course(
            code="PCC305",
            title="Database Management Systems Laboratory",
            category="PCC",
            credits=1.5,
            lecture_hours=0,
            tutorial_hours=0,
            practical_hours=3,
            semester=3,
            description="SQL query development, triggers, stored procedures, ER to relational mapping, and full-stack DB integration.",
            units=[
                Unit(unit_number=1, title="SQL DDL/DML and Complex Joins", hours=8, topics=["Schema definition", "Nested queries and aggregate functions", "View management"]),
                Unit(unit_number=2, title="PL/SQL Triggers and Procedures", hours=8, topics=["Stored functions and procedures", "Row and statement level triggers", "Backend connector API integration"])
            ],
            course_outcomes=[
                CourseOutcome(code="CO1", description="Implement database instances with integrity constraints, stored procedures and triggers", bloom_level="Apply")
            ],
            textbooks=["Ivan Bayross, SQL, PL/SQL: The Programming Language of Oracle, BPB"]
        ),
        Course(
            code="MC301",
            title="Constitution of India & Professional Ethics",
            category="MC",
            credits=0.0,
            lecture_hours=2,
            tutorial_hours=0,
            practical_hours=0,
            semester=3,
            description="Indian constitutional history, fundamental rights, directive principles, governance structures, cyber ethics.",
            units=[
                Unit(unit_number=1, title="Constitutional Framework", hours=6, topics=["Preamble", "Fundamental Rights and Duties", "Directive Principles of State Policy"]),
                Unit(unit_number=2, title="Union and State Governance", hours=6, topics=["Parliamentary system", "Executive, Judiciary and Legislature", "Emergency provisions"]),
                Unit(unit_number=3, title="IT Law & Engineering Ethics", hours=6, topics=["Information Technology Act 2000", "Cyber security ethics", "Intellectual Property Rights"])
            ],
            course_outcomes=[
                CourseOutcome(code="CO1", description="Appraise constitutional principles and legal compliances pertaining to information technology", bloom_level="Understand")
            ],
            textbooks=["M.V. Pylee, An Introduction to the Constitution of India, Vikas Publishing"]
        )
    ]
    semesters.append(Semester(semester_number=3, courses=sem3_courses, total_credits=sum(c.credits for c in sem3_courses)))

    # Semester 4 (Total: 21 Credits)
    sem4_courses = [
        Course(
            code="BSC401",
            title="Probability, Statistics & Stochastic Processes",
            category="BSC",
            credits=4.0,
            lecture_hours=3,
            tutorial_hours=1,
            practical_hours=0,
            semester=4,
            description="Probability distributions, Bayes theorem, hypothesis testing, regression, Markov chains, queueing theory.",
            units=[
                Unit(unit_number=1, title="Probability Foundations & Random Variables", hours=8, topics=["Conditional probability, Bayes theorem", "Discrete & continuous random variables", "PMF, PDF, CDF", "Expectation and variance"]),
                Unit(unit_number=2, title="Standard Distributions", hours=8, topics=["Binomial, Poisson, Normal, Exponential distributions", "Central Limit Theorem", "Joint distributions"]),
                Unit(unit_number=3, title="Statistical Inference & Hypothesis Testing", hours=9, topics=["Sampling distributions", "Confidence intervals", "Hypothesis testing: t-test, z-test, Chi-square test, ANOVA"]),
                Unit(unit_number=4, title="Regression and Correlation Analysis", hours=7, topics=["Linear regression", "Least squares estimation", "Pearson correlation", "Multiple regression basics"]),
                Unit(unit_number=5, title="Stochastic Processes & Markov Chains", hours=8, topics=["Definition of stochastic process", "Markov chains: transition probability matrix", "Stationary distributions", "M/M/1 Queueing models"])
            ],
            course_outcomes=[
                CourseOutcome(code="CO1", description="Compute likelihoods and Bayesian inference for probabilistic data models", bloom_level="Apply"),
                CourseOutcome(code="CO2", description="Formulate statistical hypothesis tests for experimental algorithmic validation", bloom_level="Analyze"),
                CourseOutcome(code="CO3", description="Model queueing systems and server latencies using Markov chains", bloom_level="Analyze")
            ],
            textbooks=["Sheldon M. Ross, Introduction to Probability and Statistics for Engineers and Scientists, Academic Press"]
        ),
        Course(
            code="PCC401",
            title="Design and Analysis of Algorithms",
            category="PCC",
            credits=4.0,
            lecture_hours=3,
            tutorial_hours=1,
            practical_hours=0,
            semester=4,
            description="Divide and conquer, greedy methods, dynamic programming, backtracking, branch & bound, NP-completeness.",
            units=[
                Unit(unit_number=1, title="Divide and Conquer", hours=8, topics=["Strassen's matrix multiplication", "Quick sort analysis (worst & average cases)", "Binary search variations"]),
                Unit(unit_number=2, title="Greedy Approach", hours=8, topics=["Fractional knapsack", "Huffman coding", "Job sequencing with deadlines", "Optimal storage on tapes"]),
                Unit(unit_number=3, title="Dynamic Programming", hours=9, topics=["0/1 Knapsack problem", "Matrix chain multiplication", "Longest common subsequence (LCS)", "Floyd-Warshall all-pairs shortest paths"]),
                Unit(unit_number=4, title="Backtracking & Branch and Bound", hours=8, topics=["N-Queens problem", "Subset sum problem", "Graph coloring", "Traveling Salesperson Problem (TSP)"]),
                Unit(unit_number=5, title="Computational Complexity & NP-Completeness", hours=7, topics=["Classes P, NP, NP-Hard, NP-Complete", "Polynomial time verification", "Cook-Levin theorem", "NP-Complete reductions (3-SAT to Clique)"])
            ],
            course_outcomes=[
                CourseOutcome(code="CO1", description="Synthesize dynamic programming and greedy algorithms to solve combinatorial problems", bloom_level="Create"),
                CourseOutcome(code="CO2", description="Analyze worst-case asymptotic bounds of recursive divide-and-conquer paradigms", bloom_level="Analyze"),
                CourseOutcome(code="CO3", description="Evaluate computational hardness and categorize decision problems into P vs NP-Complete", bloom_level="Evaluate")
            ],
            textbooks=["Thomas H. Cormen et al., Introduction to Algorithms, MIT Press", "Jon Kleinberg and Eva Tardos, Algorithm Design, Pearson"]
        ),
        Course(
            code="PCC402",
            title="Operating Systems",
            category="PCC",
            credits=4.0,
            lecture_hours=3,
            tutorial_hours=1,
            practical_hours=0,
            semester=4,
            description="Process management, threads, CPU scheduling, synchronization, deadlocks, memory management, virtual memory, file systems.",
            units=[
                Unit(unit_number=1, title="Process Management & Scheduling", hours=9, topics=["Process lifecycle and PCB", "Context switching", "Scheduling algorithms (FCFS, SJF, Round Robin, Multi-level)"]),
                Unit(unit_number=2, title="Process Synchronization & Deadlocks", hours=9, topics=["Critical section problem", "Peterson's solution", "Semaphores and Mutexes", "Dining Philosophers & Reader-Writer problems", "Deadlock conditions and Banker's algorithm"]),
                Unit(unit_number=3, title="Memory Management & Virtual Memory", hours=9, topics=["Contiguous allocation, Paging, Segmentation", "Page replacement algorithms (FIFO, LRU, Optimal)", "Thrashing and working set model"]),
                Unit(unit_number=4, title="Storage & File Systems", hours=7, topics=["File allocation methods (contiguous, linked, indexed)", "Free space management", "Disk scheduling algorithms (SSTF, SCAN, C-SCAN)"]),
                Unit(unit_number=5, title="Protection, Security & Linux Kernel Case Study", hours=6, topics=["Access matrix", "User authentication", "Linux kernel architecture and system calls"])
            ],
            course_outcomes=[
                CourseOutcome(code="CO1", description="Understand concurrency primitives, process scheduling, and memory mapping mechanisms", bloom_level="Understand"),
                CourseOutcome(code="CO2", description="Implement synchronization mechanisms eliminating race conditions and deadlocks", bloom_level="Apply"),
                CourseOutcome(code="CO3", description="Analyze virtual memory page fault rates and disk scheduling performance", bloom_level="Analyze")
            ],
            textbooks=["Abraham Silberschatz, Peter B. Galvin, Greg Gagne, Operating System Concepts, Wiley", "Andrew S. Tanenbaum, Modern Operating Systems, Pearson"]
        ),
        Course(
            code="PCC403",
            title="Operating Systems Laboratory",
            category="PCC",
            credits=1.5,
            lecture_hours=0,
            tutorial_hours=0,
            practical_hours=3,
            semester=4,
            description="Linux system calls (fork, exec, wait), multithreading with pthreads, synchronization primitives, page replacement simulation.",
            units=[
                Unit(unit_number=1, title="Process Creation and IPC", hours=8, topics=["fork, vfork, exec system calls", "UNIX pipes and message queues"]),
                Unit(unit_number=2, title="Pthreads and Scheduling Simulations", hours=8, topics=["POSIX threads and semaphores", "Round Robin simulator", "LRU page replacement simulator"])
            ],
            course_outcomes=[
                CourseOutcome(code="CO1", description="Build systems-level programs using POSIX system calls, IPC, and thread synchronization", bloom_level="Apply")
            ],
            textbooks=["W. Richard Stevens, Advanced Programming in the UNIX Environment, Addison-Wesley"]
        ),
        Course(
            code="PCC404",
            title="Software Engineering & Agile Methodologies",
            category="PCC",
            credits=3.0,
            lecture_hours=3,
            tutorial_hours=0,
            practical_hours=0,
            semester=4,
            description="Software life cycle models, Agile/Scrum, requirement engineering, UML design, testing strategies, CI/CD, DevOps.",
            units=[
                Unit(unit_number=1, title="Software Process Models & Agile", hours=8, topics=["Waterfall, Spiral, V-Model", "Agile manifesto, Scrum framework, Sprint planning", "User stories and Kanban boards"]),
                Unit(unit_number=2, title="Requirement Engineering & Modeling", hours=8, topics=["Functional and non-functional requirements", "SRS documentation (IEEE 830)", "UML diagrams: Use Case, Class, Sequence, Activity"]),
                Unit(unit_number=3, title="Architecture and Design", hours=8, topics=["Architectural styles (Layered, Microservices, Event-driven)", "Coupling and cohesion metrics", "Refactoring techniques"]),
                Unit(unit_number=4, title="Software Testing & Quality Assurance", hours=8, topics=["Black-box vs White-box testing", "Unit testing, integration testing, regression testing", "Test-Driven Development (TDD)"]),
                Unit(unit_number=5, title="DevOps & Software Maintenance", hours=8, topics=["Version control (Git)", "CI/CD pipelines", "Software cost estimation (COCOMO)", "Maintenance and legacy modernization"])
            ],
            course_outcomes=[
                CourseOutcome(code="CO1", description="Formulate software requirements specifications and UML architectural diagrams", bloom_level="Create"),
                CourseOutcome(code="CO2", description="Apply Agile Scrum workflows, sprint tracking, and automated unit testing", bloom_level="Apply"),
                CourseOutcome(code="CO3", description="Evaluate software quality metrics, test coverage, and CI/CD pipelines", bloom_level="Evaluate")
            ],
            textbooks=["Roger S. Pressman, Software Engineering: A Practitioner's Approach, McGraw Hill", "Ian Sommerville, Software Engineering, Pearson"]
        ),
        Course(
            code="HSMC401",
            title="Engineering Economics & Financial Management",
            category="HSMC",
            credits=3.0,
            lecture_hours=3,
            tutorial_hours=0,
            practical_hours=0,
            semester=4,
            description="Cost analysis, time value of money, cash flow diagrams, NPV, IRR, break-even analysis, financial statements.",
            units=[
                Unit(unit_number=1, title="Economics Foundations in Engineering", hours=8, topics=["Demand and supply laws", "Elasticity of demand", "Cost concepts (fixed, variable, marginal cost)"]),
                Unit(unit_number=2, title="Time Value of Money & Project Evaluation", hours=9, topics=["Simple and compound interest", "Discounted cash flow diagrams", "Net Present Value (NPV)", "Internal Rate of Return (IRR)"]),
                Unit(unit_number=3, title="Cost Estimation & Depreciation", hours=8, topics=["Break-even analysis", "Depreciation methods (straight line, declining balance)", "Income statements and balance sheet analysis"])
            ],
            course_outcomes=[
                CourseOutcome(code="CO1", description="Analyze engineering project feasibility using NPV, IRR, and break-even techniques", bloom_level="Analyze")
            ],
            textbooks=["Panneerselvam R., Engineering Economics, PHI"]
        ),
        Course(
            code="MC401",
            title="Environmental Sciences & Sustainability (Mandatory)",
            category="MC",
            credits=0.0,
            lecture_hours=2,
            tutorial_hours=0,
            practical_hours=0,
            semester=4,
            description="Ecosystems, biodiversity, environmental pollution, climate change, renewable energy, e-waste management.",
            units=[
                Unit(unit_number=1, title="Ecosystems & Natural Resources", hours=6, topics=["Structure and function of ecosystem", "Forest, water, mineral resources", "Energy resources: renewable vs non-renewable"]),
                Unit(unit_number=2, title="Pollution Control & Climate Change", hours=6, topics=["Air, water, soil and noise pollution", "Greenhouse effect and global warming", "Electronic waste (e-waste) disposal in tech industry"]),
                Unit(unit_number=3, title="Environmental Policies & Sustainable Development", hours=6, topics=["Environmental Protection Act", "Circular economy", "Sustainable Development Goals (SDGs)"])
            ],
            course_outcomes=[
                CourseOutcome(code="CO1", description="Understand environmental conservation ethics, e-waste hazards, and circular sustainability", bloom_level="Understand")
            ],
            textbooks=["Erach Bharucha, Textbook of Environmental Studies, Universities Press"]
        )
    ]
    semesters.append(Semester(semester_number=4, courses=sem4_courses, total_credits=sum(c.credits for c in sem4_courses)))

    # Semester 5 (Total: 21 Credits)
    sem5_courses = [
        Course(
            code="PCC501",
            title="Theory of Computation & Automata",
            category="PCC",
            credits=4.0,
            lecture_hours=3,
            tutorial_hours=1,
            practical_hours=0,
            semester=5,
            description="Finite automata (DFA/NFA), regular expressions, context-free grammars (CFG), pushdown automata (PDA), Turing machines, decidability.",
            units=[
                Unit(unit_number=1, title="Finite Automata & Regular Languages", hours=9, topics=["Deterministic and Non-deterministic Finite Automata (DFA/NFA)", "Equivalence of DFA and NFA", "Minimization of DFA", "Regular expressions and Pumping Lemma for regular languages"]),
                Unit(unit_number=2, title="Context-Free Grammars & Languages", hours=9, topics=["Chomsky hierarchy", "Parse trees and ambiguity", "Chomsky Normal Form (CNF) and Greibach Normal Form (GNF)", "Pumping Lemma for CFLs"]),
                Unit(unit_number=3, title="Pushdown Automata (PDA)", hours=8, topics=["Deterministic and Non-deterministic PDA", "Equivalence of PDA and CFG", "Two-stack PDA"]),
                Unit(unit_number=4, title="Turing Machines", hours=8, topics=["Turing Machine formal definition and design", "Multi-tape and non-deterministic Turing Machines", "Church-Turing Thesis"]),
                Unit(unit_number=5, title="Decidability & Halting Problem", hours=6, topics=["Decidable and undecidable problems", "Halting problem of Turing Machine", "Post Correspondence Problem (PCP)", "Reducibility"])
            ],
            course_outcomes=[
                CourseOutcome(code="CO1", description="Design finite state automata and regular expressions for formal lexical parsing", bloom_level="Create"),
                CourseOutcome(code="CO2", description="Construct pushdown automata and context-free grammars for language syntax specification", bloom_level="Create"),
                CourseOutcome(code="CO3", description="Analyze computational limits and formulate undecidability proofs using the Halting Problem", bloom_level="Analyze")
            ],
            textbooks=["John E. Hopcroft, Rajeev Motwani, Jeffrey D. Ullman, Introduction to Automata Theory, Languages, and Computation, Pearson", "Michael Sipser, Introduction to the Theory of Computation, Cengage Learning"]
        ),
        Course(
            code="PCC502",
            title="Computer Networks",
            category="PCC",
            credits=4.0,
            lecture_hours=3,
            tutorial_hours=1,
            practical_hours=0,
            semester=5,
            description="OSI and TCP/IP models, data link protocols, routing algorithms (OSPF, BGP), transport protocols (TCP/UDP, congestion control), application protocols.",
            units=[
                Unit(unit_number=1, title="Network Architecture & Physical Layer", hours=8, topics=["Network topologies", "OSI reference model vs TCP/IP stack", "Transmission media, multiplexing", "Packet switching vs circuit switching"]),
                Unit(unit_number=2, title="Data Link Layer & MAC Sublayer", hours=9, topics=["Framing, Error detection (CRC, Checksum)", "Sliding window protocols (Go-Back-N, Selective Repeat)", "Ethernet (IEEE 802.3), CSMA/CD, CSMA/CA", "Wireless LAN (802.11)"]),
                Unit(unit_number=3, title="Network Layer & Routing", hours=9, topics=["IPv4 and IPv6 addressing, subnetting, CIDR", "Routing algorithms: Distance Vector (RIP), Link State (OSPF), BGP", "NAT, ARP, DHCP, ICMP"]),
                Unit(unit_number=4, title="Transport Layer Protocols", hours=8, topics=["TCP vs UDP", "Three-way handshake and connection termination", "TCP flow control (sliding window)", "TCP congestion control (Slow start, Congestion avoidance, Fast retransmit)"]),
                Unit(unit_number=5, title="Application Layer Protocols & Network Security", hours=6, topics=["DNS, HTTP/1.1, HTTP/2, HTTP/3, SMTP", "TLS/SSL handshake", "Firewalls and intrusion detection overview"])
            ],
            course_outcomes=[
                CourseOutcome(code="CO1", description="Understand hierarchical network architectures, layering abstractions, and socket communications", bloom_level="Understand"),
                CourseOutcome(code="CO2", description="Analyze packet routing pathways, CIDR subnets, and TCP congestion dynamics", bloom_level="Analyze"),
                CourseOutcome(code="CO3", description="Evaluate transport security protocols (TLS) and application-layer throughput tradeoffs", bloom_level="Evaluate")
            ],
            textbooks=["Andrew S. Tanenbaum, David J. Wetherall, Computer Networks, Pearson", "James F. Kurose, Keith W. Ross, Computer Networking: A Top-Down Approach, Pearson"]
        ),
        Course(
            code="PCC503",
            title="Computer Networks Laboratory",
            category="PCC",
            credits=1.5,
            lecture_hours=0,
            tutorial_hours=0,
            practical_hours=3,
            semester=5,
            description="Socket programming (TCP/UDP in Python/C), Wireshark packet analysis, Cisco Packet Tracer routing simulations.",
            units=[
                Unit(unit_number=1, title="Socket Programming Lab", hours=8, topics=["Client-server socket setup", "Multi-client chat server", "HTTP client implementation"]),
                Unit(unit_number=2, title="Packet Sniffing and Simulation", hours=8, topics=["Wireshark protocol dissection (TCP, DNS, HTTP)", "Cisco Packet Tracer VLAN & OSPF setup"])
            ],
            course_outcomes=[
                CourseOutcome(code="CO1", description="Implement distributed socket-based client-server architectures and packet capture analyses", bloom_level="Apply")
            ],
            textbooks=["W. Richard Stevens, UNIX Network Programming, Volume 1, Prentice Hall"]
        ),
        Course(
            code="PCC504",
            title="Artificial Intelligence & Machine Learning Fundamentals",
            category="PCC",
            credits=4.0,
            lecture_hours=3,
            tutorial_hours=1,
            practical_hours=0,
            semester=5,
            description="Search algorithms (A*, Minimax), Supervised learning (Linear/Logistic regression, Decision trees, SVM), Unsupervised learning, Neural networks.",
            units=[
                Unit(unit_number=1, title="Intelligent Agents & Problem Solving by Search", hours=8, topics=["Agent architectures and environments", "Uninformed search (BFS, DFS)", "Heuristic informed search: A*, IDA*, Greedy best-first", "Adversarial search and Alpha-Beta pruning"]),
                Unit(unit_number=2, title="Supervised Machine Learning", hours=9, topics=["Linear and Polynomial regression", "Logistic regression for classification", "Decision Trees and Random Forests", "Support Vector Machines (SVM) & kernel trick"]),
                Unit(unit_number=3, title="Unsupervised Learning & Dimensionality Reduction", hours=8, topics=["K-Means clustering, Hierarchical clustering", "Principal Component Analysis (PCA)", "t-SNE", "Anomaly detection"]),
                Unit(unit_number=4, title="Neural Networks & Deep Learning Intro", hours=9, topics=["Perceptron, Multi-Layer Perceptron (MLP)", "Backpropagation algorithm", "Activation functions (ReLU, Sigmoid, Softmax)", "Regularization (Dropout, L1/L2)", "Introduction to Convolutional Neural Networks (CNN)"]),
                Unit(unit_number=5, title="Ethics, Fairness & AI Governance", hours=6, topics=["Algorithmic bias and fairness metrics", "Explainable AI (XAI) concepts", "Responsible AI in industrial deployment"])
            ],
            course_outcomes=[
                CourseOutcome(code="CO1", description="Formulate state-space search and heuristic evaluations for autonomous problem solving", bloom_level="Apply"),
                CourseOutcome(code="CO2", description="Implement supervised and unsupervised ML pipelines with hyperparameter optimization", bloom_level="Apply"),
                CourseOutcome(code="CO3", description="Analyze deep neural network architectures and loss surface convergence behavior", bloom_level="Analyze"),
                CourseOutcome(code="CO4", description="Evaluate ethical implications, data privacy, and fairness in machine learning deployments", bloom_level="Evaluate")
            ],
            textbooks=["Stuart Russell and Peter Norvig, Artificial Intelligence: A Modern Approach, Pearson", "Aurélien Géron, Hands-On Machine Learning with Scikit-Learn, Keras, and TensorFlow, O'Reilly"]
        ),
        Course(
            code="PCC505",
            title="AI & Machine Learning Laboratory",
            category="PCC",
            credits=1.5,
            lecture_hours=0,
            tutorial_hours=0,
            practical_hours=3,
            semester=5,
            description="Python (NumPy, Pandas, Scikit-learn, PyTorch) implementations of search algorithms, classifiers, clustering and neural networks.",
            units=[
                Unit(unit_number=1, title="Search & Classic ML Experiments", hours=8, topics=["A* search implementation", "Linear and Logistic regression with metrics", "Random Forest ensemble on real-world dataset"]),
                Unit(unit_number=2, title="Clustering & Deep Learning Experiments", hours=8, topics=["K-Means image segmentation", "PCA dimensionality reduction", "PyTorch MLP on MNIST/CIFAR"])
            ],
            course_outcomes=[
                CourseOutcome(code="CO1", description="Build end-to-end data processing, feature engineering, and model training pipelines in Python", bloom_level="Create")
            ],
            textbooks=["Sebastian Raschka, Python Machine Learning, Packt Publishing"]
        ),
        Course(
            code="PEC501",
            title="Professional Elective - I (Cloud Computing / Web Technologies / Cybersecurity)",
            category="PEC",
            credits=3.0,
            lecture_hours=3,
            tutorial_hours=0,
            practical_hours=0,
            semester=5,
            description="Specialization basket elective: Cloud Architecture (AWS/GCP/Azure, Microservices, Kubernetes) or Modern Full-Stack or Cyber Defense.",
            units=[
                Unit(unit_number=1, title="Cloud Computing Fundamentals", hours=8, topics=["NIST cloud definition", "IaaS, PaaS, SaaS", "Public, private, hybrid cloud"]),
                Unit(unit_number=2, title="Virtualization & Containers", hours=8, topics=["Hypervisors Type 1 & 2", "Docker containerization", "Kubernetes orchestration basics"]),
                Unit(unit_number=3, title="Cloud Storage & Serverless", hours=8, topics=["Object storage (S3)", "Serverless computing (AWS Lambda / Cloud Functions)", "Microservices architecture"]),
                Unit(unit_number=4, title="Cloud Security & Scalability", hours=8, topics=["Identity & Access Management (IAM)", "Load balancing, Auto-scaling groups", "Disaster recovery"])
            ],
            course_outcomes=[
                CourseOutcome(code="CO1", description="Design cloud-native microservice architectures with auto-scaling and high availability", bloom_level="Create")
            ],
            textbooks=["Rajkumar Buyya, Christian Vecchiola, S. Thamarai Selvi, Mastering Cloud Computing, McGraw Hill"]
        ),
        Course(
            code="PROJ501",
            title="Design Thinking & Mini Project",
            category="PROJ",
            credits=3.0,
            lecture_hours=0,
            tutorial_hours=0,
            practical_hours=6,
            semester=5,
            description="Team-based multidisciplinary problem solving applying Design Thinking principles to engineer a functional prototype.",
            units=[
                Unit(unit_number=1, title="Empathize and Define", hours=6, topics=["User research, empathy maps", "Problem statement definition"]),
                Unit(unit_number=2, title="Ideate, Prototype, and Test", hours=12, topics=["Brainstorming solutions", "Rapid prototyping", "Iterative user validation and deployment"])
            ],
            course_outcomes=[
                CourseOutcome(code="CO1", description="Develop an end-to-end working software prototype addressing a verified social or industrial challenge", bloom_level="Create")
            ],
            textbooks=["Tim Brown, Change by Design, HarperBusiness"]
        )
    ]
    semesters.append(Semester(semester_number=5, courses=sem5_courses, total_credits=sum(c.credits for c in sem5_courses)))

    # Semester 6 (Total: 21 Credits)
    sem6_courses = [
        Course(
            code="PCC601",
            title="Compiler Design",
            category="PCC",
            credits=4.0,
            lecture_hours=3,
            tutorial_hours=1,
            practical_hours=0,
            semester=6,
            description="Lexical analysis (Lex/Flex), syntax analysis (Yacc/Bison, LL/LR parsers), semantic analysis, intermediate code generation, code optimization.",
            units=[
                Unit(unit_number=1, title="Lexical Analysis", hours=8, topics=["Role of lexical analyzer", "Input buffering, Token specification", "Lex / Flex tool usage"]),
                Unit(unit_number=2, title="Syntax Analysis & Parsing", hours=10, topics=["Top-down parsing: Recursive descent, LL(1) parsers", "Bottom-up parsing: Shift-Reduce, SLR, CLR, LALR parsers", "Error recovery strategies in parsers"]),
                Unit(unit_number=3, title="Syntax-Directed Translation & Semantic Analysis", hours=8, topics=["Syntax-Directed Definitions (SDD)", "S-attributed and L-attributed definitions", "Type checking and symbol table organizations"]),
                Unit(unit_number=4, title="Intermediate Code Generation", hours=8, topics=["Three-address code, Quadruples, Triples", "Translation of expressions and control flow statements"]),
                Unit(unit_number=5, title="Code Optimization & Target Code Generation", hours=8, topics=["Basic blocks and flow graphs", "Principal sources of optimization (common subexpression, loop invariant code motion)", "Peephole optimization", "Register allocation"])
            ],
            course_outcomes=[
                CourseOutcome(code="CO1", description="Construct lexical analyzers and LR parsers generating abstract syntax trees", bloom_level="Create"),
                CourseOutcome(code="CO2", description="Analyze compiler intermediate representations and symbol table lookups", bloom_level="Analyze"),
                CourseOutcome(code="CO3", description="Apply machine-independent code optimization transformations on control flow graphs", bloom_level="Apply")
            ],
            textbooks=["Alfred V. Aho, Monica S. Lam, Ravi Sethi, Jeffrey D. Ullman, Compilers: Principles, Techniques, and Tools (Dragon Book), Pearson"]
        ),
        Course(
            code="PCC602",
            title="Cryptography & Network Security",
            category="PCC",
            credits=4.0,
            lecture_hours=3,
            tutorial_hours=1,
            practical_hours=0,
            semester=6,
            description="Classical ciphers, symmetric cryptography (AES, DES), asymmetric cryptography (RSA, ECC), hash functions (SHA-256), digital signatures, PKI.",
            units=[
                Unit(unit_number=1, title="Security Principles & Classical Encryption", hours=8, topics=["CIA triad (Confidentiality, Integrity, Availability)", "Security attacks, services, and mechanisms", "Substitution and transposition ciphers"]),
                Unit(unit_number=2, title="Symmetric Key Cryptography", hours=8, topics=["Block cipher principles, Feistel cipher", "Data Encryption Standard (DES)", "Advanced Encryption Standard (AES)", "Modes of operation (CBC, CTR, GCM)"]),
                Unit(unit_number=3, title="Asymmetric Cryptography & Key Management", hours=9, topics=["Number theory: modular arithmetic, Fermat's and Euler's theorem", "RSA cryptosystem", "Diffie-Hellman key exchange", "Elliptic Curve Cryptography (ECC)"]),
                Unit(unit_number=4, title="Cryptographic Hash Functions & Signatures", hours=8, topics=["Hash properties, Birthday attack", "SHA-256 and SHA-3", "Message Authentication Codes (HMAC)", "Digital Signatures (DSA, ECDSA)", "Public Key Infrastructure (PKI)"]),
                Unit(unit_number=5, title="Network Security Protocols & Threats", hours=6, topics=["IPsec, SSL/TLS, Kerberos authentication", "Zero Trust Architecture overview", "Malware, ransomware, DDoS, and phishing defenses"])
            ],
            course_outcomes=[
                CourseOutcome(code="CO1", description="Apply modern symmetric (AES) and asymmetric (RSA/ECC) encryption standards", bloom_level="Apply"),
                CourseOutcome(code="CO2", description="Analyze cryptographic integrity via collision-resistant hash functions and digital signatures", bloom_level="Analyze"),
                CourseOutcome(code="CO3", description="Evaluate Zero Trust security paradigms and protocol defenses against advanced threat actors", bloom_level="Evaluate")
            ],
            textbooks=["William Stallings, Cryptography and Network Security: Principles and Practice, Pearson", "Behrouz A. Forouzan, Cryptography and Network Security, McGraw Hill"]
        ),
        Course(
            code="PEC601",
            title="Professional Elective - II (Full-Stack Engineering / Big Data Analytics)",
            category="PEC",
            credits=3.0,
            lecture_hours=3,
            tutorial_hours=0,
            practical_hours=0,
            semester=6,
            description="Full-Stack Web Engineering: React, Node.js, Next.js, REST & GraphQL APIs, ORM, WebSockets, or Big Data with Hadoop/Spark.",
            units=[
                Unit(unit_number=1, title="Modern Frontend Development", hours=8, topics=["Component lifecycle, React Hooks (useState, useEffect)", "State management (Redux/Zustand)", "Responsive CSS"]),
                Unit(unit_number=2, title="Backend API Architecture", hours=8, topics=["Express / FastAPI REST endpoints", "GraphQL schema & resolvers", "Authentication (JWT, OAuth 2.0)"]),
                Unit(unit_number=3, title="Database Integration & Caching", hours=8, topics=["ORM (Prisma / SQLAlchemy)", "Redis caching strategies", "Database migrations"]),
                Unit(unit_number=4, title="Deployment & Realtime Features", hours=8, topics=["WebSockets (Socket.io)", "Dockerizing full-stack apps", "Serverless deployment (Vercel, AWS)"])
            ],
            course_outcomes=[
                CourseOutcome(code="CO1", description="Develop resilient full-stack applications with state management and secure authentication", bloom_level="Create")
            ],
            textbooks=["Alex Banks and Eve Porcello, Learning React, O'Reilly"]
        ),
        Course(
            code="PEC602",
            title="Professional Elective - III (Natural Language Processing / Internet of Things)",
            category="PEC",
            credits=3.0,
            lecture_hours=3,
            tutorial_hours=0,
            practical_hours=0,
            semester=6,
            description="NLP: Text preprocessing, word embeddings (Word2Vec, GloVe), Transformers (BERT, GPT), LLM prompting, or IoT Embedded Architectures.",
            units=[
                Unit(unit_number=1, title="Text Processing & Language Models", hours=8, topics=["Tokenization, lemmatization, N-grams", "Vector space models, TF-IDF", "Word2Vec, FastText"]),
                Unit(unit_number=2, title="Sequence Models & Transformers", hours=9, topics=["RNNs and LSTMs limitations", "Attention mechanism: Query, Key, Value", "Transformer architecture (Multi-head attention)", "BERT and GPT family"]),
                Unit(unit_number=3, title="Generative AI & LLM Applications", hours=8, topics=["Prompt engineering techniques", "Retrieval-Augmented Generation (RAG)", "Fine-tuning vs LoRA", "Vector databases (Chroma, Pinecone)"]),
                Unit(unit_number=4, title="Evaluation & Guardrails", hours=7, topics=["BLEU, ROUGE, Perplexity", "Hallucination mitigation and content safety"])
            ],
            course_outcomes=[
                CourseOutcome(code="CO1", description="Implement Transformer-based NLP pipelines and Retrieval-Augmented Generation systems", bloom_level="Create")
            ],
            textbooks=["Dan Jurafsky and James H. Martin, Speech and Language Processing, Pearson"]
        ),
        Course(
            code="OEC601",
            title="Open Elective - I (Interdisciplinary: Quantum Computing / Robotics / Bio-Informatics)",
            category="OEC",
            credits=3.0,
            lecture_hours=3,
            tutorial_hours=0,
            practical_hours=0,
            semester=6,
            description="Multidisciplinary open elective basket for expanding perspectives outside CSE core.",
            units=[
                Unit(unit_number=1, title="Introduction to Quantum Information", hours=8, topics=["Qubits, superposition, entanglement", "Bloch sphere representation"]),
                Unit(unit_number=2, title="Quantum Circuits and Algorithms", hours=9, topics=["Hadamard, CNOT, Phase gates", "Deutsch-Jozsa algorithm", "Grover's search and Shor's factoring basics"]),
                Unit(unit_number=3, title="Quantum Hardware and Future", hours=7, topics=["Superconducting qubits, Ion traps", "Quantum supremacy", "Post-quantum cryptography implications"])
            ],
            course_outcomes=[
                CourseOutcome(code="CO1", description="Analyze quantum circuit topologies and evaluate potential speedups over classical algorithms", bloom_level="Analyze")
            ],
            textbooks=["Michael A. Nielsen and Isaac L. Chuang, Quantum Computation and Quantum Information, Cambridge University Press"]
        ),
        Course(
            code="PROJ601",
            title="Summer Internship / Industry Project Phase - I",
            category="PROJ",
            credits=4.0,
            lecture_hours=0,
            tutorial_hours=0,
            practical_hours=8,
            semester=6,
            description="6 to 8 weeks industrial internship or capstone phase I project work with an accredited corporate or research lab.",
            units=[
                Unit(unit_number=1, title="Industrial Problem Identification & Architecture", hours=12, topics=["Literature survey", "System requirements and architecture", "Progress review presentations"])
            ],
            course_outcomes=[
                CourseOutcome(code="CO1", description="Formulate engineering solutions adhering to commercial industry workflows and timelines", bloom_level="Create")
            ],
            textbooks=["AICTE Internship Policy Guidelines and Best Practices"]
        )
    ]
    semesters.append(Semester(semester_number=6, courses=sem6_courses, total_credits=sum(c.credits for c in sem6_courses)))

    # Semester 7 (Total: 19 Credits)
    sem7_courses = [
        Course(
            code="PEC701",
            title="Professional Elective - IV (Deep Learning & Computer Vision)",
            category="PEC",
            credits=3.0,
            lecture_hours=3,
            tutorial_hours=0,
            practical_hours=0,
            semester=7,
            description="CNN architectures (ResNet, EfficientNet), Object detection (YOLO, Faster R-CNN), Image segmentation, Vision Transformers (ViT).",
            units=[
                Unit(unit_number=1, title="Convolutional Foundations", hours=8, topics=["Convolution, pooling, stride, padding", "Batch normalization", "ResNet skip connections"]),
                Unit(unit_number=2, title="Object Detection & Segmentation", hours=9, topics=["Bounding box regression", "YOLO v8 architecture", "U-Net semantic segmentation"]),
                Unit(unit_number=3, title="Generative Vision & Transformers", hours=8, topics=["GANs, Diffusion models", "Vision Transformers (ViT)"])
            ],
            course_outcomes=[
                CourseOutcome(code="CO1", description="Design real-time computer vision models for detection and segmentation tasks", bloom_level="Create")
            ],
            textbooks=["Richard Szeliski, Computer Vision: Algorithms and Applications, Springer"]
        ),
        Course(
            code="PEC702",
            title="Professional Elective - V (Blockchain & Decentralized Applications)",
            category="PEC",
            credits=3.0,
            lecture_hours=3,
            tutorial_hours=0,
            practical_hours=0,
            semester=7,
            description="Distributed ledger technology, Consensus mechanisms (PoW, PoS, PBFT), Smart contracts (Solidity), Ethereum, DeFi.",
            units=[
                Unit(unit_number=1, title="Blockchain Architecture", hours=8, topics=["Hash chains, Merkle trees", "Bitcoin protocol, UTXO", "Proof of Work vs Proof of Stake"]),
                Unit(unit_number=2, title="Smart Contracts & Ethereum", hours=9, topics=["Ethereum Virtual Machine (EVM)", "Solidity language syntax", "Security vulnerabilities (reentrancy)"]),
                Unit(unit_number=3, title="Enterprise Blockchains & Web3", hours=8, topics=["Hyperledger Fabric", "Decentralized Identifiers (DIDs)", "Token standards (ERC-20, ERC-721)"])
            ],
            course_outcomes=[
                CourseOutcome(code="CO1", description="Deploy secure smart contracts on decentralized blockchain networks", bloom_level="Create")
            ],
            textbooks=["Arvind Narayanan et al., Bitcoin and Cryptocurrency Technologies, Princeton University Press"]
        ),
        Course(
            code="OEC701",
            title="Open Elective - II (Intellectual Property Rights & Patent Law)",
            category="OEC",
            credits=3.0,
            lecture_hours=3,
            tutorial_hours=0,
            practical_hours=0,
            semester=7,
            description="Patents, copyrights, trademarks, trade secrets, software patentability, international treaties (PCT, WIPO).",
            units=[
                Unit(unit_number=1, title="Overview of Intellectual Property", hours=8, topics=["Types of IP", "Patentability criteria (novelty, inventive step, industrial application)"]),
                Unit(unit_number=2, title="Patent Drafting and Filing", hours=8, topics=["Patent specifications and claims", "Indian Patent Office procedures", "PCT international filing"]),
                Unit(unit_number=3, title="Copyrights & Software Licensing", hours=8, topics=["Open source licenses (MIT, GPL, Apache)", "Software copyright protection", "Trade secret protection"])
            ],
            course_outcomes=[
                CourseOutcome(code="CO1", description="Evaluate patentability of software innovations and prepare disclosure filings", bloom_level="Evaluate")
            ],
            textbooks=["V.K. Ahuja, Law Relating to Intellectual Property Rights, LexisNexis"]
        ),
        Course(
            code="HSMC701",
            title="Management Principles & Entrepreneurship",
            category="HSMC",
            credits=3.0,
            lecture_hours=3,
            tutorial_hours=0,
            practical_hours=0,
            semester=7,
            description="Principles of management, marketing, startup lifecycle, venture capital funding, business model canvas.",
            units=[
                Unit(unit_number=1, title="Management Foundations", hours=8, topics=["Planning, organizing, staffing, directing, controlling", "Leadership styles"]),
                Unit(unit_number=2, title="Startup Formulation & Business Models", hours=9, topics=["Lean startup methodology", "Business Model Canvas (BMC)", "Market validation"]),
                Unit(unit_number=3, title="Venture Finance & Growth", hours=8, topics=["Seed rounds, Angel investors, VC funding", "Term sheets and valuation", "Exit strategies"])
            ],
            course_outcomes=[
                CourseOutcome(code="CO1", description="Develop scalable business plans and viable go-to-market strategies for tech startups", bloom_level="Create")
            ],
            textbooks=["Eric Ries, The Lean Startup, Crown Business"]
        ),
        Course(
            code="PROJ701",
            title="Major Project Phase - I (Capstone)",
            category="PROJ",
            credits=7.0,
            lecture_hours=0,
            tutorial_hours=0,
            practical_hours=14,
            semester=7,
            description="Major capstone team project: Problem formulation, literature analysis, design architecture, and mid-term alpha release.",
            units=[
                Unit(unit_number=1, title="System Design and Prototyping", hours=20, topics=["Architecture definition", "Database & API implementation", "Alpha testing demonstration"])
            ],
            course_outcomes=[
                CourseOutcome(code="CO1", description="Synthesize complex computer science concepts to solve open-ended multidisciplinary problems", bloom_level="Create")
            ],
            textbooks=["IEEE Standard 830: Recommended Practice for Software Requirements Specifications"]
        )
    ]
    semesters.append(Semester(semester_number=7, courses=sem7_courses, total_credits=sum(c.credits for c in sem7_courses)))

    # Semester 8 (Total: 18 Credits)
    sem8_courses = [
        Course(
            code="OEC801",
            title="Open Elective - III (Sustainable Engineering & Green Computing)",
            category="OEC",
            credits=3.0,
            lecture_hours=3,
            tutorial_hours=0,
            practical_hours=0,
            semester=8,
            description="Energy efficiency in data centers, carbon footprint calculation, algorithmic energy optimization, renewable-powered computing.",
            units=[
                Unit(unit_number=1, title="Green Computing Fundamentals", hours=8, topics=["Power Usage Effectiveness (PUE)", "Thermal management in server farms", "Carbon accounting"]),
                Unit(unit_number=2, title="Energy-Aware Software and Algorithms", hours=8, topics=["DVFS (Dynamic Voltage and Frequency Scaling)", "Energy-efficient scheduling", "Code optimization for battery longevity"]),
                Unit(unit_number=3, title="Circular Tech & Future Directions", hours=8, topics=["Hardware refurbishment", "Zero-waste tech lifecycles", "Green AI models"])
            ],
            course_outcomes=[
                CourseOutcome(code="CO1", description="Formulate sustainable, energy-efficient architectural patterns for high-scale computing infrastructures", bloom_level="Create")
            ],
            textbooks=["San Murugesan and G.R. Gangadharan, Harnessing Green IT: Principles and Practices, Wiley"]
        ),
        Course(
            code="PROJ801",
            title="Major Project Phase - II & Dissertation / Full Semester Industry Internship",
            category="PROJ",
            credits=15.0,
            lecture_hours=0,
            tutorial_hours=0,
            practical_hours=30,
            semester=8,
            description="Final capstone delivery: Full implementation, rigorous automated testing, deployment, peer-reviewed paper publication, and defense.",
            units=[
                Unit(unit_number=1, title="Implementation, Validation and Publication", hours=40, topics=["Full system integration", "Scalability and performance benchmarking", "Technical report and thesis preparation", "Viva voce defense"])
            ],
            course_outcomes=[
                CourseOutcome(code="CO1", description="Deploy industrial-grade software artifacts verified through rigorous empirical metrics", bloom_level="Create"),
                CourseOutcome(code="CO2", description="Defend technical discoveries through peer-reviewed manuscripts and formal presentations", bloom_level="Evaluate")
            ],
            textbooks=["AICTE Guidelines for Undergraduate Capstone Engineering Dissertations"]
        )
    ]
    semesters.append(Semester(semester_number=8, courses=sem8_courses, total_credits=sum(c.credits for c in sem8_courses)))

    total_credits = sum(s.total_credits for s in semesters)

    return Curriculum(
        id="aicte-model-cse-2024",
        title="AICTE Model Curriculum: B.Tech Computer Science & Engineering",
        degree="B.Tech",
        department="Computer Science & Engineering",
        regulation="AICTE NEP 2020 Framework",
        academic_year="2024-2025",
        university_id="aicte-central",
        university_name="All India Council for Technical Education (AICTE)",
        is_aicte_model=True,
        total_credits=total_credits,
        semesters=semesters
    )
