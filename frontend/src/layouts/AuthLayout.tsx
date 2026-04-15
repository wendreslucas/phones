import type { ReactNode } from 'react'

const BG_IMAGE = 'https://images.unsplash.com/photo-1623375505612-7f85294c9e29?auto=format&fit=crop&w=1200&q=80'

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex" data-testid="auth-layout">
      {/* Left Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-[hsl(210,20%,98%)] p-6 sm:p-10">
        <div className="w-full max-w-md">
          {/* Brand */}
          <div className="mb-8">
            <h1
              className="text-3xl font-bold text-primary font-display italic tracking-tight"
              data-testid="auth-brand"
            >
              StoreManager Pro
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Gestao inteligente de lojas
            </p>
          </div>
          {children}
        </div>
      </div>

      {/* Right Panel - Hero Image */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden">
        <img
          src={BG_IMAGE}
          alt="Loja"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Blue overlay */}
        <div className="absolute inset-0 bg-primary/75" />
        {/* Text content */}
        <div className="relative z-10 flex flex-col items-center justify-center w-full px-12 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-white font-display leading-tight">
            Gerencie suas lojas<br />com eficiencia
          </h2>
          <p className="text-white/80 mt-4 text-base lg:text-lg max-w-md">
            Controle completo do seu negocio em um so lugar
          </p>
        </div>
      </div>
    </div>
  )
}
