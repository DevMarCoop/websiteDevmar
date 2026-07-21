import React, { useEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  const navigationType = useNavigationType();
  const isFirstRender = useRef(true);

  useEffect(() => {
    // Função para rolar para o topo
    const scrollToTop = () => {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    };

    // Só rola para o topo em navegação PUSH (links clicados)
    // Não rola em POP (botão voltar/avançar) para preservar a posição
    if (navigationType === 'PUSH') {
      scrollToTop();
    }
    
    // Na primeira renderização (carregamento da página), sempre vai ao topo
    if (isFirstRender.current) {
      scrollToTop();
      isFirstRender.current = false;
    }
  }, [pathname, navigationType]);

  return null;
};

export default ScrollToTop;

