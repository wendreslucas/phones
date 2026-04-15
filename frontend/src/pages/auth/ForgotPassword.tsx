import { Link } from 'react-router-dom'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { toast } from 'sonner'
import { Mail, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

const validationSchema = Yup.object({
  email: Yup.string().email('E-mail invalido').required('E-mail obrigatorio'),
})

export default function ForgotPassword() {
  const formik = useFormik({
    initialValues: { email: '' },
    validationSchema,
    onSubmit: () => {
      toast.success('Instrucoes de recuperacao enviadas para seu e-mail!')
    },
  })

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-[hsl(210,20%,98%)] p-6"
      data-testid="forgot-password-page"
    >
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary font-display italic tracking-tight">
            StoreManager Pro
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gestao inteligente de lojas
          </p>
        </div>

        {/* Heading */}
        <h2 className="text-2xl font-bold text-foreground font-display mb-1">
          Esqueceu sua senha?
        </h2>
        <p className="text-sm text-muted-foreground mb-8">
          Digite seu e-mail para receber instrucoes de recuperacao
        </p>

        <form onSubmit={formik.handleSubmit} className="space-y-5">
          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">E-mail</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/60" />
              <input
                name="email"
                type="email"
                placeholder="seu@email.com"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full h-12 pl-11 pr-4 rounded-xl border bg-white text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-primary/20 focus:border-primary ${
                  formik.touched.email && formik.errors.email
                    ? 'border-destructive'
                    : 'border-border hover:border-muted-foreground/30'
                }`}
                data-testid="forgot-email"
              />
            </div>
            {formik.touched.email && formik.errors.email && (
              <p className="text-[11px] text-destructive">{formik.errors.email}</p>
            )}
          </div>

          {/* Submit */}
          <Button
            type="submit"
            className="w-full h-12 rounded-xl text-sm font-semibold"
            data-testid="forgot-submit-btn"
          >
            Enviar instrucoes
          </Button>
        </form>

        {/* Back to login */}
        <div className="text-center mt-6">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            data-testid="back-to-login-link"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Voltar para o login
          </Link>
        </div>
      </div>
    </div>
  )
}
