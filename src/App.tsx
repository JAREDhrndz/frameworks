import React, { useState, useEffect } from 'react';
import { 
  Shield, ShieldAlert, Lock, Database, Code2, Layout, 
  CheckCircle2, AlertTriangle, X, ChevronRight, Info, 
  Activity, ServerCrash, ShieldCheck 
} from 'lucide-react';

// --- DATOS EXTRAÍDOS DEL PDF CON METRICAS AÑADIDAS ---
const reportData = {
  header: {
    university: "Universidad Tecnológica de Durango",
    career: "Ingeniería en Tecnologías de la Información",
    title: "Análisis de la Seguridad en Frameworks Web",
    author: "Hernandez Ortega Jared Alonso",
    group: "8°A",
    teacher: "Marco Antonio Vasquez Orozco",
    date: "Junio 2026"
  },
  summary: "La seguridad web es un pilar fundamental. Las vulnerabilidades resultan en robo de datos y daño reputacional. El uso de frameworks modernos es recomendado, ya que incorporan protecciones por defecto contra ataques comunes (OWASP).",
  conclusions: [
    "Frameworks full-stack como Ruby on Rails y Laravel son los más robustos por defecto, resolviendo inyección SQL, CSRF y XSS sin configuración activa.",
    "Ecosistemas como Node.js (Express) ofrecen gran flexibilidad, pero delegan la total responsabilidad al desarrollador, elevando el riesgo si falta experiencia.",
    "En el frontend, Angular destaca por su Strict Contextual Escaping (SCE), siendo más conservador que React/Vue.",
    "Para minimizar riesgos empresariales, elegir un framework con medidas robustas por defecto representa la mejor estrategia defensiva."
  ]
};

const frameworks = [
  {
    id: "laravel",
    name: "Laravel",
    type: "Full-Stack (PHP)",
    logo: "https://upload.wikimedia.org/wikipedia/commons/9/9b/Laravel.svg",
    invertLogo: false,
    score: 95,
    level: "Alto",
    color: "from-red-500/10 to-orange-600/10",
    hoverColor: "hover:shadow-red-500/20",
    borderColor: "border-red-500/30",
    textColor: "text-red-400",
    barColor: "bg-red-500",
    description: "Framework full-stack altamente robusto con 'baterías incluidas'.",
    xss: "Automática (Motor Blade).",
    csrf: "Middleware activo por defecto.",
    auth: "Sistemas nativos (Sanctum, Breeze).",
    sql: "ORM Eloquent protegido por defecto.",
    vuln: "Ecosistema monitoreado.",
    prosCons: "Alta seguridad out-of-the-box, pero puede ser pesado en recursos."
  },
  {
    id: "express",
    name: "Express.js",
    type: "Micro-Framework (Node)",
    logo: "https://upload.wikimedia.org/wikipedia/commons/6/64/Expressjs.png",
    invertLogo: true,
    score: 60,
    level: "Manual",
    color: "from-gray-500/10 to-slate-700/10",
    hoverColor: "hover:shadow-slate-400/20",
    borderColor: "border-gray-500/30",
    textColor: "text-gray-300",
    barColor: "bg-gray-400",
    description: "Minimalista. Depende 100% de middlewares activos configurados manualmente.",
    xss: "Requiere sanitización manual (ej. DOMPurify).",
    csrf: "Requiere librerías de terceros.",
    auth: "Implementación manual (Passport, JWT).",
    sql: "Depende del ORM externo (Sequelize, Prisma).",
    vuln: "Requiere auditoría manual (npm audit).",
    prosCons: "Flexibilidad inigualable, pero propenso a errores humanos de seguridad."
  },
  {
    id: "angular",
    name: "Angular",
    type: "Frontend Framework",
    logo: "https://upload.wikimedia.org/wikipedia/commons/c/cf/Angular_full_color_logo.svg",
    invertLogo: false,
    score: 90,
    level: "Alto",
    color: "from-red-600/10 to-pink-600/10",
    hoverColor: "hover:shadow-pink-500/20",
    borderColor: "border-pink-500/30",
    textColor: "text-pink-400",
    barColor: "bg-pink-500",
    description: "Framework completo con enfoque sumamente estricto en sanitización.",
    xss: "Nativo y estricto (SCE).",
    csrf: "Soporte integrado en HttpClient.",
    auth: "Route Guards e interceptores.",
    sql: "N/A (Depende del backend).",
    vuln: "Auditorías de Google y notificaciones CLI.",
    prosCons: "Estricto por defecto, pero con curva de aprendizaje muy pronunciada."
  },
  {
    id: "reactvue",
    name: "React / Vue",
    type: "Frontend Library",
    logo: "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg",
    invertLogo: false,
    score: 75,
    level: "Medio",
    color: "from-blue-500/10 to-cyan-500/10",
    hoverColor: "hover:shadow-cyan-500/20",
    borderColor: "border-cyan-500/30",
    textColor: "text-cyan-400",
    barColor: "bg-cyan-500",
    description: "Librerías enfocadas en UI. Protegen lo básico pero dejan brechas.",
    xss: "Escapan DOM, pero v-html/dangerouslySetInnerHTML son peligrosos.",
    csrf: "Requieren configuración en Axios/Fetch.",
    auth: "Depende de bibliotecas externas (React Router).",
    sql: "N/A (Depende del backend).",
    vuln: "Monitoreo activo de la comunidad.",
    prosCons: "Fácil adopción, pero menos opiniones de seguridad integradas que Angular."
  },
  {
    id: "nextjs",
    name: "Next.js",
    type: "Full-Stack (React)",
    logo: "https://upload.wikimedia.org/wikipedia/commons/8/8e/Nextjs-logo.svg",
    invertLogo: true,
    score: 85,
    level: "Medio-Alto",
    color: "from-slate-700/10 to-black/10",
    hoverColor: "hover:shadow-white/10",
    borderColor: "border-slate-600/30",
    textColor: "text-slate-200",
    barColor: "bg-slate-400",
    description: "Renderizado del lado del servidor. Introduce nuevos vectores de ataque.",
    xss: "Escapa HTML por defecto mediante JSX.",
    csrf: "Manejo en NextAuth, manual en APIs propias.",
    auth: "Integración robusta con NextAuth.js.",
    sql: "Depende del ORM usado en las rutas API.",
    vuln: "Gestión de parches rápidos por Vercel.",
    prosCons: "Excelente ecosistema, pero mezclar lógica de cliente/servidor es riesgoso."
  },
  {
    id: "rails",
    name: "Ruby on Rails",
    type: "Full-Stack (Ruby)",
    logo: "https://upload.wikimedia.org/wikipedia/commons/6/62/Ruby_On_Rails_Logo.svg",
    invertLogo: false,
    score: 95,
    level: "Alto",
    color: "from-red-700/10 to-red-900/10",
    hoverColor: "hover:shadow-red-700/20",
    borderColor: "border-red-700/30",
    textColor: "text-red-500",
    barColor: "bg-red-600",
    description: "Filosofía 'baterías incluidas' y convención sobre configuración.",
    xss: "Escapa salida HTML en vistas (ERB).",
    csrf: "Tokens automáticos y verificación nativa.",
    auth: "Gemas altamente seguras (Devise, Pundit).",
    sql: "Consultas parametrizadas transparentes.",
    vuln: "Escáneres de comunidad robustos (Brakeman).",
    prosCons: "Minimiza olvidos de seguridad; la 'magia' puede ocultar el funcionamiento."
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('grid');
  const [selectedFramework, setSelectedFramework] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // INYECCIÓN DE TAILWIND A PRUEBA DE FALLOS PARA PROYECTOS LOCALES
    if (typeof document !== 'undefined' && !document.getElementById('tailwind-cdn-script')) {
      const script = document.createElement('script');
      script.id = 'tailwind-cdn-script';
      script.src = 'https://cdn.tailwindcss.com';
      document.head.appendChild(script);
    }
    // Retraso ligero para permitir que CSS aplique antes de mostrar las animaciones
    const timer = setTimeout(() => setIsLoaded(true), 150);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 font-sans selection:bg-cyan-500/30 relative overflow-hidden">
      
      {/* Elementos Decorativos de Fondo (Estilo Cyberpunk / Dashboard) */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl opacity-50 animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-600/10 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b80_1px,transparent_1px),linear-gradient(to_bottom,#1e293b80_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20"></div>
      </div>

      {/* Header Fijo */}
      <header className={`relative z-20 border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-xl sticky top-0 transition-all duration-700 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'}`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-cyan-500/10 rounded-xl border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
              <Shield className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">{reportData.header.title}</h1>
              <p className="text-xs text-cyan-400 font-semibold uppercase tracking-widest">{reportData.header.university}</p>
            </div>
          </div>
          <div className="text-center md:text-right text-sm bg-slate-900/50 py-2 px-4 rounded-lg border border-slate-800">
            <p className="text-slate-400">Auditor: <span className="text-cyan-100 font-medium">{reportData.header.author}</span></p>
            <p className="text-slate-500 text-xs mt-0.5">{reportData.header.date} | {reportData.header.career}</p>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-10">
        
        {/* Sección de Resumen */}
        <section className={`mb-12 max-w-4xl transition-all duration-1000 delay-100 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 text-cyan-400 text-xs font-bold tracking-wide uppercase mb-6 shadow-lg shadow-cyan-900/20">
            <Activity className="w-4 h-4" /> Resumen Ejecutivo
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
            Asegurando el <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">Ciclo de Desarrollo</span>
          </h2>
          <p className="text-lg text-slate-400 leading-relaxed border-l-4 border-cyan-500/50 pl-6 bg-gradient-to-r from-cyan-500/5 to-transparent py-2 rounded-r-lg">
            {reportData.summary}
          </p>
        </section>

        {/* Pestañas de Navegación */}
        <div className={`flex flex-wrap gap-2 bg-slate-900/60 p-1.5 rounded-2xl mb-10 w-fit border border-slate-800/80 backdrop-blur-sm transition-all duration-1000 delay-200 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
          {[
            { id: 'grid', icon: <Layout className="w-4 h-4" />, label: "Tarjetas de Análisis" },
            { id: 'table', icon: <Database className="w-4 h-4" />, label: "Matriz Comparativa" },
            { id: 'conclusions', icon: <CheckCircle2 className="w-4 h-4" />, label: "Conclusiones" }
          ].map((tab) => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center gap-2 
                ${activeTab === tab.id 
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_20px_rgba(6,182,212,0.15)]' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/80 border border-transparent'}`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Contenedor Dinámico */}
        <div className="min-h-[500px]">
          
          {/* VISTA: TARJETAS (GRID) */}
          {activeTab === 'grid' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-10 duration-700">
              {frameworks.map((fw) => (
                <div 
                  key={fw.id}
                  onClick={() => setSelectedFramework(fw)}
                  className={`group cursor-pointer relative p-6 rounded-2xl bg-gradient-to-br ${fw.color} bg-slate-900/40 border ${fw.borderColor} backdrop-blur-md hover:-translate-y-2 transition-all duration-300 shadow-xl ${fw.hoverColor} overflow-hidden flex flex-col h-full`}
                >
                  {/* Decoración de fondo tarjeta */}
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-current opacity-5 rounded-full blur-2xl transition-opacity group-hover:opacity-10" style={{ color: fw.barColor.replace('bg-', '') }}></div>
                  
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex items-center justify-between mb-5">
                      <div className="w-16 h-16 rounded-2xl bg-slate-950 p-3 flex items-center justify-center border border-slate-800 shadow-inner">
                        <img 
                          src={fw.logo} 
                          alt={fw.name} 
                          className={`max-w-full max-h-full object-contain drop-shadow-lg transition-transform group-hover:scale-110 duration-300 ${fw.invertLogo ? 'invert brightness-200' : ''}`}
                          onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }}
                        />
                        <Code2 className="w-8 h-8 text-slate-500 hidden" />
                      </div>
                      
                      <div className="text-right">
                        <span className={`text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-full bg-slate-950 border border-slate-800 ${fw.textColor}`}>
                          Seguridad: {fw.level}
                        </span>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-2xl font-bold text-white tracking-tight">{fw.name}</h3>
                      <p className="text-xs text-slate-400 font-medium mb-3 mt-1">{fw.type}</p>
                    </div>
                    
                    <p className="text-slate-300 text-sm flex-grow mb-6 leading-relaxed">
                      {fw.description}
                    </p>
                    
                    {/* Barra de Score */}
                    <div className="mt-auto pt-4 border-t border-slate-800">
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-slate-400 font-medium">Security Score</span>
                        <span className="text-white font-bold">{fw.score}/100</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${fw.barColor} rounded-full shadow-[0_0_10px_currentColor] transition-all duration-1000 ease-out`}
                          style={{ width: `${fw.score}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* VISTA: TABLA MATRIZ */}
          {activeTab === 'table' && (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-[0.98] duration-500">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-950/80 border-b border-slate-800">
                    <tr>
                      <th className="px-6 py-5 font-bold text-slate-200 uppercase tracking-wider text-xs">Tecnología</th>
                      <th className="px-6 py-5 font-bold text-slate-200 uppercase tracking-wider text-xs">Protección XSS</th>
                      <th className="px-6 py-5 font-bold text-slate-200 uppercase tracking-wider text-xs">Protección CSRF</th>
                      <th className="px-6 py-5 font-bold text-slate-200 uppercase tracking-wider text-xs">Score Global</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {frameworks.map((fw) => (
                      <tr key={`table-${fw.id}`} className="hover:bg-slate-800/40 transition-colors group">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-slate-950 flex items-center justify-center p-1 border border-slate-800">
                               <img src={fw.logo} alt={fw.name} className={`max-w-full max-h-full object-contain ${fw.invertLogo ? 'invert brightness-200' : ''}`} />
                            </div>
                            <div>
                              <div className="font-bold text-white group-hover:text-cyan-300 transition-colors">{fw.name}</div>
                              <div className="text-[10px] text-slate-500">{fw.type}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-300 max-w-xs truncate" title={fw.xss}>{fw.xss}</td>
                        <td className="px-6 py-4 text-slate-300 max-w-xs truncate" title={fw.csrf}>{fw.csrf}</td>
                        <td className="px-6 py-4">
                           <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-slate-950 border border-slate-800 ${fw.textColor}`}>
                             {fw.score >= 90 ? <ShieldCheck className="w-3.5 h-3.5" /> : (fw.score >= 75 ? <Activity className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />)}
                             {fw.score} pts
                           </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-4 bg-slate-950/80 text-xs text-slate-400 flex items-center justify-center gap-2 border-t border-slate-800">
                <Info className="w-4 h-4 text-cyan-500" />
                Haz clic en la vista "Tarjetas" sobre cualquier framework para ver el reporte detallado de inyección SQL y Autenticación.
              </div>
            </div>
          )}

          {/* VISTA: CONCLUSIONES */}
          {activeTab === 'conclusions' && (
            <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
              <div className="space-y-4">
                {reportData.conclusions.map((text, i) => (
                  <div key={i} className="flex gap-5 bg-slate-900/40 p-6 rounded-2xl border border-slate-800/80 hover:border-cyan-500/40 hover:bg-slate-800/40 transition-all duration-300 group">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-xl bg-slate-950 flex items-center justify-center border border-slate-800 group-hover:border-cyan-500/50 group-hover:text-cyan-400 text-slate-500 font-bold text-lg shadow-inner transition-all">
                        0{i + 1}
                      </div>
                    </div>
                    <p className="text-slate-300 leading-relaxed pt-1 text-lg">
                      {text}
                    </p>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 p-8 rounded-3xl bg-gradient-to-r from-emerald-900/20 to-cyan-900/20 border border-emerald-500/30 flex flex-col sm:flex-row items-center sm:items-start gap-6 relative overflow-hidden shadow-[0_0_30px_rgba(16,185,129,0.1)]">
                <div className="absolute top-0 left-0 w-1 bg-gradient-to-b from-emerald-400 to-cyan-400 h-full"></div>
                <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 flex-shrink-0">
                  <ShieldCheck className="w-10 h-10 text-emerald-400" />
                </div>
                <div className="text-center sm:text-left">
                  <h3 className="text-white font-bold text-xl mb-3">Veredicto Final del Auditor</h3>
                  <p className="text-emerald-100/70 leading-relaxed text-lg">
                    No existe el "framework perfecto". Sin embargo, para aplicaciones empresariales críticas, 
                    la estrategia más segura es optar por ecosistemas como <strong className="text-emerald-300">Laravel o Rails</strong>, 
                    cuyas políticas de "seguridad por defecto" minimizan drásticamente el error humano inicial.
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* MODAL DETALLE DE FRAMEWORK */}
      {selectedFramework && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div 
            className={`relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-950 border-2 ${selectedFramework.borderColor} rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.8)] animate-in zoom-in-[0.95] duration-300 flex flex-col`}
          >
            {/* Cabecera Modal */}
            <div className={`sticky top-0 z-20 flex justify-between items-center p-6 sm:px-8 bg-slate-900/95 backdrop-blur-xl border-b ${selectedFramework.borderColor}`}>
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 bg-slate-950 rounded-2xl p-3 flex items-center justify-center border border-slate-700 shadow-inner">
                   <img src={selectedFramework.logo} alt="" className={`max-w-full max-h-full object-contain ${selectedFramework.invertLogo ? 'invert brightness-200' : ''}`} />
                </div>
                <div>
                  <h2 className="text-3xl font-extrabold text-white tracking-tight">{selectedFramework.name}</h2>
                  <div className="flex gap-3 mt-1">
                    <span className={selectedFramework.textColor + " font-medium"}>{selectedFramework.type}</span>
                    <span className="text-slate-600">•</span>
                    <span className="text-slate-400">Score: {selectedFramework.score}/100</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setSelectedFramework(null)}
                className="p-2.5 rounded-xl bg-slate-800 text-slate-400 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30 border border-transparent transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Contenido Modal */}
            <div className="p-6 sm:p-8 space-y-6 relative overflow-hidden">
              {/* Marca de agua de fondo */}
              <Shield className={`absolute top-20 right-10 w-96 h-96 ${selectedFramework.textColor} opacity-5 pointer-events-none`} />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                <ModalDetailCard icon={<Code2 />} title="Protección XSS" content={selectedFramework.xss} color="cyan" />
                <ModalDetailCard icon={<ShieldAlert />} title="Protección CSRF" content={selectedFramework.csrf} color="orange" />
                <ModalDetailCard icon={<Lock />} title="Autenticación y Sesiones" content={selectedFramework.auth} color="emerald" />
                <ModalDetailCard icon={<Database />} title="Inyección SQL" content={selectedFramework.sql} color="blue" />
              </div>

              <div className={`p-6 rounded-2xl border bg-slate-900/80 backdrop-blur-sm ${selectedFramework.borderColor} relative z-10 flex gap-4 items-start`}>
                <ServerCrash className={`w-8 h-8 flex-shrink-0 mt-1 ${selectedFramework.textColor}`} />
                <div>
                  <h4 className="text-white font-bold text-lg mb-2">Análisis Crítico (Pros y Contras)</h4>
                  <p className="text-slate-300 leading-relaxed">
                    {selectedFramework.prosCons}
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Componente para las tarjetas del Modal
function ModalDetailCard({ icon, title, content, color }) {
  const colorStyles = {
    cyan: "text-cyan-400 bg-cyan-400/10 border-cyan-400/20",
    orange: "text-orange-400 bg-orange-400/10 border-orange-400/20",
    emerald: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
    blue: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  };

  return (
    <div className="p-5 rounded-2xl bg-slate-950/50 border border-slate-800 hover:border-slate-600 transition-colors">
      <div className="flex items-center gap-3 mb-3">
        <div className={`p-2.5 rounded-xl ${colorStyles[color]} border shadow-inner`}>
          {React.cloneElement(icon, { className: "w-5 h-5" })}
        </div>
        <h4 className="font-bold text-slate-200 text-lg">{title}</h4>
      </div>
      <p className="text-slate-400 leading-relaxed pl-1">{content}</p>
    </div>
  );
}