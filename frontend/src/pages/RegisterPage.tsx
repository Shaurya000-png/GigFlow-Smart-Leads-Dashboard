import React from 'react';
import { RegisterForm } from '../components/auth/RegisterForm';
import { AnimatedText } from '../components/ui/AnimatedText';

const RegisterPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4 relative overflow-hidden">
      <div className="absolute top-[-15%] right-[-5%] w-[45%] h-[45%] bg-primary/10 rounded-full blur-[140px] pointer-events-none animate-subtle-glow" />
      <div className="absolute bottom-[-15%] left-[-5%] w-[50%] h-[50%] bg-[#0f1729]/80 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md z-10 flex flex-col items-center gap-6">
        <div className="text-center">
          <AnimatedText
            as="h1"
            animation="text-reveal"
            className="text-xl font-heading font-semibold tracking-premium"
          >
            <span className="text-accent">Gig</span>
            <span className="text-textMain">Flow</span>
          </AnimatedText>
          <AnimatedText as="p" delay={100} className="text-2xs text-textMuted mt-2 tracking-wide uppercase">
            Create your workspace
          </AnimatedText>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
};

export default RegisterPage;
