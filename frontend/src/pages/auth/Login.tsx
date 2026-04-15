import { useNavigate, Link } from 'react-router-dom'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { toast } from 'sonner'
import { Mail, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'
import AuthLayout from '@/layouts/AuthLayout'

const validationSchema = Yup.object({
  email: Yup.string().email('E-mail invalido').required('E-mail obrigatorio'),
  senha: Yup.string().min(1, 'Senha obrigatoria').required('Senha obrigatoria'),
})

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const formik = useFormik({
    initialValues: { email: '', senha: '' },
    validationSchema,
    onSubmit: (values) => {
      login(values.email)
      toast.success('Login realizado com sucesso!')
      navigate('/')
    },
  })

  return (
    <AuthLayout>
      <div data-testid="login-page">
        {/* Heading */}
        <h2 className="text-2xl font-bold text-foreground font-display mb-1">
          Bem-vindo de volta
        </h2>
        <p className="text-sm text-muted-foreground mb-8">
          Entre com suas credenciais para acessar sua conta
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
                data-testid="login-email"
              />
            </div>
            {formik.touched.email && formik.errors.email && (
              <p className="text-[11px] text-destructive">{formik.errors.email}</p>
            )}
          </div>

          {/* Senha */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Senha</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/60" />
              <input
                name="senha"
                type="password"
                placeholder="********"
                value={formik.values.senha}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full h-12 pl-11 pr-4 rounded-xl border bg-white text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-primary/20 focus:border-primary ${
                  formik.touched.senha && formik.errors.senha
                    ? 'border-destructive'
                    : 'border-border hover:border-muted-foreground/30'
                }`}
                data-testid="login-senha"
              />
            </div>
            {formik.touched.senha && formik.errors.senha && (
              <p className="text-[11px] text-destructive">{formik.errors.senha}</p>
            )}
          </div>

          {/* Forgot Password */}
          <div className="text-right -mt-1">
            <Link
              to="/esqueceu-senha"
              className="text-sm text-primary hover:text-primary-dark transition-colors"
              data-testid="forgot-password-link"
            >
              Esqueceu sua senha?
            </Link>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            className="w-full h-12 rounded-xl text-sm font-semibold"
            data-testid="login-submit-btn"
          >
            Entrar
          </Button>
        </form>

        {/* Register Link */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          Nao tem uma conta?{' '}
          <Link
            to="/cadastro"
            className="text-primary font-medium hover:text-primary-dark transition-colors"
            data-testid="register-link"
          >
            Cadastre-se
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}
