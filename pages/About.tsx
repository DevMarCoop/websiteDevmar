import React from 'react';
import { Users, Target, Heart } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';
import { useLanguage } from '../contexts/LanguageContext';

const About: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="w-full bg-white">
      {/* Header */}
      <div className="bg-brand-bg py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal>
            <h1 className="text-4xl font-display font-bold text-brand-blue mb-6">{t.about.title}</h1>
            <p className="text-xl text-brand-slate max-w-3xl mx-auto">
              {t.about.subtitle}
            </p>
          </ScrollReveal>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <ScrollReveal delay={0.1}>
            <div>
              <h2 className="text-3xl font-display font-bold text-brand-blue mb-6">
                {t.about.strengthTitle}
              </h2>
              <div className="space-y-6 text-brand-slate">
                <p dangerouslySetInnerHTML={{ __html: t.about.strengthP1 }} />
                <p>{t.about.strengthP2}</p>
                <p>{t.about.strengthP3}</p>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.3}>
            <div className="bg-brand-bg rounded-2xl p-8 border border-brand-slate/10">
              <img 
                src="/images/sobre.jpg" 
                alt="Equipe DevMar" 
                className="rounded-lg shadow-lg mb-6 w-full object-cover h-64"
              />
              <div className="flex items-center justify-between text-brand-blue font-display font-bold">
                <span>{t.about.foundedIn}</span>
                <span>{t.about.globalReach}</span>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Values */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <ScrollReveal delay={0.1}>
            <div className="text-center p-6">
              <div className="bg-brand-blue/5 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-brand-blue h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-brand-blue mb-2">{t.about.collaborationTitle}</h3>
              <p className="text-brand-slate text-sm">{t.about.collaborationDesc}</p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.3}>
            <div className="text-center p-6">
              <div className="bg-brand-blue/5 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="text-brand-blue h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-brand-blue mb-2">{t.about.innovationTitle}</h3>
              <p className="text-brand-slate text-sm">{t.about.innovationDesc}</p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.5}>
            <div className="text-center p-6">
              <div className="bg-brand-blue/5 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="text-brand-blue h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-brand-blue mb-2">{t.about.ethicsTitle}</h3>
              <p className="text-brand-slate text-sm">{t.about.ethicsDesc}</p>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
};

export default About;
