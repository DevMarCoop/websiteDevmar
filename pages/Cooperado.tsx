import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { User, Mail, Phone, MapPin, Heart, Code, Briefcase, MessageSquare, Loader2, CheckCircle, XCircle, LinkIcon, Github, ArrowRight, ArrowLeft } from 'lucide-react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import Button from '../components/Button';
import ScrollReveal from '../components/ScrollReveal';
import { useLanguage } from '../contexts/LanguageContext';
import { submitCooperadoForm, CooperadoFormData, verificarDuplicidade } from '../services/candidatosService';


const Cooperado: React.FC = () => {
  const { t } = useLanguage()
  const [formState, setFormState] = useState<CooperadoFormData>({
    nome_completo: '',
    email: '',
    whatsapp: '',
    estado: '',
    cidade: '',
    genero: '',
    genero_outro: '',
    faixa_etaria: '',
    area_interesse: '',
    metodologia_agil: '',
    situacao_atual: '',
    situacao_outro: '',
    formacao_academica: '',
    formacao_outro: '',
    nivel_profissional: '',
    stack_principal: '',
    nivel_ingles: '',
    nivel_espanhol: '',
    linkedin: '',
    github: '',
    portfolio: '',
    mensagem: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitError, setSubmitError] = useState<string>('');
  const [cidades, setCidades] = useState<string[]>([]);
  const [loadingCidades, setLoadingCidades] = useState(false);
  const [showTermScreen, setShowTermScreen] = useState(false);
  const [termAccepted, setTermAccepted] = useState(false);
  const [step, setStep] = useState(0);
  const [isValidatingStep, setIsValidatingStep] = useState(false);

  const TOTAL_STEPS = 3;

  useEffect(() => {
    if (!formState.estado) {
      setCidades([]);
      return;
    }

    const carregarCidades = async () => {
      setLoadingCidades(true);
      setCidades([]);

      try {
        const url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${formState.estado}/municipios`;
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`Erro na requisição: ${response.status}`);
        }

        const dados = await response.json();

        if (!Array.isArray(dados) || dados.length === 0) {
          throw new Error(`Nenhum dado retornado para ${formState.estado}`);
        }

        const cidadesOrdenadas = dados
          .map((municipio: any) => municipio.nome)
          .sort((a: string, b: string) => a.localeCompare(b));

        setCidades(cidadesOrdenadas);
        setFormState(prev => ({
          ...prev,
          cidade: ''
        }));

      } catch (error) {
        console.error(`❌ Erro ao buscar cidades para ${formState.estado}:`, error);
        setCidades([]);
      } finally {
        setLoadingCidades(false);
      }
    };

    carregarCidades();
  }, [formState.estado]);

  // ================= CONFIGURAÇÃO DE OPÇÕES PARA OS SELECTS =================

  const getSelectClassNames = (error?: string) => ({
    control: (state: any) => `w-full px-4 py-2.5 rounded-lg bg-brand-bg border transition-all cursor-pointer text-brand-blue ${
      error ? 'border-red-500' : 'border-brand-slate/20'
    } ${state.isFocused ? 'border-brand-red bg-white ring-2 ring-brand-red/20' : ''}`,
    menu: () => "bg-brand-bg mt-1 rounded-lg shadow-xl border border-brand-slate/20 z-50 overflow-hidden",
    menuList: () => "bg-brand-bg",
    option: (state: any) => `px-4 py-3 cursor-pointer transition-colors ${
      state.isSelected 
        ? 'bg-brand-red text-white' 
        : state.isFocused 
          ? 'bg-brand-slate/20 text-brand-blue' 
          : 'text-brand-blue'
    }`,
    singleValue: () => "text-brand-blue",
    placeholder: () => "text-gray-400 truncate",
  });

  const handleSelectChange = (fieldId: string) => (selectedOption: any) => {
    setFormState(prev => ({
      ...prev,
      [fieldId]: selectedOption ? selectedOption.value : ''
    }));
    
    if (errors[fieldId]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldId];
        return newErrors;
      });
    }
  };

  const estadosOptions = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
    'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
    'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
  ].map(estado => ({ value: estado, label: estado }));

  const cidadesOptions = cidades.map(cidade => ({ value: cidade, label: cidade }));

  const generoOptions = [
    { value: 'Masculino', label: t.cooperado.generoMasculino },
    { value: 'Feminino', label: t.cooperado.generoFeminino },
    { value: 'Não binário', label: t.cooperado.generoNaoBinario },
    { value: 'Outro', label: t.cooperado.generoOutro }
  ];

  const faixaEtariaOptions = [
    { value: '18-24', label: t.cooperado.faixaEtaria18a24 },
    { value: '25-34', label: t.cooperado.faixaEtaria25a34 },
    { value: '35-44', label: t.cooperado.faixaEtaria35a44 },
    { value: '45-54', label: t.cooperado.faixaEtaria45a54 },
    { value: '55+', label: t.cooperado.faixaEtaria55mais }
  ];

  const areaInteresse = [
    { value: 'Desenvolvimento Backend', key: 'areaIntBackend' },
    { value: 'Desenvolvimento Frontend', key: 'areaIntFrontend' },
    { value: 'Desenvolvimento Full Stack', key: 'areaIntFullStack' },
    { value: 'Desenvolvimento Mobile', key: 'areaIntMobile' },
    { value: 'Ciência de Dados', key: 'areaIntDataScience' },
    { value: 'Engenharia de Dados', key: 'areaIntDataEngineering' },
    { value: 'Inteligência Artificial / Machine Learning', key: 'areaIntAI' },
    { value: 'DevOps', key: 'areaIntDevOps' },
    { value: 'Cloud Computing', key: 'areaIntCloud' },
    { value: 'Segurança da Informação', key: 'areaIntSecurity' },
    { value: 'Infraestrutura e Redes', key: 'areaIntInfra' },
    { value: 'QA / Testes de Software', key: 'areaIntQA' },
    { value: 'UX/UI Design', key: 'areaIntUX' },
    { value: 'Gestão de Projetos', key: 'areaIntPM' },
    { value: 'Product Management', key: 'areaIntProduct' },
    { value: 'Desenvolvimento de Jogos', key: 'areaIntGames' },
    { value: 'Banco de Dados', key: 'areaIntDB' },
    { value: 'Suporte Técnico', key: 'areaIntSupport' }
  ];
  
  const areaInteresseOptions = areaInteresse.map(opt => ({
    value: opt.value,
    label: t.cooperado[opt.key]
  }));

  const metodologiasOptions = [
    { value: 'Scrum', key: 'metScrum' },
    { value: 'Kanban', key: 'metKanban' },
    { value: 'Ambos', key: 'metAmbos' },
    { value: 'Nenhum', key: 'metNenhum' },
  ].map(opt => ({ value: opt.value, label: t.cooperado[opt.key] }));

  const situacaoProfissionalOptions = [
    { value: 'Empregado (CLT)', key: 'sitCLT' },
    { value: 'Atuando como PJ / Freelancer', key: 'sitPJ' },
    { value: 'Desempregado (em busca de oportunidades)', key: 'sitDesempregado' },
    { value: 'Estudante (sem vínculo empregatício atual)', key: 'sitEstudante' },
    { value: 'Servidor Público', key: 'sitServidor' },
    { value: 'Outro', key: 'sitOutro' },
  ].map(opt => ({ value: opt.value, label: t.cooperado[opt.key] }));

  const formacaoAcademicaOptions = [
    { value: 'Ensino Superior Completo na área de Tecnologia (Bacharelado, Licenciatura ou Tecnólogo)', key: 'formSupCompleto' },
    { value: 'Ensino Superior Cursando na área de Tecnologia', key: 'formSupCursando' },
    { value: 'Curso Técnico Completo na área de Tecnologia', key: 'formTecCompleto' },
    { value: 'Curso Técnico Cursando na área de Tecnologia', key: 'formTecCursando' },
    { value: 'Formação Superior Completa em outras áreas (em transição de carreira para TI)', key: 'formTransicao' },
    { value: 'Estudante autodidata / Cursos livres e Bootcamps (sem formação acadêmica formal)', key: 'formAutodidata' },
  ].map(opt => ({ value: opt.value, label: t.cooperado[opt.key] }));

  const senioridadeOptions = [
    { value: 'Trainee', key: 'senTrainee' },
    { value: 'Júnior', key: 'senJunior' },
    { value: 'Pleno', key: 'senPleno' },
    { value: 'Sênior', key: 'senSenior' },
    { value: 'Especialista', key: 'senEspecialista' },
  ].map(opt => ({ value: opt.value, label: t.cooperado[opt.key] }));

  const nivelIdiomaOptions = [
    { value: 'Nulo', key: 'nivelNulo' },
    { value: 'Básico', key: 'nivelBasico' },
    { value: 'Intermediário', key: 'nivelIntermediario' },
    { value: 'Avançado', key: 'nivelAvancado' },
    { value: 'Nativo', key: 'nivelNativo' },
  ].map(opt => ({ value: opt.value, label: t.cooperado[opt.key] }));

  const techStackCategories = {
    'Linguagens de Programação': [
      'JavaScript', 'TypeScript', 'Python', 'Java', 'C#', 'C++', 'C', 'Go', 'Rust',
      'Ruby', 'PHP', 'Swift', 'Kotlin', 'R', 'Dart', 'SQL', 'Bash/Shell', 'Perl',
      'Scala', 'Haskell', 'Elixir', 'Clojure', 'Lua', 'Objective-C', 'Assembly',
      'Julia', 'Zig', 'F#', 'Groovy', 'VB.NET', 'MATLAB', 'COBOL', 'Fortran'
    ],
    'Frontend & Frameworks': [
      'React', 'Angular', 'Vue.js', 'Svelte', 'Next.js', 'Nuxt.js', 'Gatsby',
      'Astro', 'Remix', 'Solid.js', 'Alpine.js', 'jQuery', 'HTML5', 'CSS3',
      'Tailwind CSS', 'Bootstrap', 'Bulma', 'Sass', 'Less', 'Material UI',
      'Chakra UI', 'Ant Design', 'Styled Components', 'Redux', 'Zustand',
      'Webpack', 'Vite', 'Rollup', 'Babel', 'Storybook'
    ],
    'Mobile & Desktop': [
      'React Native', 'Flutter', 'Ionic', 'Xamarin', '.NET MAUI', 'SwiftUI',
      'Jetpack Compose', 'NativeScript', 'Expo', 'Electron', 'Tauri'
    ],
    'Backend & APIs': [
      'Node.js', 'Express', 'NestJS', 'Fastify', 'Koa', 'Hapi', 'Django',
      'Flask', 'FastAPI', 'Spring Boot', 'Spring', '.NET', 'ASP.NET Core',
      'Laravel', 'Symfony', 'Ruby on Rails', 'Phoenix', 'AdonisJS', 'Gin',
      'Actix', 'Ktor', 'GraphQL', 'REST APIs', 'gRPC', 'tRPC', 'WebSockets', 'SOAP'
    ],
    'Bancos de Dados': [
      'PostgreSQL', 'MySQL', 'MariaDB', 'Oracle', 'SQL Server', 'SQLite',
      'MongoDB', 'Redis', 'Elasticsearch', 'Cassandra', 'DynamoDB', 'Neo4j',
      'InfluxDB', 'TimescaleDB', 'CockroachDB', 'ClickHouse', 'RavenDB',
      'CouchDB', 'Memcached', 'PlanetScale'
    ],
    'ORMs & BaaS': [
      'Prisma', 'TypeORM', 'Sequelize', 'Django ORM', 'Hibernate',
      'SQLAlchemy', 'Firebase', 'Supabase', 'AWS Amplify', 'Parse', 'Strapi',
      'Sanity', 'Appwrite'
    ],
    'Data Science, Big Data & IA': [
      'Pandas', 'NumPy', 'Scikit-learn', 'TensorFlow', 'Keras', 'PyTorch',
      'JAX', 'Apache Spark', 'Hadoop', 'Apache Kafka', 'Apache Airflow',
      'Tableau', 'Power BI', 'Databricks', 'Snowflake', 'BigQuery', 'Redshift',
      'Jupyter', 'OpenCV', 'Hugging Face', 'LangChain', 'MLflow', 'spaCy',
      'Ray', 'dbt', 'RabbitMQ', 'Celery'
    ],
    'DevOps, Cloud & Infra': [
      'Docker', 'Kubernetes', 'Helm', 'AWS', 'Microsoft Azure',
      'Google Cloud (GCP)', 'IBM Cloud', 'Oracle Cloud', 'DigitalOcean',
      'Heroku', 'Vercel', 'Netlify', 'Cloudflare', 'Render', 'Railway',
      'Git', 'GitHub Actions', 'GitLab CI/CD', 'Jenkins', 'CircleCI',
      'Terraform', 'Pulumi', 'Ansible', 'Chef', 'Puppet', 'Vagrant',
      'Linux', 'Unix', 'Windows Server', 'Nginx', 'Apache', 'Traefik', 'Istio'
    ],
    'Monitoramento & Observabilidade': [
      'Prometheus', 'Grafana', 'Datadog', 'New Relic', 'Sentry', 'Logstash',
      'Kibana', 'Splunk', 'OpenTelemetry', 'ELK', 'Zabbix', 'Nagios'
    ],
    'Testes & QA': [
      'Jest', 'Vitest', 'Cypress', 'Selenium', 'Puppeteer', 'Playwright',
      'Mocha', 'Chai', 'JUnit', 'PyTest', 'Postman', 'Swagger/OpenAPI',
      'Testing Library', 'TestCafe', 'k6', 'JMeter', 'Detox'
    ],
    'Design, UI/UX & Audiovisual': [
      'Figma', 'Adobe Photoshop', 'Adobe Illustrator', 'Adobe XD',
      'Adobe Premiere Pro', 'Adobe After Effects', 'Sketch', 'CorelDRAW',
      'Canva', 'InVision', 'Zeplin'
    ],
    'Game Dev & 3D/Engenharia': [
      'Unity', 'Unreal Engine', 'Godot', 'Blender', 'Maya', '3ds Max',
      'AutoCAD', 'SolidWorks', 'Revit', 'SketchUp', 'ZBrush'
    ],
    'Blockchain & Web3': [
      'Solidity', 'Web3.js', 'Ethers.js', 'Hardhat', 'Smart Contracts',
      'Ethereum', 'Solana', 'Polygon', 'Chainlink', 'IPFS', 'Foundry',
      'Wagmi', 'Truffle'
    ],
    'Segurança': [
      'OAuth', 'JWT', 'SAML', 'OWASP', 'Burp Suite', 'Metasploit', 'Vault',
      'Penetration Testing'
    ],
    'Ferramentas, Produtividade & Gestão': [
      'VIM', 'Neovim', 'VS Code', 'IntelliJ IDEA', 'Eclipse',
      'Microsoft Excel', 'Microsoft Word', 'Microsoft PowerPoint',
      'Google Workspace', 'Notion', 'Trello', 'Jira', 'Asana', 'Linear',
      'Confluence', 'Slack', 'Microsoft Teams', 'Discord', 'SAP',
      'Salesforce', 'Zendesk', 'ERP', 'CRM'
    ]
  };

  // Dicionário de cores para cada categoria (usando Tailwind)
  const categoryStyles: Record<string, any> = {
    'Linguagens de Programação': { tagBg: 'bg-sky-400/10', tagBorder: 'border-sky-400/20', text: 'text-sky-400', hoverBg: 'hover:bg-sky-400', hoverText: 'hover:text-white' },
    'Frontend & Frameworks': { tagBg: 'bg-blue-400/10', tagBorder: 'border-blue-400/20', text: 'text-blue-400', hoverBg: 'hover:bg-blue-400', hoverText: 'hover:text-white' },
    'Mobile & Desktop': { tagBg: 'bg-cyan-400/10', tagBorder: 'border-cyan-400/20', text: 'text-cyan-400', hoverBg: 'hover:bg-cyan-400', hoverText: 'hover:text-white' },
    'Backend & APIs': { tagBg: 'bg-green-400/10', tagBorder: 'border-green-400/20', text: 'text-green-400', hoverBg: 'hover:bg-green-400', hoverText: 'hover:text-white' },
    'Bancos de Dados': { tagBg: 'bg-yellow-400/10', tagBorder: 'border-yellow-400/20', text: 'text-yellow-400', hoverBg: 'hover:bg-yellow-400', hoverText: 'hover:text-black' },
    'ORMs & BaaS': { tagBg: 'bg-orange-400/10', tagBorder: 'border-orange-400/20', text: 'text-orange-400', hoverBg: 'hover:bg-orange-400', hoverText: 'hover:text-white' },
    'Data Science, Big Data & IA': { tagBg: 'bg-purple-400/10', tagBorder: 'border-purple-400/20', text: 'text-purple-400', hoverBg: 'hover:bg-purple-400', hoverText: 'hover:text-white' },
    'DevOps, Cloud & Infra': { tagBg: 'bg-red-400/10', tagBorder: 'border-red-400/20', text: 'text-red-400', hoverBg: 'hover:bg-red-400', hoverText: 'hover:text-white' },
    'Monitoramento & Observabilidade': { tagBg: 'bg-rose-400/10', tagBorder: 'border-rose-400/20', text: 'text-rose-400', hoverBg: 'hover:bg-rose-400', hoverText: 'hover:text-white' },
    'Testes & QA': { tagBg: 'bg-teal-400/10', tagBorder: 'border-teal-400/20', text: 'text-teal-400', hoverBg: 'hover:bg-teal-400', hoverText: 'hover:text-white' },
    'Design, UI/UX & Audiovisual': { tagBg: 'bg-fuchsia-400/10', tagBorder: 'border-fuchsia-400/20', text: 'text-fuchsia-400', hoverBg: 'hover:bg-fuchsia-400', hoverText: 'hover:text-white' },
    'Game Dev & 3D/Engenharia': { tagBg: 'bg-indigo-400/10', tagBorder: 'border-indigo-400/20', text: 'text-indigo-400', hoverBg: 'hover:bg-indigo-400', hoverText: 'hover:text-white' },
    'Blockchain & Web3': { tagBg: 'bg-emerald-400/10', tagBorder: 'border-emerald-400/20', text: 'text-emerald-400', hoverBg: 'hover:bg-emerald-400', hoverText: 'hover:text-white' },
    'Segurança': { tagBg: 'bg-zinc-400/10', tagBorder: 'border-zinc-400/20', text: 'text-zinc-400', hoverBg: 'hover:bg-zinc-400', hoverText: 'hover:text-black' },
    'Ferramentas, Produtividade & Gestão': { tagBg: 'bg-amber-400/10', tagBorder: 'border-amber-400/20', text: 'text-amber-400', hoverBg: 'hover:bg-amber-400', hoverText: 'hover:text-black' }
  };

  // Transforma o objeto num array contínuo, injetando as cores junto de cada tecnologia
  const techStackOptions = Object.entries(techStackCategories).flatMap(([category, techs]) => {
    const style = categoryStyles[category];
    return techs.map(tech => ({
      value: tech,
      label: tech,
      category: category,
      style: style // Salva a cor exata dentro do item
    }));
  }).sort((a, b) => a.label.localeCompare(b.label));

  // ============================================================================

  const stepTitles = [t.cooperado.stepPersonal, t.cooperado.stepWork, t.cooperado.stepTechnical];

  const validateStep = (stepIndex: number): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (stepIndex === 0) {
      if (!formState.nome_completo || formState.nome_completo.trim().split(/\s+/).length < 2) {
        newErrors.nome_completo = t.cooperado.errorNomeCompleto;
      }
      if (!formState.email) {
        newErrors.email = t.cooperado.errorEmail;
      }
      const wppClean = formState.whatsapp ? formState.whatsapp.replace(/\D/g, '') : '';

      if (!wppClean || wppClean === '55') {
        newErrors.whatsapp = t.cooperado.errorWhatsapp;
      } else if (wppClean.startsWith('55')) {
        // Exige 12 ou 13 dígitos (55 + DDD + 8 ou 9 dígitos do número)
        if (wppClean.length < 12 || wppClean.length > 13) {
          newErrors.whatsapp = t.cooperado.errorWhatsappInvalid;
        }
      } else {
        // Regra genérica para outros países
        if (wppClean.length < 8 || wppClean.length > 15) {
          newErrors.whatsapp = t.cooperado.errorWhatsappIntl;
        }
      }
      if (!formState.estado) {
        newErrors.estado = t.cooperado.errorEstado;
      }
      if (!formState.cidade) {
        newErrors.cidade = t.cooperado.errorCidade;
      }
      if (!formState.genero) {
        newErrors.genero = t.cooperado.errorGenero;
      }
      if (formState.genero === 'Outro' && !formState.genero_outro) {
        newErrors.genero_outro = t.cooperado.errorGeneroOutro;
      }
      if (!formState.faixa_etaria) {
        newErrors.faixa_etaria = t.cooperado.errorFaixaEtaria;
      }
    } else if (stepIndex === 1) {
      if (!formState.area_interesse) {
        newErrors.area_interesse = t.cooperado.errorareaInteresse;
      }
      if (!formState.metodologia_agil) {
        newErrors.metodologia_agil = t.cooperado.errorMetodologias;
      }
      if (!formState.situacao_atual) {
        newErrors.situacao_atual = t.cooperado.errorSituacao;
      }
      if (formState.situacao_atual === 'Outro' && !formState.situacao_outro) {
        newErrors.situacao_outro = t.cooperado.errorSituacaoOutro;
      }
      if (!formState.formacao_academica) {
        newErrors.formacao_academica = t.cooperado.errorFormacao;
      }
      if (!formState.nivel_profissional) {
        newErrors.nivel_profissional = t.cooperado.errorSenioridade;
      }
    } else if (stepIndex === 2) {
      const selectedTechs = formState.stack_principal ? formState.stack_principal.split(', ') : [];

      if (selectedTechs.length < 3) {
        newErrors.stack_principal = t.cooperado.errorStackMin;
      }
      if (!formState.nivel_ingles) {
        newErrors.nivel_ingles = t.cooperado.errorIngles;
      }
      if (!formState.nivel_espanhol) {
        newErrors.nivel_espanhol = t.cooperado.errorEspanhol;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [id]: value
    }));

    if (errors[id]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[id];
        return newErrors;
      });
    }

    if (id === 'email' && submitError) {
      setSubmitError('');
      setSubmitStatus('idle');
    }
  };

  const handlePhoneChange = (value: string) => {
    setFormState(prev => ({
      ...prev,
      whatsapp: value
    }));
    if (errors.whatsapp) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.whatsapp;
        return newErrors;
      });
    }
    if (submitError) {
      setSubmitError('');
      setSubmitStatus('idle');
    }
  };

  const handleNext = async () => {
    if (validateStep(step)) {
      if (step === 0) {
        setIsValidatingStep(true);
        try {
          const { emailExists, whatsappExists } = await verificarDuplicidade(formState.email, formState.whatsapp);
          
          if (emailExists || whatsappExists) {
            const newErrors = { ...errors };
            if (emailExists) {
              newErrors.email = t.cooperado.errorEmailDuplicated;
            }
            if (whatsappExists) {
              newErrors.whatsapp = t.cooperado.errorWhatsappDuplicated;
            }
            setErrors(newErrors);
            setIsValidatingStep(false);
            return;
          }
        } catch (error) {
          console.error("Erro ao validar duplicidade:", error);
        }
        setIsValidatingStep(false);
      }

      setStep(s => s + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (step < TOTAL_STEPS - 1) {
      await handleNext();
      return;
    }

    if (!validateStep(TOTAL_STEPS - 1)) {
      return;
    }

    setShowTermScreen(true);
    setTermAccepted(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setStep(s => Math.max(0, s - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleConfirmTerm = async () => {
    if (!termAccepted) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      await submitCooperadoForm(formState);
      setSubmitStatus('success');
      setShowTermScreen(false);
      setStep(0);
      setFormState({
        nome_completo: '',
        email: '',
        whatsapp: '',
        estado: '',
        cidade: '',
        genero: '',
        genero_outro: '',
        faixa_etaria: '',
        area_interesse: '',
        metodologia_agil: '',
        situacao_atual: '', 
        formacao_academica: '',
        formacao_outro: '',
        nivel_profissional: '',
        stack_principal: '',
        nivel_ingles: '',
        nivel_espanhol: '',
        linkedin: '',
        github: '',
        portfolio: '',
        mensagem: '',
      });
    } catch (error) {
      console.error('Erro ao enviar:', error);
      const errorMessage = error instanceof Error ? error.message : 'Ocorreu um erro ao enviar o formulário.';
      setSubmitError(errorMessage);
      setSubmitStatus('error');

      if (errorMessage.includes('email')) {
        setErrors(prev => ({ ...prev, email: errorMessage }));
      } else if (errorMessage.includes('WhatsApp') || errorMessage.includes('whatsapp')) {
        setErrors(prev => ({ ...prev, whatsapp: errorMessage }));
      }

      setTimeout(() => setSubmitStatus('idle'), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setSubmitStatus('idle');
    setSubmitError('');
    setShowTermScreen(false);
    setTermAccepted(false);
    setStep(0);
  };

  const handleBackToForm = () => {
    setShowTermScreen(false);
    setTermAccepted(false);
  };

  return (
    <div className="w-full bg-brand-bg min-h-[calc(100vh-80px)]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {submitStatus === 'success' ? (
          <ScrollReveal>
            <div className="space-y-8">
              <div className="text-center mb-12">
                <div className="flex justify-center mb-6">
                  <div className="bg-green-100 p-4 rounded-full">
                    <CheckCircle className="h-12 w-12 text-green-600" />
                  </div>
                </div>
                <h1 className="text-4xl md:text-5xl font-display font-bold text-brand-blue mb-4">
                  {t.cooperado.successTitle}
                </h1>
                <p className="text-brand-slate text-lg max-w-2xl mx-auto">
                  {t.cooperado.nextStepsDesc}
                </p>
              </div>

              <div className="bg-white p-8 md:p-10 rounded-2xl shadow-lg border-t-4 border-brand-red space-y-6">
                <div className="space-y-4">
                  <h2 className="text-2xl font-display font-bold text-brand-blue flex items-center gap-3">
                    <Heart className="h-6 w-6 text-brand-red" />
                    {t.cooperado.nextStepsTitle}
                  </h2>
                  <p className="text-brand-slate leading-relaxed">
                    {t.cooperado.nextStepsDesc}
                  </p>
                </div>

                <div className="space-y-4 pt-4 border-t border-brand-slate/20">
                  <h2 className="text-2xl font-display font-bold text-brand-blue flex items-center gap-3">
                    <Code className="h-6 w-6 text-brand-red" />
                    {t.cooperado.studyTitle}
                  </h2>
                  <p className="text-brand-slate leading-relaxed">
                    {t.cooperado.studyDesc}
                  </p>
                  <ul className="space-y-3 ml-4">
                    <li className="text-brand-slate flex gap-3">
                      <span className="text-brand-red font-bold">•</span>
                      <span>
                        <a href="https://capacita.coop.br/cursos-whatsapp/fundamentos-do-cooperativismo" target="_blank" rel="noopener noreferrer" className="text-brand-red hover:text-brand-red/80 font-medium underline">
                          {t.cooperado.course1}
                        </a>
                      </span>
                    </li>
                    <li className="text-brand-slate flex gap-3">
                      <span className="text-brand-red font-bold">•</span>
                      <span>
                        <a href="https://capacita.coop.br/cursos-studion/cooperativismo-primeiras-licoes" target="_blank" rel="noopener noreferrer" className="text-brand-red hover:text-brand-red/80 font-medium underline">
                          {t.cooperado.course2}
                        </a>
                      </span>
                    </li>
                  </ul>
                  <p className="text-brand-slate leading-relaxed pt-2">
                    {t.cooperado.studyTip}
                  </p>
                </div>

                <div className="space-y-4 pt-4 border-t border-brand-slate/20">
                  <h2 className="text-2xl font-display font-bold text-brand-blue flex items-center gap-3">
                    <MessageSquare className="h-6 w-6 text-brand-red" />
                    {t.cooperado.termTitle}
                  </h2>
                  <div className="bg-brand-bg p-6 rounded-lg border border-brand-slate/20 space-y-3">
                    <p className="text-brand-slate leading-relaxed">
                      <span className="text-brand-red font-bold">*</span> {t.cooperado.termText1}
                    </p>
                    <p className="text-brand-slate leading-relaxed">
                      {t.cooperado.termText2}
                    </p>
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-brand-slate/20">
                  <h3 className="text-lg font-display font-bold text-brand-blue flex items-center gap-3">
                    <LinkIcon className="h-5 w-5 text-brand-red" />
                    Links Úteis
                  </h3>
                  <div className="space-y-2">
                    <a href="https://capacita.coop.br/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-brand-red hover:text-brand-red/80 font-medium underline">
                      <LinkIcon className="h-4 w-4" /> capacita.coop.br
                    </a>
                    <a href="https://capacita.coop.br/cursos-whatsapp/fundamentos-do-cooperativismo" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-brand-red hover:text-brand-red/80 font-medium underline">
                      <LinkIcon className="h-4 w-4" /> {t.cooperado.course1}
                    </a>
                    <a href="https://capacita.coop.br/cursos-studion/cooperativismo-primeiras-licoes" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-brand-red hover:text-brand-red/80 font-medium underline">
                      <LinkIcon className="h-4 w-4" /> {t.cooperado.course2}
                    </a>
                  </div>
                </div>

                <div className="pt-6 border-t border-brand-slate/20">
                  <Button type="button" variant="primary" className="w-full justify-center text-lg py-4" onClick={handleResetForm}>
                    {t.cooperado.btnBack}
                  </Button>
                </div>
              </div>
            </div>
          </ScrollReveal>
        ) : showTermScreen ? (
          <ScrollReveal>
            <div className="space-y-8">
              <div className="text-center mb-12">
                <div className="flex justify-center mb-6">
                  <div className="bg-blue-100 p-4 rounded-full">
                    <MessageSquare className="h-12 w-12 text-blue-600" />
                  </div>
                </div>
                <h1 className="text-4xl md:text-5xl font-display font-bold text-brand-blue mb-4">
                  {t.cooperado.termTitle}
                </h1>
                <p className="text-brand-slate text-lg max-w-2xl mx-auto">
                  Por favor, leia e aceite o termo abaixo para continuar com sua inscrição.
                </p>
              </div>

              <div className="bg-white p-8 md:p-10 rounded-2xl shadow-lg border-t-4 border-brand-red space-y-6">
                <div className="space-y-4">
                  <h2 className="text-2xl font-display font-bold text-brand-blue flex items-center gap-3">
                    <Heart className="h-6 w-6 text-brand-red" />
                    {t.cooperado.nextStepsTitle}
                  </h2>
                  <p className="text-brand-slate leading-relaxed">
                    Na DEVMAR, não existem 'empregados' ou 'chefes', mas sim cooperados que atuam de forma horizontal como donos do próprio negócio.
                  </p>
                </div>

                <div className="space-y-4 pt-4 border-t border-brand-slate/20">
                  <h2 className="text-2xl font-display font-bold text-brand-blue flex items-center gap-3">
                    <Code className="h-6 w-6 text-brand-red" />
                    {t.cooperado.studyTitle}
                  </h2>
                  <p className="text-brand-slate leading-relaxed">
                    {t.cooperado.studyDesc}
                  </p>
                  <ul className="space-y-3 ml-4">
                    <li className="text-brand-slate flex gap-3">
                      <span className="text-brand-red font-bold">•</span>
                      <span>
                        <a href="https://capacita.coop.br/cursos-whatsapp/fundamentos-do-cooperativismo" target="_blank" rel="noopener noreferrer" className="text-brand-red hover:text-brand-red/80 font-medium underline">
                          {t.cooperado.course1}
                        </a>
                      </span>
                    </li>
                    <li className="text-brand-slate flex gap-3">
                      <span className="text-brand-red font-bold">•</span>
                      <span>
                        <a href="https://capacita.coop.br/cursos-studion/cooperativismo-primeiras-licoes" target="_blank" rel="noopener noreferrer" className="text-brand-red hover:text-brand-red/80 font-medium underline">
                          {t.cooperado.course2}
                        </a>
                      </span>
                    </li>
                  </ul>
                  <p className="text-brand-slate leading-relaxed pt-2">
                    {t.cooperado.studyTip}
                  </p>
                </div>

                <div className="space-y-4 pt-4 border-t border-brand-slate/20">
                  <h2 className="text-2xl font-display font-bold text-brand-blue flex items-center gap-3">
                    <MessageSquare className="h-6 w-6 text-brand-red" />
                    {t.cooperado.termTitle}
                  </h2>
                  <div className="space-y-4 bg-slate-900 p-6 rounded-lg border border-slate-700">
                    <p className="text-white leading-relaxed">
                      <span className="text-brand-red font-bold">*</span> {t.cooperado.termText1}
                    </p>
                    <p className="text-white leading-relaxed">
                      {t.cooperado.termText2}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-6 bg-slate-900 rounded-lg border border-slate-700 pt-6 border-t border-brand-slate/20">
                  <input
                    type="checkbox"
                    id="termAcceptance"
                    checked={termAccepted}
                    onChange={(e) => setTermAccepted(e.target.checked)}
                    className="w-6 h-6 mt-1 accent-brand-red cursor-pointer"
                  />
                  <label htmlFor="termAcceptance" className="text-white leading-relaxed cursor-pointer">
                    <span className="font-semibold text-white">{t.cooperado.termAcceptLabel}</span>
                    <p className="text-sm mt-2 text-gray-300">{t.cooperado.termAcceptDesc}</p>
                  </label>
                </div>

                <div className="flex flex-col md:flex-row gap-4 pt-6 border-t border-brand-slate/20">
                  <Button type="button" variant="secondary" className="w-full justify-center text-lg py-4" onClick={handleBackToForm}>
                    {t.cooperado.btnBack}
                  </Button>
                  <Button type="button" variant="primary" className="w-full justify-center text-lg py-4" onClick={handleConfirmTerm} disabled={!termAccepted || isSubmitting}>
                    {isSubmitting ? (
                      <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> {t.cooperado.btnSending}</>
                    ) : (
                      <>{t.cooperado.btnConfirm}</>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </ScrollReveal>
        ) : (
          <>
            <div className="text-center mb-12">
              <ScrollReveal>
                <h1 className="text-4xl md:text-5xl font-display font-bold text-brand-blue mb-4">
                  {t.cooperado?.title || 'Quero ser Cooperado'}
                </h1>
                <p className="text-brand-slate text-lg max-w-2xl mx-auto">
                  {t.cooperado?.subtitle || 'Junte-se à DevMar e faça parte de uma cooperativa de tecnologia inovadora.'}
                </p>
              </ScrollReveal>
            </div>

            <ScrollReveal delay={0.2}>
              <div className="bg-white p-8 md:p-10 rounded-2xl shadow-lg border-t-4 border-brand-red">
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-brand-red">
                      {t.cooperado.stepIndicator.replace('{current}', String(step + 1)).replace('{total}', String(TOTAL_STEPS))}
                    </span>
                    <span className="text-sm font-medium text-brand-slate">{stepTitles[step]}</span>
                  </div>
                  <div className="flex space-x-2">
                    {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
                      <div
                        key={i}
                        className={`flex-1 h-2 rounded-full transition-colors ${i <= step ? 'bg-brand-red' : 'bg-brand-slate/20'}`}
                      />
                    ))}
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* ===================== ETAPA 1 ===================== */}
                  {step === 0 && (
                    <>
                      <div>
                        <label htmlFor="nome_completo" className="flex items-center gap-2 text-sm font-medium text-brand-slate mb-2">
                          <User className="h-4 w-4" />
                          {t.cooperado.nameLabel} <span className="text-brand-red">*</span>
                        </label>
                        <input
                          type="text"
                          id="nome_completo"
                          className={`w-full px-4 py-3 rounded-lg bg-brand-bg border ${errors.nome_completo ? 'border-red-500' : 'border-brand-slate/20'} focus:border-brand-red focus:bg-white focus:ring-2 focus:ring-brand-red/20 transition-all text-brand-blue`}
                          placeholder={t.cooperado.namePlaceholder}
                          value={formState.nome_completo}
                          onChange={handleChange}
                        />
                        {errors.nome_completo && <p className="text-red-500 text-sm mt-1">{errors.nome_completo}</p>}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="email" className="flex items-center gap-2 text-sm font-medium text-brand-slate mb-2">
                            <Mail className="h-4 w-4" />
                            {t.cooperado.emailLabel} <span className="text-brand-red">*</span>
                          </label>
                          <input
                            type="email"
                            id="email"
                            className={`w-full px-4 py-3 rounded-lg bg-brand-bg border ${errors.email ? 'border-red-500' : 'border-brand-slate/20'} focus:border-brand-red focus:bg-white focus:ring-2 focus:ring-brand-red/20 transition-all text-brand-blue`}
                            placeholder={t.cooperado.emailPlaceholder}
                            value={formState.email}
                            onChange={handleChange}
                          />
                          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                        </div>
                        <div>
                          <label htmlFor="whatsapp" className="flex items-center gap-2 text-sm font-medium text-brand-slate mb-2">
                            <Phone className="h-4 w-4" />
                            {t.cooperado.whatsappLabel} <span className="text-brand-red">*</span>
                          </label>
                          <div className={`rounded-lg border ${errors.whatsapp ? 'border-red-500' : 'border-brand-slate/20'} transition-all`}>
                            <PhoneInput
                              country={'br'}
                              value={formState.whatsapp}
                              onChange={handlePhoneChange}
                              placeholder=""
                              inputProps={{ id: 'whatsapp', name: 'whatsapp', required: true }}
                              containerClass="phone-input-container"
                              inputClass="w-full text-brand-blue"
                              buttonClass="phone-input-button"
                              dropdownClass="phone-input-dropdown"
                            />
                          </div>
                          {errors.whatsapp && <p className="text-red-500 text-sm mt-1">{errors.whatsapp}</p>}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="estado" className="flex items-center gap-2 text-sm font-medium text-brand-slate mb-2">
                            <MapPin className="h-4 w-4" />
                            {t.cooperado.estadoLabel} <span className="text-brand-red">*</span>
                          </label>
                          <Select
                            id="estado"
                            options={estadosOptions}
                            value={estadosOptions.find(opt => opt.value === formState.estado) || null}
                            placeholder={t.cooperado.estadoPlaceholder}
                            maxMenuHeight={220}
                            unstyled
                            onChange={handleSelectChange('estado')}
                            classNames={getSelectClassNames(errors.estado)}
                          />
                          {errors.estado && <p className="text-red-500 text-sm mt-1">{errors.estado}</p>}
                        </div>
                        <div>
                          <label htmlFor="cidade" className="flex items-center gap-2 text-sm font-medium text-brand-slate mb-2">
                            <MapPin className="h-4 w-4" />
                            {t.cooperado.cidadeLabel} <span className="text-brand-red">*</span>
                          </label>
                          <Select
                            id="cidade"
                            options={cidadesOptions}
                            value={cidadesOptions.find(opt => opt.value === formState.cidade) || null}
                            placeholder={!formState.estado ? t.cooperado.cidadeSelectStateFirst : loadingCidades ? t.cooperado.cidadeLoading : t.cooperado.cidadePlaceholder}
                            maxMenuHeight={220}
                            unstyled
                            isDisabled={!formState.estado || loadingCidades}
                            onChange={handleSelectChange('cidade')}
                            classNames={getSelectClassNames(errors.cidade)}
                          />
                          {errors.cidade && <p className="text-red-500 text-sm mt-1">{errors.cidade}</p>}
                        </div>
                      </div>

                      <div>
                        <label htmlFor="genero" className="flex items-center gap-2 text-sm font-medium text-brand-slate mb-2">
                          <Heart className="h-4 w-4" />
                          {t.cooperado.generoLabel} <span className="text-brand-red">*</span>
                        </label>
                        <Select
                          id="genero"
                          options={generoOptions}
                          value={generoOptions.find(opt => opt.value === formState.genero) || null}
                          placeholder={t.cooperado.generoPlaceholder}
                          maxMenuHeight={220}
                          unstyled
                          onChange={handleSelectChange('genero')}
                          classNames={getSelectClassNames(errors.genero)}
                        />
                        {errors.genero && <p className="text-red-500 text-sm mt-1">{errors.genero}</p>}
                      </div>

                      {formState.genero === 'Outro' && (
                        <div>
                          <label htmlFor="genero_outro" className="flex items-center gap-2 text-sm font-medium text-brand-slate mb-2">
                            {t.cooperado.generoOutroLabel} <span className="text-brand-red">*</span>
                          </label>
                          <input
                            type="text"
                            id="genero_outro"
                            className={`w-full px-4 py-3 rounded-lg bg-brand-bg border ${errors.genero_outro ? 'border-red-500' : 'border-brand-slate/20'} focus:border-brand-red focus:bg-white focus:ring-2 focus:ring-brand-red/20 transition-all text-brand-blue`}
                            placeholder={t.cooperado.generoOutroLabel}
                            value={formState.genero_outro || ''}
                            onChange={handleChange}
                          />
                          {errors.genero_outro && <p className="text-red-500 text-sm mt-1">{errors.genero_outro}</p>}
                        </div>
                      )}

                      <div>
                        <label htmlFor="faixa_etaria" className="flex items-center gap-2 text-sm font-medium text-brand-slate mb-2">
                          {t.cooperado.faixaEtariaLabel} <span className="text-brand-red">*</span>
                        </label>
                        <Select
                          id="faixa_etaria"
                          options={faixaEtariaOptions}
                          value={faixaEtariaOptions.find(opt => opt.value === formState.faixa_etaria) || null}
                          placeholder={t.cooperado.faixaEtariaPlaceholder}
                          maxMenuHeight={220}
                          unstyled
                          onChange={handleSelectChange('faixa_etaria')}
                          classNames={getSelectClassNames(errors.faixa_etaria)}
                        />
                        {errors.faixa_etaria && <p className="text-red-500 text-sm mt-1">{errors.faixa_etaria}</p>}
                      </div>
                    </>
                  )}

                  {/* ===================== ETAPA 2 ===================== */}
                  {step === 1 && (
                    <>
                      <div>
                        <label htmlFor="area_interesse" className="flex items-center gap-2 text-sm font-medium text-brand-slate mb-2">
                          <Code className="h-4 w-4" />
                          {t.cooperado.areaInteresseLabel} <span className="text-brand-red">*</span>
                        </label>
                        <Select
                          id="area_interesse"
                          options={areaInteresseOptions}
                          value={areaInteresseOptions.find(opt => opt.value === formState.area_interesse) || null}
                          placeholder={t.cooperado.areaInteressePlaceholder}
                          maxMenuHeight={220}
                          unstyled
                          onChange={handleSelectChange('area_interesse')}
                          classNames={getSelectClassNames(errors.area_interesse)}
                        />
                        {errors.area_interesse && <p className="text-red-500 text-sm mt-1">{errors.area_interesse}</p>}
                      </div>

                      <div>
                        <label htmlFor="metodologia_agil" className="flex items-center gap-2 text-sm font-medium text-brand-slate mb-2">
                          <Briefcase className="h-4 w-4" />
                          {t.cooperado.metodologiasLabel} <span className="text-brand-red">*</span>
                        </label>
                        <Select
                          id="metodologia_agil"
                          options={metodologiasOptions}
                          value={metodologiasOptions.find(opt => opt.value === formState.metodologia_agil) || null}
                          placeholder={t.cooperado.metodologiasPlaceholder}
                          maxMenuHeight={220}
                          unstyled
                          onChange={handleSelectChange('metodologia_agil')}
                          classNames={getSelectClassNames(errors.metodologia_agil)}
                        />
                        {errors.metodologia_agil && <p className="text-red-500 text-sm mt-1">{errors.metodologia_agil}</p>}
                      </div>

                      <div>
                        <label htmlFor="situacao_atual" className="flex items-center gap-2 text-sm font-medium text-brand-slate mb-2">
                          <Briefcase className="h-4 w-4" />
                          {t.cooperado.situacaoLabel} <span className="text-brand-red">*</span>
                        </label>
                        <Select
                          id="situacao_atual"
                          options={situacaoProfissionalOptions}
                          value={situacaoProfissionalOptions.find(opt => opt.value === formState.situacao_atual) || null}
                          placeholder={t.cooperado.situacaoPlaceholder}
                          maxMenuHeight={220}
                          unstyled
                          onChange={handleSelectChange('situacao_atual')}
                          classNames={getSelectClassNames(errors.situacao_atual)}
                        />
                        {errors.situacao_atual && <p className="text-red-500 text-sm mt-1">{errors.situacao_atual}</p>}
                      </div>

                      {formState.situacao_atual === 'Outro' && (
                        <div>
                          <label htmlFor="situacao_outro" className="flex items-center gap-2 text-sm font-medium text-brand-slate mb-2">
                            {t.cooperado.situacaoOutroLabel} <span className="text-brand-red">*</span>
                          </label>
                          <input
                            type="text"
                            id="situacao_outro"
                            className={`w-full px-4 py-3 rounded-lg bg-brand-bg border ${errors.situacao_outro ? 'border-red-500' : 'border-brand-slate/20'} focus:border-brand-red focus:bg-white focus:ring-2 focus:ring-brand-red/20 transition-all text-brand-blue`}
                            placeholder={t.cooperado.situacaoOutroLabel}
                            value={formState.situacao_outro || ''}
                            onChange={handleChange}
                          />
                          {errors.situacao_outro && <p className="text-red-500 text-sm mt-1">{errors.situacao_outro}</p>}
                        </div>
                      )}

                      <div>
                        <label htmlFor="formacao_academica" className="flex items-center gap-2 text-sm font-medium text-brand-slate mb-2">
                          <Code className="h-4 w-4" />
                          {t.cooperado.formacaoLabel} <span className="text-brand-red">*</span>
                        </label>
                        <Select
                          id="formacao_academica"
                          options={formacaoAcademicaOptions}
                          value={formacaoAcademicaOptions.find(opt => opt.value === formState.formacao_academica) || null}
                          placeholder={t.cooperado.formacaoPlaceholder}
                          maxMenuHeight={220}
                          unstyled
                          onChange={handleSelectChange('formacao_academica')}
                          classNames={getSelectClassNames(errors.formacao_academica)}
                        />
                        {errors.formacao_academica && <p className="text-red-500 text-sm mt-1">{errors.formacao_academica}</p>}
                      </div>

                      <div>
                        <label htmlFor="formacao_outro" className="flex items-center gap-2 text-sm font-medium text-brand-slate mb-2">
                          <Code className="h-4 w-4" />
                          {t.cooperado.outrasFormacoesLabel} <span className="text-gray-500 opacity-60 text-xs font-normal">(opcional)</span>
                        </label>
                        <input
                          type="text"
                          id="formacao_outro"
                          className="w-full px-4 py-3 rounded-lg bg-brand-bg border border-brand-slate/20 focus:border-brand-red focus:bg-white focus:ring-2 focus:ring-brand-red/20 transition-all text-brand-blue"
                          placeholder={t.cooperado.outrasFormacoesPlaceholder}
                          value={formState.formacao_outro || ''}
                          onChange={handleChange}
                        />
                      </div>

                      <div>
                        <label htmlFor="nivel_profissional" className="flex items-center gap-2 text-sm font-medium text-brand-slate mb-2">
                          <Briefcase className="h-4 w-4" />
                          {t.cooperado.senioridadeLabel} <span className="text-brand-red">*</span>
                        </label>
                        <Select
                          id="nivel_profissional"
                          options={senioridadeOptions}
                          value={senioridadeOptions.find(opt => opt.value === formState.nivel_profissional) || null}
                          placeholder={t.cooperado.senioridadePlaceholder}
                          maxMenuHeight={220}
                          unstyled
                          onChange={handleSelectChange('nivel_profissional')}
                          classNames={getSelectClassNames(errors.nivel_profissional)}
                        />
                        {errors.nivel_profissional && <p className="text-red-500 text-sm mt-1">{errors.nivel_profissional}</p>}
                      </div>
                    </>
                  )}

                  {/* ===================== ETAPA 3 ===================== */}
                  {step === 2 && (
                    <>
                    <div>
                        <label htmlFor="stack_principal" className="flex items-center gap-2 text-sm font-medium text-brand-slate mb-2">
                          <Code className="h-4 w-4" />
                          Ferramentas e Tecnologias <span className="text-brand-red">*</span>
                        </label>
                        <Select
                          id="stack_principal"
                          isMulti
                          options={techStackOptions}
                          // Busca o objeto completo na lista base para recuperar as cores na hora de renderizar as tags já escolhidas
                          value={formState.stack_principal ? formState.stack_principal.split(', ').map(tech => techStackOptions.find(opt => opt.value === tech) || { value: tech, label: tech }) : []}
                          placeholder={t.cooperado.stackSelectPlaceholder}
                          maxMenuHeight={220}
                          unstyled
                          onChange={(selectedOptions: any) => {
                            const values = selectedOptions ? selectedOptions.map((opt: any) => opt.value).join(', ') : '';
                            setFormState(prev => ({ ...prev, stack_principal: values }));
                            
                            if (errors.stack_principal && (selectedOptions?.length || 0) >= 3) {
                              setErrors(prev => {
                                const newErrors = { ...prev };
                                delete newErrors.stack_principal;
                                return newErrors;
                              });
                            }
                          }}
                          classNames={{
                            control: (state) => `w-full px-4 py-2 min-h-[48px] rounded-lg bg-brand-bg border transition-all cursor-pointer text-brand-blue ${
                              errors.stack_principal ? 'border-red-500' : 'border-brand-slate/20'
                            } ${state.isFocused ? 'border-brand-red bg-white ring-2 ring-brand-red/20' : ''}`,
                            menu: () => "bg-brand-bg mt-1 rounded-lg shadow-xl border border-brand-slate/20 z-50 overflow-hidden",
                            menuList: () => "bg-brand-bg",
                            
                            // Pinta o texto da opção na lista dropdown de acordo com a categoria
                            option: ({ isFocused, data }: any) => `px-4 py-3 cursor-pointer transition-colors flex items-center justify-between ${
                              isFocused ? 'bg-brand-slate/20' : ''
                            } ${data.style ? data.style.text : 'text-brand-blue'}`,
                            
                            // Pinta o fundo, a borda e o texto das tags (MultiValue) selecionadas
                            multiValue: ({ data }: any) => `${data.style?.tagBg || 'bg-brand-red/10'} rounded m-1 flex items-center border ${data.style?.tagBorder || 'border-brand-red/20'}`,
                            multiValueLabel: ({ data }: any) => `${data.style?.text || 'text-brand-red'} px-2 py-1 text-sm font-medium`,
                            multiValueRemove: ({ data }: any) => `${data.style?.text || 'text-brand-red'} ${data.style?.hoverBg || 'hover:bg-brand-red'} ${data.style?.hoverText || 'hover:text-white'} rounded-r px-1.5 py-1 transition-colors cursor-pointer`,
                            
                            placeholder: () => "text-gray-400 truncate",
                            clearIndicator: () => "text-gray-400 hover:text-red-500 cursor-pointer p-1"
                          }}
                        />
                        {errors.stack_principal && (
                          <p className="text-red-500 text-sm mt-1">{errors.stack_principal}</p>
                        )}
                      </div>

                      <div>
                        <span className="flex items-center gap-2 text-sm font-medium text-brand-slate mb-2">
                          <MessageSquare className="h-4 w-4" />
                          {t.cooperado.idiomasLabel} <span className="text-brand-red">*</span>
                        </span>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label htmlFor="nivel_ingles" className="block text-xs font-medium text-brand-slate mb-1">
                              {t.cooperado.inglesLabel}
                            </label>
                            <Select
                              id="nivel_ingles"
                              options={nivelIdiomaOptions}
                              value={nivelIdiomaOptions.find(opt => opt.value === formState.nivel_ingles) || null}
                              placeholder={t.cooperado.idiomasPlaceholder}
                              maxMenuHeight={220}
                              unstyled
                              onChange={handleSelectChange('nivel_ingles')}
                              classNames={getSelectClassNames(errors.nivel_ingles)}
                            />
                            {errors.nivel_ingles && <p className="text-red-500 text-sm mt-1">{errors.nivel_ingles}</p>}
                          </div>
                          <div>
                            <label htmlFor="nivel_espanhol" className="block text-xs font-medium text-brand-slate mb-1">
                              {t.cooperado.espanholLabel}
                            </label>
                            <Select
                              id="nivel_espanhol"
                              options={nivelIdiomaOptions}
                              value={nivelIdiomaOptions.find(opt => opt.value === formState.nivel_espanhol) || null}
                              placeholder={t.cooperado.idiomasPlaceholder}
                              maxMenuHeight={220}
                              unstyled
                              onChange={handleSelectChange('nivel_espanhol')}
                              classNames={getSelectClassNames(errors.nivel_espanhol)}
                            />
                            {errors.nivel_espanhol && <p className="text-red-500 text-sm mt-1">{errors.nivel_espanhol}</p>}
                          </div>
                        </div>
                      </div>

                      <div>
                        <label htmlFor="linkedin" className="flex items-center gap-2 text-sm font-medium text-brand-slate mb-2">
                          <LinkIcon className="h-4 w-4" />
                          {t.cooperado.linkedinLabel} <span className="text-gray-500 opacity-60 text-xs font-normal">(opcional)</span>
                        </label>
                        <input
                          type="text"
                          id="linkedin"
                          className="w-full px-4 py-3 rounded-lg bg-brand-bg border border-brand-slate/20 focus:border-brand-red focus:bg-white focus:ring-2 focus:ring-brand-red/20 transition-all text-brand-blue"
                          placeholder={t.cooperado.linkedinPlaceholder}
                          value={formState.linkedin || ''}
                          onChange={handleChange}
                        />
                      </div>

                      <div>
                        <label htmlFor="github" className="flex items-center gap-2 text-sm font-medium text-brand-slate mb-2">
                          <Github className="h-4 w-4" />
                          {t.cooperado.githubLabel} <span className="text-gray-500 opacity-60 text-xs font-normal">(opcional)</span>
                        </label>
                        <input
                          type="text"
                          id="github"
                          className="w-full px-4 py-3 rounded-lg bg-brand-bg border border-brand-slate/20 focus:border-brand-red focus:bg-white focus:ring-2 focus:ring-brand-red/20 transition-all text-brand-blue"
                          placeholder={t.cooperado.githubPlaceholder}
                          value={formState.github || ''}
                          onChange={handleChange}
                        />
                      </div>

                      <div>
                        <label htmlFor="portfolio" className="flex items-center gap-2 text-sm font-medium text-brand-slate mb-2">
                          <LinkIcon className="h-4 w-4" />
                          {t.cooperado.portfolioLabel} <span className="text-gray-500 opacity-60 text-xs font-normal">(opcional)</span>
                        </label>
                        <input
                          type="text"
                          id="portfolio"
                          className="w-full px-4 py-3 rounded-lg bg-brand-bg border border-brand-slate/20 focus:border-brand-red focus:bg-white focus:ring-2 focus:ring-brand-red/20 transition-all text-brand-blue"
                          placeholder={t.cooperado.portfolioPlaceholder}
                          value={formState.portfolio || ''}
                          onChange={handleChange}
                        />
                      </div>

                      <div>
                        <label htmlFor="mensagem" className="flex items-center gap-2 text-sm font-medium text-brand-slate mb-2">
                          <MessageSquare className="h-4 w-4" />
                          {t.cooperado.mensagemLabel} <span className="text-gray-500 opacity-60 text-xs font-normal">(opcional)</span>
                        </label>
                        <textarea
                          id="mensagem"
                          rows={4}
                          className="w-full px-4 py-3 rounded-lg bg-brand-bg border border-brand-slate/20 focus:border-brand-red focus:bg-white focus:ring-2 focus:ring-brand-red/20 transition-all text-brand-blue resize-none"
                          placeholder={t.cooperado.mensagemPlaceholder}
                          value={formState.mensagem || ''}
                          onChange={handleChange}
                        ></textarea>
                      </div>
                    </>
                  )}

                  <div className="flex items-center justify-between pt-4 gap-4 border-t border-brand-slate/10">
                    {step > 0 ? (
                      <Button type="button" variant="secondary" onClick={handleBack} className="flex items-center gap-2">
                        <ArrowLeft className="h-4 w-4" /> {t.cooperado.btnBack}
                      </Button>
                    ) : (
                      <span />
                    )}

                    {step < TOTAL_STEPS - 1 ? (
                      <Button type="submit" variant="primary" className="flex items-center gap-2" disabled={isValidatingStep}>
                        {isValidatingStep ? (
                          <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Validando...</>
                        ) : (
                          <>{t.cooperado.btnNext} <ArrowRight className="h-4 w-4" /></>
                        )}
                      </Button>
                    ) : (
                      <Button type="submit" variant="primary" className="flex items-center gap-2" disabled={isSubmitting}>
                        {isSubmitting ? (
                          <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> {t.cooperado.btnSending}</>
                        ) : (
                          <>{t.cooperado.btnConfirm} <ArrowRight className="h-4 w-4" /></>
                        )}
                      </Button>
                    )}
                  </div>
                </form>
              </div>
            </ScrollReveal>
          </>
        )}
      </div>
    </div>
  );
};

export default Cooperado;