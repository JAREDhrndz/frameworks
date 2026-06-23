import React, { useState, useEffect } from 'react';
import { Shield, ShieldAlert, Lock, Database, Code2, Server, Layout, CheckCircle2, AlertTriangle, X, ChevronRight, Info } from 'lucide-react';

// --- DATOS EXTRAÍDOS DEL PDF ---
const reportData = {
  header: {
    university: "Universidad Tecnológica de Durango",
    career: "Ingeniería en Tecnologías de la información",
    title: "Análisis de la Seguridad en Frameworks Web",
    author: "Hernandez Ortega Jared Alonso",
    group: "8°A",
    teacher: "Marco Antonio Vasquez Orozco",
    date: "Junio 2026"
  },
  summary: "La seguridad en el desarrollo de aplicaciones web es un pilar fundamental en el ciclo de vida del software. Su importancia radica en la necesidad de proteger la integridad, confidencialidad y disponibilidad de la información frente a amenazas en constante evolución. Las vulnerabilidades pueden resultar en robo de datos, pérdidas financieras y daño reputacional. El uso de frameworks modernos es recomendado, ya que incorporan protecciones por defecto contra los ataques más comunes (OWASP).",
  conclusions: [
    "El nivel de robustez en la seguridad depende en gran medida de la naturaleza del framework (Full-stack vs. Frontend/Micro-framework) y del paradigma bajo el cual operan.",
    "Frameworks full-stack como Ruby on Rails y Laravel son los más robustos por defecto. Resuelven problemas de inyección SQL, CSRF y XSS sin configuración activa desde cero. Es 'difícil cometer errores graves' accidentalmente.",
    "Ecosistemas basados en JavaScript y Node.js (Express.js) ofrecen flexibilidad inigualable, pero delegan la total responsabilidad al desarrollador, elevando el riesgo si el equipo carece de experiencia.",
    "En la capa de presentación, Angular destaca gracias a su mecanismo Strict Contextual Escaping (SCE), ofreciendo un enfoque más conservador que React/Vue.",
    "No existe un 'framework perfecto', pero para minimizar riesgos en aplicaciones empresariales críticas, elegir un framework con medidas robustas por defecto representa la mejor estrategia defensiva inicial."
  ]
};

const frameworks = [
  {
    id: "laravel",
    name: "Laravel",
    type: "Full-Stack (PHP)",
    logo: "https://upload.wikimedia.org/wikipedia/commons/9/9b/Laravel.svg", // URL de Logo - Reemplazable
    color: "from-red-500/20 to-orange-600/20",
    borderColor: "border-red-500/50",
    textColor: "text-red-400",
    description: "Framework full-stack altamente robusto con 'baterías incluidas'.",
    xss: "Automática mediante el motor de plantillas Blade (escapa variables usando htmlspecialchars).",
    csrf: "Incluye middleware CSRF por defecto que verifica tokens en peticiones POST/PUT/DELETE.",
    auth: "Sistemas integrados y robustos (Breeze, Jetstream, Sanctum). Roles mediante Gates y Policies.",
    sql: "Eloquent ORM y Query Builder usan enlaces PDO (consultas preparadas) por defecto.",
    vuln: "Actualizaciones frecuentes, parches documentados y ecosistema monitoreado.",
    resources: "Laravel Sanctum, Laravel Shift.",
    prosCons: "Ventaja: Alta seguridad 'out-of-the-box'. Desventaja: Pesado en recursos si no se optimiza."
  },
  {
    id: "express",
    name: "Express.js (Node)",
    type: "Micro-Framework (JS)",
    logo: "https://upload.wikimedia.org/wikipedia/commons/6/64/Expressjs.png", // URL de Logo - Reemplazable
    invertLogo: true,
    color: "from-gray-500/20 to-gray-700/20",
    borderColor: "border-gray-400/50",
    textColor: "text-gray-300",
    description: "Minimalista. No incluye seguridad 'out-of-the-box'; depende de middlewares activos.",
    xss: "Depende del motor de plantillas (EJS, Pug) o requiere sanitización manual (DOMPurify).",
    csrf: "Requiere middleware de terceros.",
    auth: "Requiere implementación manual (ej. Passport.js, JWT, bcrypt).",
    sql: "Depende del motor de base de datos u ORM (Sequelize, Prisma). No protegido nativamente.",
    vuln: "NPM Audit permite escanear vulnerabilidades, pero el framework requiere vigilancia manual.",
    resources: "Helmet.js, Express-rate-limit, Passport.js.",
    prosCons: "Ventaja: Alta flexibilidad. Desventaja: Seguridad manual; propenso a errores humanos."
  },
  {
    id: "angular",
    name: "Angular",
    type: "Frontend Framework",
    logo: "https://upload.wikimedia.org/wikipedia/commons/c/cf/Angular_full_color_logo.svg", // URL de Logo - Reemplazable
    color: "from-red-600/20 to-pink-600/20",
    borderColor: "border-red-500/50",
    textColor: "text-red-500",
    description: "Framework frontend completo con enfoque estricto en sanitización.",
    xss: "Mecanismo nativo Strict Contextual Escaping (SCE) muy riguroso.",
    csrf: "Soporte integrado en HttpClient para leer y enviar cookies XSRF-TOKEN.",
    auth: "Manejado vía interceptores HTTP y Route Guards para protección del lado del cliente.",
    sql: "N/A (Capa de Frontend). Depende completamente del backend.",
    vuln: "Auditorías regulares de Google. Angular CLI notifica sobre dependencias vulnerables.",
    resources: "DOMPurify, Angular Route Guards.",
    prosCons: "Ventaja: Muy estricto por defecto con XSS. Desventaja: Curva de aprendizaje alta."
  },
  {
    id: "reactvue",
    name: "React.js / Vue.js",
    type: "Frontend Library",
    logo: "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg", // URL de Logo - Reemplazable
    color: "from-blue-500/20 to-cyan-500/20",
    borderColor: "border-cyan-500/50",
    textColor: "text-cyan-400",
    description: "Librerías enfocadas en la UI. Escapan datos insertados pero dependen del backend.",
    xss: "Escapan datos insertados en el DOM (JSX en React, Templates en Vue).",
    csrf: "No manejan CSRF directamente. Requieren configuración en la solicitud (Axios, Fetch).",
    auth: "Depende de bibliotecas externas (React Router, Vue Router) para proteger rutas del cliente.",
    sql: "N/A (Capa de Frontend).",
    vuln: "Monitoreo de comunidad activa. Requiere mantener dependencias (NPM Audit).",
    resources: "DOMPurify (si se inyecta HTML), interceptors Axios.",
    prosCons: "Ventaja: Prevención eficaz del XSS típico. Desventaja: APIs como v-html o dangerouslySetInnerHTML introducen riesgos graves."
  },
  {
    id: "nextjs",
    name: "Next.js",
    type: "Full-Stack (React)",
    logo: "https://upload.wikimedia.org/wikipedia/commons/8/8e/Nextjs-logo.svg", // URL de Logo - Reemplazable
    invertLogo: true,
    color: "from-slate-700/20 to-black/20",
    borderColor: "border-slate-500/50",
    textColor: "text-white",
    description: "Renderizado del lado del servidor. Introduce nuevos vectores de ataque.",
    xss: "Al igual que React, escapa HTML por defecto mediante JSX.",
    csrf: "Manejo automático en endpoints de NextAuth.js; para APIs personalizadas se debe implementar.",
    auth: "Altamente integrado con NextAuth.js (Auth.js) para OAuth, JWT y sesiones de BD.",
    sql: "Depende del ORM usado en las rutas API (Prisma, Drizzle).",
    vuln: "Vercel y la comunidad gestionan parches rápidos. Alerta sobre variables de entorno públicas.",
    resources: "NextAuth.js, Prisma ORM, Helmet-csp.",
    prosCons: "Ventaja: Excelente manejo de autenticación. Desventaja: Complejidad al mezclar lógica de cliente y servidor."
  },
  {
    id: "rails",
    name: "Ruby on Rails",
    type: "Full-Stack (Ruby)",
    logo: "https://upload.wikimedia.org/wikipedia/commons/6/62/Ruby_On_Rails_Logo.svg", // URL de Logo - Reemplazable
    color: "from-red-700/20 to-red-900/20",
    borderColor: "border-red-600/50",
    textColor: "text-red-500",
    description: "Filosofía 'baterías incluidas' y convención sobre configuración.",
    xss: "Escapa automáticamente la salida HTML en sus vistas (ERB).",
    csrf: "Tokens automáticos insertados en etiquetas meta y formularios. Verificación nativa.",
    auth: "Gemas sumamente seguras (Devise para autenticación, Pundit/CanCanCan para autorización).",
    sql: "ActiveRecord realiza consultas parametrizadas de forma transparente.",
    vuln: "Guías de seguridad detalladas, escáneres de comunidad robustos (como Brakeman).",
    resources: "Gema Brakeman, Devise.",
    prosCons: "Ventaja: Minimiza fallos por olvidos. Desventaja: La 'magia' del framework puede ocultar el funcionamiento a principiantes."
  }
];

export default function SecurityDashboard() {
  const [activeTab, setActiveTab] = useState('grid'); // 'grid', 'table', 'conclusions'
  const [selectedFramework, setSelectedFramework] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans selection:bg-cyan-500/30">
      {/* Background Pattern */}
      <div className="fixed inset-0 z-0 opacity-20 pointer-events-none bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

      {/* Navbar / Header */}
      <header className={`relative z-10 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-500/10 rounded-lg border border-cyan-500/30">
              <Shield className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">{reportData.header.title}</h1>
              <p className="text-xs text-cyan-500 font-medium uppercase tracking-wider">{reportData.header.university}</p>
            </div>
          </div>
          <div className="text-right text-sm">
            <p className="text-slate-400">Por: <span className="text-slate-200 font-medium">{reportData.header.author}</span></p>
            <p className="text-slate-500 text-xs">{reportData.header.date} • {reportData.header.career}</p>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        
        {/* Hero Section */}
        <section className={`mb-16 max-w-4xl transition-all duration-1000 delay-200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm mb-6">
            <Info className="w-4 h-4" /> Resumen Ejecutivo
          </div>
          <h2 className="text-4xl font-bold text-white mb-6 leading-tight">
            Protegiendo el <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Ciclo de Vida del Software</span>
          </h2>
          <p className="text-lg text-slate-400 leading-relaxed border-l-4 border-cyan-500 pl-6">
            {reportData.summary}
          </p>
        </section>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-slate-900/50 p-1 rounded-xl mb-8 w-fit border border-slate-800">
          <button 
            onClick={() => setActiveTab('grid')}
            className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 ${activeTab === 'grid' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.15)]' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}
          >
            <Layout className="w-4 h-4" /> Frameworks
          </button>
          <button 
            onClick={() => setActiveTab('table')}
            className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 ${activeTab === 'table' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.15)]' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}
          >
            <Database className="w-4 h-4" /> Tabla Comparativa
          </button>
          <button 
            onClick={() => setActiveTab('conclusions')}
            className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 ${activeTab === 'conclusions' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.15)]' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}
          >
            <CheckCircle2 className="w-4 h-4" /> Conclusiones
          </button>
        </div>

        {/* Views Container */}
        <div className="min-h-[500px]">
          
          {/* VIEW: GRID */}
          {activeTab === 'grid' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
              {frameworks.map((fw) => (
                <div 
                  key={fw.id}
                  onClick={() => setSelectedFramework(fw)}
                  className={`group cursor-pointer relative p-6 rounded-2xl bg-gradient-to-br ${fw.color} border ${fw.borderColor} backdrop-blur-sm hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-cyan-500/10 overflow-hidden`}
                >
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Shield className={`w-24 h-24 ${fw.textColor}`} />
                  </div>
                  
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex items-center gap-4 mb-4">
                      {/* Espacio para el logo, con fallback bonito si falla la URL */}
                      <div className="w-14 h-14 rounded-xl bg-slate-900/80 p-2 flex items-center justify-center border border-slate-700 shadow-inner">
                        <img 
                          src={fw.logo} 
                          alt={`Logo ${fw.name}`} 
                          className={`max-w-full max-h-full object-contain drop-shadow-md transition-all ${fw.invertLogo ? 'invert brightness-200' : ''}`}
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'block';
                          }}
                        />
                        {/* Fallback Icon */}
                        <Code2 className="w-8 h-8 text-slate-400 hidden" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">{fw.name}</h3>
                        <span className={`text-xs font-semibold px-2 py-1 rounded bg-slate-900/50 ${fw.textColor}`}>
                          {fw.type}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-slate-300 text-sm flex-grow mt-2">
                      {fw.description}
                    </p>
                    
                    <div className="mt-6 flex items-center text-cyan-400 text-sm font-medium group-hover:text-cyan-300 transition-colors">
                      Ver Análisis de Seguridad <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* VIEW: TABLE */}
          {activeTab === 'table' && (
            <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-700">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-400 uppercase bg-slate-950/80 border-b border-slate-800">
                  <tr>
                    <th className="px-6 py-4 font-semibold text-white">Framework</th>
                    <th className="px-6 py-4 font-semibold">Protección XSS</th>
                    <th className="px-6 py-4 font-semibold">Protección CSRF</th>
                    <th className="px-6 py-4 font-semibold">Inyección SQL</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {frameworks.map((fw) => (
                    <tr key={`table-${fw.id}`} className="hover:bg-slate-800/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-white whitespace-nowrap flex items-center gap-3">
                        <img src={fw.logo} alt={fw.name} className={`w-6 h-6 object-contain ${fw.invertLogo ? 'invert brightness-200' : ''}`} onError={(e) => e.target.style.display = 'none'} />
                        {fw.name}
                      </td>
                      <td className="px-6 py-4 text-slate-300">{fw.xss}</td>
                      <td className="px-6 py-4 text-slate-300">{fw.csrf}</td>
                      <td className="px-6 py-4 text-slate-300">{fw.sql}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="p-4 bg-slate-950/80 text-xs text-slate-500 flex items-center justify-center gap-2 border-t border-slate-800">
                <Info className="w-4 h-4" />
                Haz clic en las tarjetas de la vista "Frameworks" para ver los detalles completos, incluyendo Autenticación y Vulnerabilidades.
              </div>
            </div>
          )}

          {/* VIEW: CONCLUSIONS */}
          {activeTab === 'conclusions' && (
            <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-700">
              {reportData.conclusions.map((text, i) => (
                <div key={i} className="flex gap-4 bg-slate-900/40 p-6 rounded-2xl border border-slate-800 hover:border-cyan-500/30 transition-colors">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20 text-cyan-400 font-bold">
                      {i + 1}
                    </div>
                  </div>
                  <p className="text-lg text-slate-300 leading-relaxed pt-1">
                    {text}
                  </p>
                </div>
              ))}
              
              <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/30 flex items-start gap-4">
                <ShieldCheck className="w-8 h-8 text-emerald-400 flex-shrink-0" />
                <div>
                  <h3 className="text-white font-bold text-lg mb-2">Veredicto Final</h3>
                  <p className="text-emerald-100/80">
                    Elegir un framework con medidas de seguridad robustas activadas por defecto (como Laravel o Rails) representa la mejor estrategia defensiva inicial para proyectos empresariales críticos.
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* MODAL / DETALLE DE FRAMEWORK */}
      {selectedFramework && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            className={`relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-slate-900 border ${selectedFramework.borderColor} rounded-3xl shadow-2xl shadow-black animate-in zoom-in-95 duration-300`}
          >
            {/* Cabecera Modal */}
            <div className={`sticky top-0 z-10 flex justify-between items-center p-6 bg-slate-900/90 backdrop-blur-md border-b ${selectedFramework.borderColor}`}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/5 rounded-xl p-2 flex items-center justify-center border border-white/10 shadow-inner">
                   <img src={selectedFramework.logo} alt="" className={`max-w-full max-h-full object-contain ${selectedFramework.invertLogo ? 'invert brightness-200' : ''}`} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">{selectedFramework.name}</h2>
                  <p className={selectedFramework.textColor}>{selectedFramework.type}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedFramework(null)}
                className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Contenido Modal */}
            <div className="p-6 space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DetailCard icon={<Code2 />} title="Protección XSS" content={selectedFramework.xss} color="cyan" />
                <DetailCard icon={<ShieldAlert />} title="Protección CSRF" content={selectedFramework.csrf} color="orange" />
                <DetailCard icon={<Lock />} title="Autenticación / Autorización" content={selectedFramework.auth} color="emerald" />
                <DetailCard icon={<Database />} title="Prevención SQLi" content={selectedFramework.sql} color="blue" />
                <DetailCard icon={<AlertTriangle />} title="Manejo de Vulnerabilidades" content={selectedFramework.vuln} color="yellow" />
                <DetailCard icon={<Layout />} title="Recursos Recomendados" content={selectedFramework.resources} color="purple" />
              </div>

              <div className={`mt-6 p-5 rounded-xl border ${selectedFramework.borderColor} bg-slate-950/50`}>
                <h4 className="text-white font-bold mb-2 flex items-center gap-2">
                  <CheckCircle2 className={`w-5 h-5 ${selectedFramework.textColor}`} />
                  Ventajas y Desventajas
                </h4>
                <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                  {selectedFramework.prosCons.replace("Desventaja:", "\n\nDesventaja:")}
                </p>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Componente auxiliar para el Modal
function DetailCard({ icon, title, content, color }) {
  const colorMap = {
    cyan: "text-cyan-400 bg-cyan-400/10 border-cyan-400/20",
    orange: "text-orange-400 bg-orange-400/10 border-orange-400/20",
    emerald: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
    blue: "text-blue-400 bg-blue-400/10 border-blue-400/20",
    yellow: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
    purple: "text-purple-400 bg-purple-400/10 border-purple-400/20",
  };

  return (
    <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
      <div className="flex items-center gap-2 mb-3">
        <div className={`p-2 rounded-lg ${colorMap[color]} border`}>
          {React.cloneElement(icon, { className: "w-4 h-4" })}
        </div>
        <h4 className="font-semibold text-slate-200">{title}</h4>
      </div>
      <p className="text-sm text-slate-400 leading-relaxed">{content}</p>
    </div>
  );
}

// Componente para evitar errores si usas ShieldCheck (alias)
function ShieldCheck(props) {
  return <Shield {...props} />;
}