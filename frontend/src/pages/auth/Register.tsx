import { useNavigate, Link } from 'react-router-dom'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { toast } from 'sonner'
import { User, Mail, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'
import AuthLayout from '@/layouts/AuthLayout'

const validationSchema = Yup.object({
  nome: Yup.string().required('Nome obrigatorio'),
  email: Yup.string().email('E-mail invalido').required('E-mail obrigatorio'),
  senha: Yup.string().min(6, 'Minimo 6 caracteres').required('Senha obrigatoria'),
  confirmarSenha: Yup.string()
    .oneOf([Yup.ref('senha')], 'Senhas nao conferem')
    .required('Confirme sua senha'),
})

export default function Register() {
  const navigate = useNavigate()
  const { register } = useAuth()

  const formik = useFormik({
    initialValues: { nome: '', email: '', senha: '', confirmarSenha: '' },
    validationSchema,
    onSubmit: (values) => {
      register(values.nome, values.email)
      toast.success('Conta criada com sucesso!')
      navigate('/')
    },
  })

  const fieldClass = (field: string) => {
    const touched = formik.touched[field as keyof typeof formik.touched]
    const error = formik.errors[field as keyof typeof formik.errors]
    return `w-full h-12 pl-11 pr-4 rounded-xl border bg-white text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-primary/20 focus:border-primary ${
      touched && error ? 'border-destructive' : 'border-border hover:border-muted-foreground/30'
    }`
  }

  return (
    <AuthLayout>
      <div data-testid="register-page">
        <h2 className="text-2xl font-bold text-foreground font-display mb-1">
          Criar nova conta
        </h2>
        <p className="text-sm text-muted-foreground mb-8">
          Preencha os dados abaixo para comecar
        </p>

        <form onSubmit={formik.handleSubmit} className="space-y-4">
          {/* Nome */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Nome Completo</label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/60" />
              <input
                name="nome"
                type="text"
                placeholder="Seu nome completo"
                value={formik.values.nome}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={fieldClass('nome')}
                data-testid="register-nome"
              />
            </div>
            {formik.touched.nome && formik.errors.nome && (
              <p className="text-[11px] text-destructive">{formik.errors.nome}</p>
            )}
          </div>

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
                className={fieldClass('email')}
                data-testid="register-email"
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
                placeholder="Minimo 6 caracteres"
                value={formik.values.senha}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={fieldClass('senha')}
                data-testid="register-senha"
              />
            </div>
            {formik.touched.senha && formik.errors.senha && (
              <p className="text-[11px] text-destructive">{formik.errors.senha}</p>
            )}
          </div>

          {/* Confirmar Senha */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Confirmar Senha</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/60" />
              <input
                name="confirmarSenha"
                type="password"
                placeholder="Repita sua senha"
                value={formik.values.confirmarSenha}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={fieldClass('confirmarSenha')}
                data-testid="register-confirmar-senha"
              />
            </div>
            {formik.touched.confirmarSenha && formik.errors.confirmarSenha && (
              <p className="text-[11px] text-destructive">{formik.errors.confirmarSenha}</p>
            )}
          </div>

          {/* Submit */}
          <Button
            type="submit"
            className="w-full h-12 rounded-xl text-sm font-semibold mt-2"
            data-testid="register-submit-btn"
          >
            Criar Conta
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Ja tem uma conta?{' '}
          <Link
            to="/login"
            className="text-primary font-medium hover:text-primary-dark transition-colors"
            data-testid="login-link"
          >
            Faca login
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}
