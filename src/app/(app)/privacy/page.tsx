"use client";

import Link from "next/link";
import { Shield, ArrowLeft, Mail } from "lucide-react";
import { SITE_CONFIG } from "@/lib/site-config";

const LAST_UPDATED = "25 de maio de 2026";
const CONTROLLER_EMAIL = SITE_CONFIG.admin.email;

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-3xl pb-16">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Link>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-violet-50 flex items-center justify-center">
            <Shield className="h-5 w-5 text-violet-600" />
          </div>
          <h1 className="text-2xl font-black text-gray-900">Política de Privacidade</h1>
        </div>
        <p className="text-sm text-gray-500">Última atualização: {LAST_UPDATED} · Versão 1.0</p>
      </div>

      <div className="space-y-8 text-sm text-gray-700 leading-relaxed">

        {/* Intro */}
        <section className="bg-violet-50 border border-violet-100 rounded-2xl p-5">
          <p>
            O <strong>RoteiroApp</strong> respeita a sua privacidade e está comprometido com a proteção dos seus dados pessoais,
            em conformidade com a <strong>Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018)</strong> e demais normas aplicáveis.
            Esta Política descreve quais dados coletamos, como os utilizamos e quais são os seus direitos.
          </p>
        </section>

        <Section title="1. Controlador dos dados">
          <p>
            O controlador responsável pelo tratamento dos seus dados pessoais é:
          </p>
          <ul className="mt-3 space-y-1 list-none">
            <li><strong>Produto:</strong> RoteiroApp</li>
            <li><strong>Site:</strong> roteiroapp.com</li>
            <li><strong>E-mail de contato:</strong>{" "}
              <a href={`mailto:${CONTROLLER_EMAIL}`} className="text-primary-600 hover:underline">{CONTROLLER_EMAIL}</a>
            </li>
          </ul>
        </Section>

        <Section title="2. Dados que coletamos">
          <p>Coletamos apenas os dados necessários para o funcionamento do serviço:</p>
          <Table
            headers={["Dado", "Finalidade", "Base legal"]}
            rows={[
              ["Nome e e-mail", "Criar e identificar sua conta", "Execução de contrato (art. 7º, V)"],
              ["Senha (hash bcrypt)", "Autenticação segura", "Execução de contrato (art. 7º, V)"],
              ["Foto de perfil (URL)", "Personalização da conta", "Consentimento (art. 7º, I)"],
              ["Dados de viagens, roteiros e despesas", "Funcionalidade principal do app", "Execução de contrato (art. 7º, V)"],
              ["Endereço IP (ações admin)", "Segurança e auditoria", "Legítimo interesse (art. 7º, IX)"],
              ["Cookies de sessão (JWT)", "Manter sessão autenticada", "Execução de contrato (art. 7º, V)"],
            ]}
          />
          <p className="mt-3 text-xs text-gray-500">
            Não coletamos dados sensíveis (saúde, biometria, origem racial, etc.) nem realizamos perfilamento para publicidade.
          </p>
        </Section>

        <Section title="3. Como utilizamos seus dados">
          <ul className="space-y-2 list-disc list-inside">
            <li>Fornecer, manter e melhorar o RoteiroApp</li>
            <li>Autenticar sua identidade e proteger sua conta</li>
            <li>Exibir seus roteiros, viagens e relatos dentro da plataforma</li>
            <li>Moderar conteúdo publicado na comunidade</li>
            <li>Registrar ações administrativas para fins de segurança (audit log)</li>
          </ul>
          <p className="mt-3">
            <strong>Não vendemos, alugamos ou compartilhamos seus dados com terceiros para fins comerciais.</strong>
          </p>
        </Section>

        <Section title="4. Compartilhamento de dados">
          <p>Seus dados podem ser acessados por:</p>
          <ul className="space-y-2 list-disc list-inside mt-2">
            <li><strong>Railway (infraestrutura):</strong> hospedagem e banco de dados PostgreSQL na nuvem. Dados armazenados com criptografia em repouso.</li>
            <li><strong>Administradores do RoteiroApp:</strong> acesso restrito ao painel admin para fins de moderação e suporte.</li>
          </ul>
        </Section>

        <Section title="5. Cookies">
          <p>Utilizamos apenas cookies estritamente necessários:</p>
          <Table
            headers={["Cookie", "Tipo", "Duração", "Finalidade"]}
            rows={[
              ["next-auth.session-token", "HTTP-only", "30 dias", "Sessão autenticada (JWT)"],
              ["next-auth.csrf-token", "HTTP-only", "Sessão", "Proteção contra CSRF"],
              ["lgpd-consent", "LocalStorage", "1 ano", "Registro do consentimento desta política"],
            ]}
          />
          <p className="mt-3">Não utilizamos cookies de rastreamento, analytics ou publicidade de terceiros.</p>
        </Section>

        <Section title="6. Segurança">
          <ul className="space-y-2 list-disc list-inside">
            <li>Senhas armazenadas com hash bcrypt (12 rounds)</li>
            <li>Conexão exclusiva via HTTPS (TLS)</li>
            <li>Headers de segurança: HSTS, X-Frame-Options, CSP, X-Content-Type-Options</li>
            <li>Rate limiting nas rotas de autenticação (10 req/min por IP)</li>
            <li>Audit log de ações administrativas sensíveis</li>
            <li>Banco de dados acessível apenas via rede privada do Railway</li>
          </ul>
        </Section>

        <Section title="7. Seus direitos (LGPD)">
          <p>Conforme os arts. 17 a 22 da LGPD, você tem direito a:</p>
          <Table
            headers={["Direito", "Como exercer"]}
            rows={[
              ["Confirmação e acesso aos dados", "Acesse Perfil → Exportar meus dados"],
              ["Correção de dados incompletos", "Acesse Perfil → Editar perfil"],
              ["Anonimização ou eliminação", "Acesse Perfil → Excluir minha conta"],
              ["Portabilidade (exportação)", "Acesse Perfil → Baixar dados (JSON)"],
              ["Revogação do consentimento", "Exclua sua conta ou entre em contato"],
              ["Informação sobre compartilhamento", "Veja a seção 4 desta Política"],
            ]}
          />
          <p className="mt-3">
            Para exercer qualquer direito ou enviar uma solicitação, entre em contato:{" "}
            <a href={`mailto:${CONTROLLER_EMAIL}`} className="text-primary-600 hover:underline">{CONTROLLER_EMAIL}</a>.
            Respondemos em até <strong>15 dias úteis</strong>.
          </p>
        </Section>

        <Section title="8. Retenção de dados">
          <p>
            Seus dados são mantidos enquanto sua conta estiver ativa. Ao excluir sua conta, todos os dados pessoais
            são apagados permanentemente em cascata do banco de dados. Logs de auditoria são retidos por até 90 dias
            para fins de segurança e integridade do sistema.
          </p>
        </Section>

        <Section title="9. Alterações nesta Política">
          <p>
            Podemos atualizar esta Política periodicamente. Em caso de alterações relevantes, notificaremos
            por e-mail ou mediante aviso em destaque no app. O uso continuado do serviço após as alterações
            implica aceite da nova versão.
          </p>
        </Section>

        {/* Contact */}
        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 flex items-start gap-4">
          <div className="w-9 h-9 rounded-xl bg-gray-200 flex items-center justify-center shrink-0">
            <Mail className="h-4 w-4 text-gray-600" />
          </div>
          <div>
            <p className="font-semibold text-gray-800">Dúvidas sobre privacidade?</p>
            <p className="text-gray-500 text-xs mt-0.5">
              Entre em contato pelo e-mail{" "}
              <a href={`mailto:${CONTROLLER_EMAIL}`} className="text-primary-600 hover:underline">{CONTROLLER_EMAIL}</a>.
              Estamos comprometidos em responder em até 15 dias úteis.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-2">{title}</h2>
      {children}
    </section>
  );
}

function Table({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto mt-3 rounded-xl border border-gray-100">
      <table className="w-full text-xs">
        <thead className="bg-gray-50">
          <tr>
            {headers.map(h => (
              <th key={h} className="text-left px-3 py-2 font-semibold text-gray-700 border-b border-gray-100">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {rows.map((row, i) => (
            <tr key={i} className="bg-white hover:bg-gray-50/50">
              {row.map((cell, j) => (
                <td key={j} className="px-3 py-2 text-gray-600">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
