import React from 'react';
import { Code, Terminal, Server, BarChart, Globe, Cpu, Shield, GraduationCap } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';
import { useLanguage } from '../contexts/LanguageContext';

const Services: React.FC = () => {
  const { t } = useLanguage();

  const services = [
    {
      icon: <Code className="h-8 w-8" />,
      title: t.services.softwareDev,
      desc: t.services.softwareDevDesc
    },
    {
      icon: <Terminal className="h-8 w-8" />,
      title: t.services.consulting,
      desc: t.services.consultingDesc
    },
    {
      icon: <Server className="h-8 w-8" />,
      title: t.services.support,
      desc: t.services.supportDesc
    },
    {
      icon: <BarChart className="h-8 w-8" />,
      title: t.services.dataCloud,
      desc: t.services.dataCloudDesc
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: t.services.portals,
      desc: t.services.portalsDesc
    },
    {
      icon: <Cpu className="h-8 w-8" />,
      title: t.services.aiAutomation,
      desc: t.services.aiAutomationDesc
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: t.services.security,
      desc: t.services.securityDesc
    },
    {
      icon: <GraduationCap className="h-8 w-8" />,
      title: t.services.training,
      desc: t.services.trainingDesc
    }
  ];

  return (
    <div className="w-full">
      {/* Header */}
      <div className="bg-brand-blue text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <h1 className="text-4xl font-display font-bold mb-6">{t.services.title}</h1>
            <p className="text-xl text-gray-300 max-w-2xl">
              {t.services.subtitle}
            </p>
          </ScrollReveal>
        </div>
      </div>

      {/* Grid de Serviços */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <ScrollReveal key={index} delay={index * 0.1}>
              <div 
                className="bg-white p-6 rounded-xl shadow-sm border border-brand-slate/10 hover:shadow-lg hover:border-brand-red/40 transition-all duration-300 group h-full flex flex-col"
              >
                <div className="bg-brand-bg w-14 h-14 rounded-lg flex items-center justify-center text-brand-blue mb-6 group-hover:bg-brand-blue group-hover:text-brand-red transition-colors duration-300 flex-shrink-0">
                  {service.icon}
                </div>
                <h3 className="text-lg font-bold text-brand-blue mb-3 flex-shrink-0">{service.title}</h3>
                <p className="text-brand-slate text-sm leading-relaxed flex-grow">
                  {service.desc}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
      
      {/* Footer Banner */}
      <div className="bg-brand-bg py-16 border-t border-brand-slate/10">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <ScrollReveal delay={0.1}>
            <h3 className="text-xl font-bold text-brand-blue mb-4">{t.services.customSolutions}</h3>
            <p className="text-brand-slate max-w-2xl mx-auto">
              {t.services.customSolutionsDesc}
            </p>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
};

export default Services;
