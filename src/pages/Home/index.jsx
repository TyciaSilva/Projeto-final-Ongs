import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHeart, faUsers, faHandsHelping, faQuoteLeft,
  faVolumeUp, faVolumeMute, faAdjust, faSearchPlus, 
  faSearchMinus, faKeyboard, faUniversalAccess,
  faSun, faMoon, faChevronDown, faChevronUp
} from '@fortawesome/free-solid-svg-icons';
import DonationFlow from './components/DonationFlow';
import MapaBrasilSVG from './components/MapaBrasilSVG';
import ThemeManager from './components/ThemeManager'; 


// Estados brasileiros
const estadosBrasileiros = [
  { sigla: "AC", nome: "Acre" },
  { sigla: "AL", nome: "Alagoas" },
  { sigla: "AP", nome: "Amapá" },
  { sigla: "AM", nome: "Amazonas" },
  { sigla: "BA", nome: "Bahia" },
  { sigla: "CE", nome: "Ceará" },
  { sigla: "DF", nome: "Distrito Federal" },
  { sigla: "ES", nome: "Espírito Santo" },
  { sigla: "GO", nome: "Goiás" },
  { sigla: "MA", nome: "Maranhão" },
  { sigla: "MT", nome: "Mato Grosso" },
  { sigla: "MS", nome: "Mato Grosso do Sul" },
  { sigla: "MG", nome: "Minas Gerais" },
  { sigla: "PA", nome: "Pará" },
  { sigla: "PB", nome: "Paraíba" },
  { sigla: "PR", nome: "Paraná" },
  { sigla: "PE", nome: "Pernambuco" },
  { sigla: "PI", nome: "Piauí" },
  { sigla: "RJ", nome: "Rio de Janeiro" },
  { sigla: "RN", nome: "Rio Grande do Norte" },
  { sigla: "RS", nome: "Rio Grande do Sul" },
  { sigla: "RO", nome: "Rondônia" },
  { sigla: "RR", nome: "Roraima" },
  { sigla: "SC", nome: "Santa Catarina" },
  { sigla: "SP", nome: "São Paulo" },
  { sigla: "SE", nome: "Sergipe" },
  { sigla: "TO", nome: "Tocantins" }
];

// Componente de Painel de Acessibilidade
function AccessibilityPanel({ 
  textSize, 
  setTextSize,
  highContrast,
  setHighContrast,
  speechEnabled,
  setSpeechEnabled,
  darkMode,
  setDarkMode,
  isOpen,
  togglePanel
}) {
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);

  return (
    <div className="accessibility-container">
      <button 
        className="accessibility-toggle"
        onClick={togglePanel}
        aria-expanded={isOpen}
        aria-label={isOpen ? 'Fechar painel de acessibilidade' : 'Abrir painel de acessibilidade'}
      >
        <FontAwesomeIcon icon={faUniversalAccess} />
        <span className="sr-only">Acessibilidade</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="accessibility-panel"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            aria-label="Painel de acessibilidade"
          >
            <div className="accessibility-options">
              <button 
                onClick={() => setTextSize(prev => Math.min(prev + 1, 3))}
                aria-label="Aumentar tamanho do texto"
              >
                <FontAwesomeIcon icon={faSearchPlus} /> <span>A+</span>
              </button>
              <button 
                onClick={() => setTextSize(prev => Math.max(prev - 1, 0))}
                aria-label="Diminuir tamanho do texto"
              >
                <FontAwesomeIcon icon={faSearchMinus} /> <span>A-</span>
              </button>
              <button 
                onClick={() => setHighContrast(!highContrast)}
                aria-label={`Alto contraste ${highContrast ? 'desativado' : 'ativado'}`}
              >
                <FontAwesomeIcon icon={faAdjust} /> <span>Contraste</span>
              </button>
              <button 
                onClick={() => setSpeechEnabled(!speechEnabled)}
                aria-label={`Leitor de tela ${speechEnabled ? 'desativado' : 'ativado'}`}
              >
                <FontAwesomeIcon icon={speechEnabled ? faVolumeUp : faVolumeMute} /> <span>Leitor</span>
              </button>
            </div>

            <div className="keyboard-section">
              <button 
                className="keyboard-toggle"
                onClick={() => setShowKeyboardHelp(!showKeyboardHelp)}
                aria-expanded={showKeyboardHelp}
              >
                <FontAwesomeIcon icon={faKeyboard} />
                <span>Instruções de Teclado</span>
                <FontAwesomeIcon icon={showKeyboardHelp ? faChevronUp : faChevronDown} />
              </button>

              <AnimatePresence>
                {showKeyboardHelp && (
                  <motion.div
                    className="keyboard-instructions"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <h3>Navegação por Teclado</h3>
                    <ul>
                      <li><strong>Tab</strong>: Navegar entre elementos</li>
                      <li><strong>Shift + Tab</strong>: Navegar para trás</li>
                      <li><strong>Enter</strong>: Ativar elemento</li>
                      <li><strong>Espaço</strong>: Ativar botões</li>
                      <li><strong>Setas</strong>: Navegar em menus</li>
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Home() {
    // Estados principais
  const [expandido, setExpandido] = useState(false);
  const [categoriasVisiveis, setCategoriasVisiveis] = useState(true);
  const [estadoSelecionado, setEstadoSelecionado] = useState('');
  const [expandedProject, setExpandedProject] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [busca, setBusca] = useState('');
  const [categoria, setCategoria] = useState('todas');
  const [mostrarResultados, setMostrarResultados] = useState(true);

  // Estados de acessibilidade
  const [textSize, setTextSize] = useState(1);
  const [highContrast, setHighContrast] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [accessibilityOpen, setAccessibilityOpen] = useState(false);
  const [lastSpoken, setLastSpoken] = useState('');
  const speechSynthesis = useRef(null);
  // Dados mockados
  const ongs = [
    { id: 1, nome: 'ONG CRIANÇA SP', categoria: 'Crianças', descricao: 'Apoio a crianças carentes', localizacao: 'São Paulo, SP' },
    { id: 2, nome: 'ONG ANIMAL RJ', categoria: 'Animais', descricao: 'Proteção animal', localizacao: 'Rio de Janeiro, RJ' },
    { id: 3, nome: 'ONG EDUCA MG', categoria: 'Educação', descricao: 'Educação para todos', localizacao: 'Belo Horizonte, MG' },
    { id: 4, nome: 'ONG EVT RS', categoria: 'Eventos', descricao: 'Organização de eventos beneficentes', localizacao: 'Porto Alegre, RS' },
    { id: 5, nome: 'ONG EDUCA BA', categoria: 'Educação', descricao: 'Cursos gratuitos', localizacao: 'Salvador, BA' },
  ];

  const projects = [
    { id: 1, image: "imagens/projeto1.jpg", title: "Doe sangue, salve vidas!", description: "A cada doação, você pode ajudar até quatro pessoas que precisam com urgência..." },
    { id: 2, image: "imagens/projeto2.jpg", title: "Projeto B", description: "Descrição breve do projeto." },
    { id: 3, image: "imagens/projeto3.jpg", title: "Projeto C", description: "Descrição breve do projeto." }
  ];

  const noticias = [
    { id: 1, imagem: "imagens/noticia1.jpg", titulo: "Mais de um terço das espécies de árvore podem ser extintas, mostra análise", resumo: "Das 47.282 espécies de árvores avaliadas, pelo menos 16.425 correm o risco de desaparecer, segundo a Lista Vermelha da União Internacional para a Conservação da Natureza (IUCN)." },
    { id: 2, imagem: "imagens/noticia2.jpg", titulo: "ONGs Recebem Prêmio", resumo: "Organizações parceiras são premiadas por impacto social." },
    { id: 3, imagem: "imagens/noticia3.jpg", titulo: "Evento Solidário", resumo: "Grande evento arrecada fundos para comunidades carentes." }
  ];

  // Filtros
  const ongsFiltradas = ongs.filter(ong => 
    (categoria === 'todas' || ong.categoria === categoria) &&
    (ong.nome.toLowerCase().includes(busca.toLowerCase()) ||
     ong.descricao.toLowerCase().includes(busca.toLowerCase()) ||
     ong.localizacao.toLowerCase().includes(busca.toLowerCase()))
  );

  const ongsFiltradasPorEstado = ongsFiltradas.filter(ong => {
    if (!estadoSelecionado) return true;
    const siglaOng = ong.localizacao.split(', ')[1]?.trim();
    return siglaOng === estadoSelecionado;
  });

  // Efeitos
  useEffect(() => {
    // Aplicar classes de acessibilidade globalmente
    const body = document.body;
    
    // Limpar classes anteriores
    body.classList.remove(
      'high-contrast', 
      'dark-mode',
      'text-size-0',
      'text-size-1',
      'text-size-2',
      'text-size-3'
    );
    
    // Adicionar classes atuais
    if (highContrast) body.classList.add('high-contrast');
    if (darkMode) body.classList.add('dark-mode');
    body.classList.add(`text-size-${textSize}`);
    
    // Configurar síntese de voz
    if ('speechSynthesis' in window) {
      speechSynthesis.current = window.speechSynthesis;
    } else {
      console.warn('Web Speech API não suportada neste navegador');
      setSpeechEnabled(false);
    }

    // Configurar listeners para eventos de acessibilidade
    const handleFocus = (e) => {
      if (speechEnabled && e.target.getAttribute('aria-label')) {
        const text = e.target.getAttribute('aria-label');
        if (text !== lastSpoken) {
          speak(text);
          setLastSpoken(text);
        }
      }
    };

    document.addEventListener('focus', handleFocus, true);
    return () => document.removeEventListener('focus', handleFocus, true);
  }, [textSize, highContrast, darkMode, speechEnabled, lastSpoken]);

  useEffect(() => {
    const salvo = localStorage.getItem('mostrarResultados');
    if (salvo !== null) {
      setMostrarResultados(JSON.parse(salvo));
    }

    const darkModeSalvo = localStorage.getItem('darkMode');
    if (darkModeSalvo !== null) {
      setDarkMode(JSON.parse(darkModeSalvo));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('mostrarResultados', JSON.stringify(mostrarResultados));
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [mostrarResultados, darkMode]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCategoriasVisiveis(false);
      } else {
        const salvo = localStorage.getItem('categoriasVisiveis');
        if (salvo !== null) {
          setCategoriasVisiveis(JSON.parse(salvo));
        }
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Funções auxiliares
  const speak = (text) => {
    if (speechEnabled && speechSynthesis.current) {
      speechSynthesis.current.cancel(); // Cancela leituras anteriores
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pt-BR';
      speechSynthesis.current.speak(utterance);
    }
  };

  const detectarLocalizacao = () => {
    if (!navigator.geolocation) {
      toast.error('Seu navegador não suporta geolocalização');
      return;
    }

    toast.info('Detectando sua localização...');
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        
        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
          .then(response => {
            if (!response.ok) throw new Error("Erro na resposta da API");
            return response.json();
          })
          .then(data => {
            const estado = data.address.state || data.address.state_district;
            
            if (estado) {
              const estadoEncontrado = estadosBrasileiros.find(e => 
                e.nome.toLowerCase().includes(estado.toLowerCase()) ||
                estado.toLowerCase().includes(e.nome.toLowerCase())
              );
              
              if (estadoEncontrado) {
                setEstadoSelecionado(estadoEncontrado.sigla);
                toast.success(`Localização detectada: ${estadoEncontrado.nome}`);
              } else {
                toast.warning('Estado não identificado');
              }
            } else {
              toast.warning('Não foi possível identificar seu estado');
            }
          })
          .catch(() => toast.error('Erro ao identificar localização'));
      },
      (error) => toast.error(`Erro na geolocalização: ${error.message}`),
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleParticiparProjeto = (projectId) => {
    const project = projects.find(p => p.id === projectId);
    
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ff6b6b', '#ff8e53', '#3498db', '#2ecc71'],
      zIndex: 10000
    });

    toast.success(
      `🎉 Você se juntou ao projeto "${project.title}"! Agora você pode acompanhar as atividades e contribuir.`,
      {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        style: {
          background: 'linear-gradient(135deg, #43cea2, #185a9d)',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '16px'
        }
      }
    );
  };

  const handleProjectClick = (id) => {
    setExpandedProject(expandedProject === id ? null : id);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === noticias.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? noticias.length - 1 : prev - 1));
  };

  return (
  <div className="menu-body">
      
      <ThemeManager 
        textSize={textSize} 
        highContrast={highContrast} 
        darkMode={darkMode} 
      />

      <ToastContainer position="top-right" autoClose={3000} />
      
      <AccessibilityPanel
        textSize={textSize}
        setTextSize={setTextSize}
        highContrast={highContrast}
        setHighContrast={setHighContrast}
        speechEnabled={speechEnabled}
        setSpeechEnabled={setSpeechEnabled}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        isOpen={accessibilityOpen}
        togglePanel={() => setAccessibilityOpen(!accessibilityOpen)}
      />
      <header className="navbar">
        <div className="logo">
          <img 
            src="imagens/Logo.png" 
            alt="Logo ConectaOngs - Conectando voluntários e organizações" 
          />
        </div>
        <nav>
          <a href="#home">Home</a>
          <a href="#sobre">Sobre</a>
          <a href="#projetos">Projetos</a>
          <a href="#noticias">Notícias</a>
          <a href="#" className="btn-doe">Doe Agora</a>
          
          <button 
            className="btn-dark-mode"
            onClick={() => setDarkMode(!darkMode)}
            aria-label={`Alternar para modo ${darkMode ? 'claro' : 'escuro'}`}
          >
            <FontAwesomeIcon icon={darkMode ? faSun : faMoon} />
          </button>
          
          <button 
            className="btn-localizacao-nav"
            onClick={() => setExpandido(!expandido)}
            aria-expanded={expandido}
            aria-label={expandido ? 'Fechar painel de localização' : 'Abrir painel de localização'}
          >
            {expandido ? '✕ Fechar' : '🌎 Localização'}
          </button>
        </nav>
        <div className="perfil">
          <img 
            src="imagens/Perfil.png" 
            alt="Ícone de perfil do usuário" 
            role="button"
            aria-haspopup="true"
            aria-label="Menu do usuário"
          />
        </div>
      </header>

      {expandido && (
        <section className="selecao-estado-painel" role="dialog" aria-modal="true" aria-labelledby="localizacao-title">
          <div className="container-painel">
            <div className="painel-header">
              <h2 id="localizacao-title">De onde você é?</h2>
              <button 
                className="btn-fechar" 
                onClick={() => setExpandido(false)}
                aria-label="Fechar painel de localização"
              >
                ✕
              </button>
            </div>
            
            <p>Selecione um estado no mapa para encontrar ONGs próximas de você</p>
            
            <div className="mapa-container">
              <MapaBrasilSVG 
                estadoSelecionado={estadoSelecionado}
                setEstadoSelecionado={setEstadoSelecionado}
              />
              
              <div className="legenda-mapa">
                <div className="item-legenda">
                  <div className="cor legenda-normal"></div>
                  <span>Estado normal</span>
                </div>
                <div className="item-legenda">
                  <div className="cor legenda-selecionado"></div>
                  <span>Estado selecionado</span>
                </div>
              </div>
            </div>
            
            <div className="acoes">
              <button 
                className="btn-localizacao" 
                onClick={detectarLocalizacao}
                aria-label="Usar minha localização atual"
              >
                📍 Usar minha localização atual
              </button>

              {estadoSelecionado && (
                <div className="estado-selecionado-info">
                  <span>
                    Estado selecionado: {
                      estadosBrasileiros.find(e => e.sigla === estadoSelecionado)?.nome
                    }
                  </span>
                  <button 
                    className="limpar-filtro"
                    onClick={() => setEstadoSelecionado('')}
                    aria-label="Limpar seleção de estado"
                  >
                    Limpar seleção
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      <section id="home" className="banner" aria-labelledby="banner-title">
        <div className="conteudo-banner">
          <h1 id="banner-title">Conectando ONGs e Doadores</h1>
          <p>Juntos por um mundo melhor!</p>
          <div className="botoes-banner">
            <Link 
              to="/cadastro" 
              className="link-botao-banner"
              aria-label="Ir para área de voluntariado"
            >
              Área Voluntariado
            </Link>
            <button aria-label="Cadastrar nova ONG">Cadastre sua Ong</button>
          </div>
        </div>
      </section>

      <section className="busca-ongs" aria-labelledby="busca-ongs-title">
        <div className="container-busca">
          <div className="cabecalho-busca">
            <h2 id="busca-ongs-title">Encontre ONGs que precisam de ajuda</h2>
            <button 
              onClick={() => setMostrarResultados(!mostrarResultados)}
              className="toggle-resultados"
              aria-expanded={mostrarResultados}
              aria-controls="resultados-ongs"
            >
              {mostrarResultados ? (
                <>
                  <span>Ocultar Resultados</span>
                  <span className="seta">▲</span>
                </>
              ) : (
                <>
                  <span>Mostrar Resultados</span>
                  <span className="seta">▼</span>
                </>
              )}
            </button>
          </div>
          
          <div className="filtro-container">
            <input 
              type="text" 
              placeholder="Buscar ONGs por nome, causa ou localização..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              aria-label="Campo de busca por ONGs"
            />
            <select 
              value={categoria} 
              onChange={(e) => setCategoria(e.target.value)}
              aria-label="Filtrar por categoria"
            >
              <option value="todas">Todas as Categorias</option>
              <option value="Crianças">Crianças</option>
              <option value="Animais">Animais</option>
              <option value="Educação">Educação</option>
              <option value="Meio Ambiente">Meio Ambiente</option>
              <option value="Saúde">Saúde</option>
              <option value="Eventos">Eventos</option>
            </select>
          </div>
          
          <div className="categorias-rapidas" role="toolbar" aria-label="Categorias rápidas">
            <button 
              onClick={() => setCategoria('Crianças')} 
              aria-pressed={categoria === 'Crianças'}
            >
              Crianças
            </button>
            <button 
              onClick={() => setCategoria('Animais')} 
              aria-pressed={categoria === 'Animais'}
            >
              Animais
            </button>
            <button 
              onClick={() => setCategoria('Educação')} 
              aria-pressed={categoria === 'Educação'}
            >
              Educação
            </button>
            <button 
              onClick={() => setCategoria('Meio Ambiente')} 
              aria-pressed={categoria === 'Meio Ambiente'}
            >
              Meio Ambiente
            </button>
            <button 
              onClick={() => setCategoria('Saúde')} 
              aria-pressed={categoria === 'Saúde'}
            >
              Saúde
            </button>
            <button 
              onClick={() => setCategoria('Eventos')} 
              aria-pressed={categoria === 'Eventos'}
            >
              Eventos
            </button>
          </div>
        </div>
      </section>
        
      <AnimatePresence>
        {mostrarResultados && (
          <motion.section
            className="resultados-ongs"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            id="resultados-ongs"
            aria-live="polite"
          >
            <div className="ongs-grid" role="list">
              {(estadoSelecionado ? ongsFiltradasPorEstado : ongsFiltradas).map(ong => (
                <div 
                  key={ong.id} 
                  className="ong-card"
                  role="listitem"
                  tabIndex="0"
                  aria-labelledby={`ong-${ong.id}-title`}
                >
                  <div className="ong-header">
                    <h3 id={`ong-${ong.id}-title`}>{ong.nome}</h3>
                    <span className="categoria-tag">{ong.categoria}</span>
                  </div>
                  <p>{ong.descricao}</p>
                  <div className="ong-footer">
                    <span>📍 {ong.localizacao}</span>
                    <button 
                      className="btn-visitar"
                      aria-label={`Ver detalhes da ONG ${ong.nome}`}
                    >
                      Ver Detalhes
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      <section id="sobre" className="sobre-container" aria-labelledby="sobre-title">
        <div className="sobre-texto">
          <div className="sobre-header">
            <h2 id="sobre-title">
              <FontAwesomeIcon icon={faHeart} className="icon-heart" aria-hidden="true" /> 
              Sobre Nós
            </h2>
            <div className="divider" aria-hidden="true"></div>
          </div>
          
          <p className="sobre-intro">
            A <strong>ConectaOngs</strong> é a melhor e mais completa plataforma brasileira de conexão entre 
            voluntários e organizações não-governamentais. Nosso propósito é transformar a cultura de voluntariado 
            no país, tornando o engajamento social mais acessível, transparente e eficiente.
          </p>
          
          <div className="mission-section">
            <div className="mission-card" aria-labelledby="voluntarios-title">
              <div className="mission-header">
                <FontAwesomeIcon icon={faUsers} className="mission-icon" aria-hidden="true" />
                <h3 id="voluntarios-title">Para Voluntários</h3>
              </div>
              <p>
                Oferecemos uma variedade de oportunidades que vão desde ações pontuais até programas de longo prazo, 
                em diversas áreas como educação, meio ambiente, saúde e assistência social. Você encontra a causa que 
                combina com seu perfil e disponibilidade.
              </p>
            </div>
            
            <div className="mission-card" aria-labelledby="ongs-title">
              <div className="mission-header">
                <FontAwesomeIcon icon={faHandsHelping} className="mission-icon" aria-hidden="true" />
                <h3 id="ongs-title">Para ONGs</h3>
              </div>
              <p>
                Disponibilizamos ferramentas completas para cadastro, gestão de voluntários e divulgação de ações. 
                Qualquer organização sem fins lucrativos pode se registrar e ampliar seu impacto social através da nossa rede.
              </p>
            </div>
          </div>
          
          <div className="highlight-box" aria-label="Citação inspiradora">
            <FontAwesomeIcon icon={faQuoteLeft} className="quote-icon" aria-hidden="true" />
            <p>
              "Sozinhos somos uma gota, juntos formamos um oceano"
            </p>
          </div>
        </div>

        <div className="doacao-box">
          <DonationFlow />
        </div>
      </section>
      
      <section id="projetos" className="projetos" aria-labelledby="projetos-title">
        <h2 id="projetos-title">Nossos Projetos</h2>
        <div className="cards" role="list">
          {projects.map((project, index) => (
            <div 
              key={project.id}
              className={`card ${index === 0 ? 'destaque' : ''}`}
              onClick={() => handleProjectClick(project.id)}
              onKeyDown={(e) => e.key === 'Enter' && handleProjectClick(project.id)}
              role="listitem"
              tabIndex="0"
              aria-labelledby={`project-${project.id}-title`}
            >
              <img 
                src={project.image} 
                alt="" 
                aria-hidden="true"
              />
              <div className="card-content">
                <h3 id={`project-${project.id}-title`}>{project.title}</h3>
                <p>{project.description}</p>
                <div className="card-footer">
                  <span className="categoria-tag">Saúde</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {expandedProject && (
          <div 
            className="overlay active" 
            onClick={() => setExpandedProject(null)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="expanded-project-title"
          >
            <div className="expanded-content" onClick={e => e.stopPropagation()}>
              {projects.map(project => (
                project.id === expandedProject && (
                  <div key={project.id}>
                    <img 
                      src={project.image} 
                      alt="" 
                      aria-hidden="true"
                    />
                    <div className="expanded-text">
                      <h3 id="expanded-project-title">{project.title}</h3>
                      <p>{project.description}</p>
                      <button 
                        className="btn-participar" 
                        onClick={(e) => { 
                          e.stopPropagation();
                          handleParticiparProjeto(project.id);
                        }}
                        aria-label={`Participar do projeto ${project.title}`}
                      >
                        Participar deste Projeto
                      </button>
                    </div>
                  </div>
                )
              ))}
              <button 
                className="close-btn" 
                onClick={() => setExpandedProject(null)}
                aria-label="Fechar detalhes do projeto"
              >
                ×
              </button>
            </div>
          </div>
        )}
      </section>

      <section id="noticias" className="noticias" aria-labelledby="noticias-title">
        <h2 id="noticias-title">Notícias e Informações</h2>
        <div className="carrossel">
          <button 
            className="carrossel-btn prev" 
            onClick={prevSlide}
            aria-label="Notícia anterior"
          >
            ‹
          </button>
          
          <div className="slides-container">
            {noticias.map((noticia, index) => {
              let position = "";
              if (index === currentSlide) position = "ativo";
              else if (
                index === currentSlide - 1 || 
                (currentSlide === 0 && index === noticias.length - 1)
              ) position = "anterior";
              
              return (
                <div 
                  key={noticia.id}
                  className={`slide ${position}`}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`Slide ${index + 1} de ${noticias.length}`}
                  aria-hidden={index !== currentSlide}
                >
                  <img 
                    src={noticia.imagem} 
                    alt="" 
                    aria-hidden="true"
                  />
                  <div className="texto">
                    <h3>{noticia.titulo}</h3>
                    <p>{noticia.resumo}</p>
                  </div>
                </div>
              );
            })}
          </div>
          
          <button 
            className="carrossel-btn next" 
            onClick={nextSlide}
            aria-label="Próxima notícia"
          >
            ›
          </button>
        </div>
      </section>

      <footer role="contentinfo">
        <p>Direitos Autorais &copy; 2025 ConectaOngs</p>
      </footer>
    </div>
  );
}

export default Home;