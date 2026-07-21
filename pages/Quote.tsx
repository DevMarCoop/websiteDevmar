import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight, FileText, Calendar, DollarSign, Building2, User, Mail, MessageSquare, ChevronDown, Loader2, CheckCircle, XCircle, Phone, Hash, Globe, Search, Briefcase } from 'lucide-react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import Button from '../components/Button';
import ScrollReveal from '../components/ScrollReveal';
import { useLanguage } from '../contexts/LanguageContext';
import { sendQuoteEmail } from '../services/emailServiceQuote';

const Quote: React.FC = () => {
  const { t } = useLanguage();
  const formRef = useRef<HTMLFormElement>(null);
  const [formState, setFormState] = useState({
    name: '',
    phone: '',
    email: '',
    company: '',
    cnpj: '',
    website: '',
    segment: '',
    service: '',
    description: '',
    deadline: '',
    budget: ''
  });
  const [nameError, setNameError] = useState('');
  const [segmentError, setSegmentError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [segmentDropdownOpen, setSegmentDropdownOpen] = useState(false);
  const [segmentSearch, setSegmentSearch] = useState('');

  const services = [
    t.services.softwareDev,
    t.services.consulting,
    t.services.support,
    t.services.dataCloud,
    t.services.portals,
    t.services.aiAutomation,
    t.services.security,
    t.services.training
  ];

  const segments = [
    'Consultoria e Contabilidade',
    'Comunicação, Marketing e Agências',
    'Serviços Financeiros (Bancos, Corretoras, Seguros)',
    'Recursos Humanos e Recrutamento',
    'Serviços de Engenharia e Arquitetura',
    'SaaS, TI, Telecom e Internet',
    'Desenvolvimento de Software e Aplicativos',
    'E-commerce e Negócios Digitais',
    'Hardware e Eletrônicos',
    'Moda, Varejo e Lojas',
    'Supermercados e Atacados',
    'Distribuição e Logística',
    'Comércio de Produtos Específicos (Ex: Automotivo, Pet)',
    'Serviços Automotivos e Mecânica (Oficinas, Funilaria, Peças)',
    'Saúde, Clínicas e Médicos',
    'Estética, Salão de Beleza e Barbearia',
    'Farmácias e Produtos Farmacêuticos',
    'Academias e Fitness',
    'Restaurantes e Lanchonetes',
    'Bares, Cafeterias e Casas Noturnas',
    'Hotelaria e Turismo (Hotéis, Pousadas, Agências)',
    'Indústria de Alimentos e Bebidas',
    'Indústria de Transformação (Metalurgia, Plástico, etc.)',
    'Indústria Química e Petroquímica',
    'Indústria Têxtil e de Confecção',
    'Energia e Utilities (Água, Gás, Eletricidade)',
    'Construção Civil, Imobiliário e Infraestrutura',
    'Materiais de Construção e Decoração',
    'Educação e Ensino (Escolas, Cursos, Treinamentos)',
    'Artes, Cultura e Entretenimento',
    'Esportes, Lazer e Clubes (Inclui Artigos Esportivos e Torcidas)',
    'Agronegócio e Agropecuária',
    'Extrativismo e Mineração',
    'MEI (Microempreendedor Individual)',
    'Não tenho empresa',
    'Outros'
  ];

  const filteredSegments = segments.filter(segment =>
    segment.toLowerCase().includes(segmentSearch.toLowerCase())
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (segmentDropdownOpen) {
        const target = event.target as HTMLElement;
        if (!target.closest('.segment-dropdown-container')) {
          setSegmentDropdownOpen(false);
          setSegmentSearch('');
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [segmentDropdownOpen]);

  const validateName = (name: string): boolean => {
    const words = name.trim().split(/\s+/).filter(word => word.length > 0);
    return words.length > 1;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formRef.current) return;
    
    // Validate name has more than 1 word
    if (!validateName(formState.name)) {
      setNameError('Por favor, informe seu nome completo (nome e sobrenome)');
      return;
    }
    setNameError('');

    // Validate segment is selected
    if (!formState.segment || formState.segment.trim() === '') {
      setSegmentError('Por favor, selecione o segmento da sua empresa');
      return;
    }
    setSegmentError('');
    
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      await sendQuoteEmail(formRef.current);
      
      setSubmitStatus('success');
      setFormState({
        name: '',
        phone: '',
        email: '',
        company: '',
        cnpj: '',
        website: '',
        segment: '',
        service: '',
        description: '',
        deadline: '',
        budget: ''
      });
      setSegmentSearch('');
      
      // Reset status after 5 seconds
      setTimeout(() => setSubmitStatus('idle'), 5000);
    } catch (error) {
      console.error('EmailJS Error:', error);
      setSubmitStatus('error');
      
      // Reset status after 5 seconds
      setTimeout(() => setSubmitStatus('idle'), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = e.target.value;
    const fieldId = e.target.id;
    
    // Clear name error when user types
    if (fieldId === 'name') {
      setNameError('');
    }
    
    setFormState({
      ...formState,
      [fieldId]: value
    });
  };

  const handlePhoneChange = (value: string) => {
    setFormState(prev => ({
      ...prev,
      phone: value
    }));
  };

  return (
    <div className="w-full bg-brand-bg min-h-[calc(100vh-80px)]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Header */}
        <div className="text-center mb-12">
          <ScrollReveal>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-brand-blue mb-4">
              {t.quote.title}
            </h1>
            <p className="text-brand-slate text-lg max-w-2xl mx-auto">
              {t.quote.subtitle}
            </p>
          </ScrollReveal>
        </div>

        {/* Form */}
        <ScrollReveal delay={0.2}>
          <div className="bg-white p-8 md:p-10 rounded-2xl shadow-lg border-t-4 border-brand-red">
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-brand-red/10 p-3 rounded-lg">
                <FileText className="h-6 w-6 text-brand-red" />
              </div>
              <h2 className="text-2xl font-display font-bold text-brand-blue">
                {t.quote.formTitle}
              </h2>
            </div>

            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
              {/* Nome Completo */}
              <div>
                <label htmlFor="name" className="flex items-center gap-2 text-sm font-medium text-brand-slate mb-2">
                  <User className="h-4 w-4" />
                  {t.quote.nameLabel} <span className="text-brand-red">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className={`w-full px-4 py-3 rounded-lg bg-brand-bg border ${
                    nameError ? 'border-red-500' : 'border-brand-slate/20'
                  } focus:border-brand-red focus:bg-white focus:ring-2 focus:ring-brand-red/20 transition-all text-brand-blue`}
                  placeholder={t.quote.namePlaceholder}
                  value={formState.name}
                  onChange={handleChange}
                />
                {nameError && (
                  <p className="text-red-500 text-sm mt-1">{nameError}</p>
                )}
              </div>

              {/* Telefone e Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="phone" className="flex items-center gap-2 text-sm font-medium text-brand-slate mb-2">
                    <Phone className="h-4 w-4" />
                    {t.quote.phoneLabel} <span className="text-brand-red">*</span>
                  </label>
                  <PhoneInput
                    country={'br'}
                    value={formState.phone}
                    onChange={handlePhoneChange}
                    placeholder=""
                    inputProps={{
                      id: 'phone',
                      name: 'phone',
                      required: true
                    }}
                    containerClass="phone-input-container"
                    inputClass="w-full text-brand-blue"
                    buttonClass="phone-input-button"
                    dropdownClass="phone-input-dropdown"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="flex items-center gap-2 text-sm font-medium text-brand-slate mb-2">
                    <Mail className="h-4 w-4" />
                    {t.quote.emailLabel} <span className="text-brand-red">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full px-4 py-3 rounded-lg bg-brand-bg border border-brand-slate/20 focus:border-brand-red focus:bg-white focus:ring-2 focus:ring-brand-red/20 transition-all text-brand-blue"
                    placeholder={t.quote.emailPlaceholder}
                    value={formState.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Empresa, CNPJ e Website */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="company" className="flex items-center gap-2 text-sm font-medium text-brand-slate mb-2">
                    <Building2 className="h-4 w-4" />
                    {t.quote.companyLabel} <span className="text-brand-red">*</span>
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    required
                    className="w-full px-4 py-3 rounded-lg bg-brand-bg border border-brand-slate/20 focus:border-brand-red focus:bg-white focus:ring-2 focus:ring-brand-red/20 transition-all text-brand-blue"
                    placeholder={t.quote.companyPlaceholder}
                    value={formState.company}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label htmlFor="cnpj" className="flex items-center gap-2 text-sm font-medium text-brand-slate mb-2">
                    <Hash className="h-4 w-4" />
                    {t.quote.cnpjLabel} <span className="text-gray-500 opacity-60 text-xs font-normal">{t.quote.optional}</span>
                  </label>
                  <input
                    type="text"
                    id="cnpj"
                    name="cnpj"
                    className="w-full px-4 py-3 rounded-lg bg-brand-bg border border-brand-slate/20 focus:border-brand-red focus:bg-white focus:ring-2 focus:ring-brand-red/20 transition-all text-brand-blue"
                    placeholder={t.quote.cnpjPlaceholder}
                    value={formState.cnpj}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Website/Social Media */}
              <div>
                <label htmlFor="website" className="flex items-center gap-2 text-sm font-medium text-brand-slate mb-2">
                  <Globe className="h-4 w-4" />
                  {t.quote.websiteLabel} <span className="text-gray-500 opacity-60 text-xs font-normal">{t.quote.optional}</span>
                </label>
                <input
                  type="text"
                  id="website"
                  name="website"
                  className="w-full px-4 py-3 rounded-lg bg-brand-bg border border-brand-slate/20 focus:border-brand-red focus:bg-white focus:ring-2 focus:ring-brand-red/20 transition-all text-brand-blue"
                  placeholder={t.quote.websitePlaceholder}
                  value={formState.website}
                  onChange={handleChange}
                />
              </div>

              {/* Segmento da Empresa */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-brand-slate mb-2">
                  <Briefcase className="h-4 w-4" />
                  {t.quote.segmentLabel} <span className="text-brand-red">*</span>
                </label>
                <div className="relative segment-dropdown-container">
                  <div
                    className={`w-full px-4 py-3 rounded-lg bg-brand-bg border ${
                      segmentError ? 'border-red-500' : 'border-brand-slate/20'
                    } focus-within:border-brand-red focus-within:bg-white focus-within:ring-2 focus-within:ring-brand-red/20 transition-all cursor-pointer`}
                    onClick={() => {
                      setSegmentDropdownOpen(!segmentDropdownOpen);
                      if (segmentError) setSegmentError('');
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span className={formState.segment ? 'text-brand-blue' : 'text-brand-slate'}>
                        {formState.segment || t.quote.segmentPlaceholder}
                      </span>
                      <ChevronDown className={`h-5 w-5 text-brand-slate transition-transform ${segmentDropdownOpen ? 'transform rotate-180' : ''}`} />
                    </div>
                  </div>
                  
                  {segmentDropdownOpen && (
                    <>
                      <div 
                        className="fixed inset-0 z-10" 
                        onClick={() => {
                          setSegmentDropdownOpen(false);
                          setSegmentSearch('');
                        }}
                      />
                      <div className="absolute z-20 w-full mt-1 bg-white rounded-lg shadow-lg border border-brand-slate/20 max-h-80 overflow-hidden">
                        <div className="p-2 border-b border-brand-slate/20">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-brand-slate" />
                            <input
                              type="text"
                              placeholder={t.quote.segmentSearchPlaceholder}
                              className="w-full pl-10 pr-4 py-2 rounded-lg bg-brand-bg border border-brand-slate/20 focus:border-brand-red focus:ring-2 focus:ring-brand-red/20 text-brand-blue text-sm"
                              value={segmentSearch}
                              onChange={(e) => {
                                e.stopPropagation();
                                setSegmentSearch(e.target.value);
                              }}
                              onClick={(e) => e.stopPropagation()}
                              autoFocus
                            />
                          </div>
                        </div>
                        <div className="max-h-64 overflow-y-auto">
                          {filteredSegments.length > 0 ? (
                            filteredSegments.map((segment, index) => (
                              <button
                                key={index}
                                type="button"
                                className="w-full px-4 py-2 text-left text-sm text-brand-blue hover:bg-brand-bg transition-colors"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setFormState({ ...formState, segment });
                                  setSegmentDropdownOpen(false);
                                  setSegmentSearch('');
                                  if (segmentError) setSegmentError('');
                                }}
                              >
                                {segment}
                              </button>
                            ))
                          ) : (
                            <div className="px-4 py-2 text-sm text-brand-slate text-center">
                              {t.quote.segmentNotFound}
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                  
                  {/* Hidden input for form submission */}
                  <input
                    type="hidden"
                    name="segment"
                    value={formState.segment}
                  />
                </div>
                {segmentError && (
                  <p className="text-red-500 text-sm mt-1">{segmentError}</p>
                )}
              </div>

              {/* Tipo de Serviço */}
              <div>
                <label htmlFor="service" className="flex items-center gap-2 text-sm font-medium text-brand-slate mb-2">
                  <FileText className="h-4 w-4" />
                  {t.quote.serviceLabel} <span className="text-brand-red">*</span>
                </label>
                <div className="relative">
                  <select
                    id="service"
                    name="service"
                    required
                    className={`w-full px-4 py-3 pr-10 rounded-lg bg-brand-bg border border-brand-slate/20 focus:border-brand-red focus:bg-white focus:ring-2 focus:ring-brand-red/20 transition-all appearance-none cursor-pointer ${
                      formState.service ? 'text-brand-blue' : 'text-gray-400'
                    }`}
                    value={formState.service}
                    onChange={handleChange}
                  >
                    <option value="">{t.quote.servicePlaceholder}</option>
                    {services.map((service, index) => (
                      <option key={index} value={service}>
                        {service}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-brand-slate pointer-events-none" />
                </div>
              </div>

              {/* Descrição do Projeto */}
              <div>
                <label htmlFor="description" className="flex items-center gap-2 text-sm font-medium text-brand-slate mb-2">
                  <MessageSquare className="h-4 w-4" />
                  {t.quote.descriptionLabel} <span className="text-brand-red">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  required
                  rows={5}
                  className="w-full px-4 py-3 rounded-lg bg-brand-bg border border-brand-slate/20 focus:border-brand-red focus:bg-white focus:ring-2 focus:ring-brand-red/20 transition-all text-brand-blue resize-none"
                  placeholder={t.quote.descriptionPlaceholder}
                  value={formState.description}
                  onChange={handleChange}
                ></textarea>
              </div>

              {/* Prazo e Orçamento */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="deadline" className="flex items-center gap-2 text-sm font-medium text-brand-slate mb-2">
                    <Calendar className="h-4 w-4" />
                    {t.quote.deadlineLabel} <span className="text-gray-500 opacity-60 text-xs font-normal">{t.quote.optional}</span>
                  </label>
                  <div className="relative">
                    <select
                      id="deadline"
                      name="deadline"
                      className={`w-full px-4 py-3 pr-10 rounded-lg bg-brand-bg border border-brand-slate/20 focus:border-brand-red focus:bg-white focus:ring-2 focus:ring-brand-red/20 transition-all appearance-none cursor-pointer ${
                        formState.deadline ? 'text-brand-blue' : 'text-gray-400'
                      }`}
                      value={formState.deadline}
                      onChange={handleChange}
                    >
                      <option value="">{t.quote.deadlinePlaceholder}</option>
                      <option value="urgente">{t.quote.deadlineUrgent}</option>
                      <option value="curto-prazo">{t.quote.deadlineShort}</option>
                      <option value="medio-prazo">{t.quote.deadlineMedium}</option>
                      <option value="longo-prazo">{t.quote.deadlineLong}</option>
                      <option value="nao-definido">{t.quote.deadlineFlexible}</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-brand-slate pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label htmlFor="budget" className="flex items-center gap-2 text-sm font-medium text-brand-slate mb-2">
                    <DollarSign className="h-4 w-4" />
                    {t.quote.budgetLabel} <span className="text-gray-500 opacity-60 text-xs font-normal">{t.quote.optional}</span>
                  </label>
                  <div className="relative">
                    <select
                      id="budget"
                      name="budget"
                      className={`w-full px-4 py-3 pr-10 rounded-lg bg-brand-bg border border-brand-slate/20 focus:border-brand-red focus:bg-white focus:ring-2 focus:ring-brand-red/20 transition-all appearance-none cursor-pointer ${
                        formState.budget ? 'text-brand-blue' : 'text-gray-400'
                      }`}
                      value={formState.budget}
                      onChange={handleChange}
                    >
                      <option value="">{t.quote.budgetPlaceholder}</option>
                      <option value="ate-10k">{t.quote.budgetTo10k}</option>
                      <option value="10k-50k">{t.quote.budget10kTo50k}</option>
                      <option value="50k-100k">{t.quote.budget50kTo100k}</option>
                      <option value="100k-500k">{t.quote.budget100kTo500k}</option>
                      <option value="acima-500k">{t.quote.budgetAbove500k}</option>
                      <option value="a-definir">{t.quote.budgetTbd}</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-brand-slate pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Mensagem de Status */}
              {submitStatus === 'success' && (
                <div className="flex items-center gap-3 p-4 rounded-lg bg-green-50 border border-green-200 text-green-800">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <p>{t.quote.successMessage}</p>
                </div>
              )}
              
              {submitStatus === 'error' && (
                <div className="flex items-center gap-3 p-4 rounded-lg bg-red-50 border border-red-200 text-red-800">
                  <XCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                  <p>{t.quote.errorMessage}</p>
                </div>
              )}

              {/* Botão de Envio */}
              <div className="pt-4">
                <Button 
                  type="submit" 
                  variant="primary" 
                  className="w-full justify-center text-lg py-4"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      {t.quote.sendingButton}
                    </>
                  ) : (
                    <>
                      {t.quote.submitButton} <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
                <p className="text-sm text-brand-slate text-center mt-4">
                  {t.quote.disclaimer}
                </p>
              </div>
            </form>
          </div>
        </ScrollReveal>

        {/* Info */}
        <ScrollReveal delay={0.4}>
          <div className="mt-12 bg-white p-6 rounded-xl border border-brand-slate/10">
            <h3 className="text-lg font-bold text-brand-blue mb-4">{t.quote.whatHappens}</h3>
            <ol className="space-y-3 text-brand-slate">
              <li className="flex items-start gap-3">
                <span className="bg-brand-red text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">1</span>
                <span>{t.quote.step1}</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="bg-brand-red text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">2</span>
                <span>{t.quote.step2}</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="bg-brand-red text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">3</span>
                <span>{t.quote.step3}</span>
              </li>
            </ol>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
};

export default Quote;
