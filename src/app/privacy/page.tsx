"use client";

import Link from "next/link";
import { Shield, Mail, Plane } from "lucide-react";
import { SITE_CONFIG } from "@/lib/site-config";
import { LegalBackLink } from "@/components/layout/legal-back-link";

const LAST_UPDATED = "11 de julho de 2026";
const CONTROLLER_EMAIL = SITE_CONFIG.admin.email;

export default function PublicPrivacyPage() {
  return (
    <>
      {/* Minimal header */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #1A5FCC, #2570E8)" }}>
            <Plane className="h-4 w-4 text-white" />
          </div>
          <span className="font-bold text-gray-900">RoteiroApp</span>
        </Link>
        <Link href="/login" className="hide-in-app text-sm text-blue-600 hover:underline font-medium">
          Entrar na conta
        </Link>
      </div>

      {/* Header */}
      <div className="mb-8">
        <LegalBackLink />
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-violet-50 flex items-center justify-center">
            <Shield className="h-5 w-5 text-violet-600" />
          </div>
          <h1 className="text-2xl font-black text-gray-900">Política de Privacidade</h1>
        </div>
        <p className="text-sm text-gray-500">Última atualização: {LAST_UPDATED} · Versão 2.1</p>
      </div>

      <div className="space-y-8 text-sm text-gray-700 leading-relaxed">

        <section className="bg-violet-50 border border-violet-100 rounded-2xl p-5">
          <p>
            O <strong>RoteiroApp</strong> respeita a sua privacidade e está comprometido com a proteção dos seus dados pessoais,
            em conformidade com a <strong>Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018)</strong> e demais normas aplicáveis.
            Esta Política descreve quais dados coletamos, como os utilizamos e quais são os seus direitos.
          </p>
        </section>

        <Section title="1. Controlador dos dados">
          <p>O controlador responsável pelo tratamento dos seus dados pessoais é:</p>
          <ul className="mt-3 space-y-1 list-none">
            <li><strong>Razão social:</strong> Carla Alessandra Acero Zausa (MEI)</li>
            <li><strong>CNPJ:</strong> 67.950.249/0001-39</li>
            <li><strong>Endereço:</strong> Rua Epitácio Pessoa, nº 204, Isaura Parente, Rio Branco/AC, CEP 69918-300</li>
            <li><strong>Produto:</strong> RoteiroApp</li>
            <li><strong>Site:</strong> roteiroapp.com</li>
            <li><strong>E-mail de contato:</strong>{" "}
              <a href={`mailto:${CONTROLLER_EMAIL}`} className="text-blue-600 hover:underline">{CONTROLLER_EMAIL}</a>
            </li>
            <li><strong>Encarregado pelo Tratamento de Dados (DPO — LGPD art. 41):</strong>{" "}
              <a href={`mailto:${CONTROLLER_EMAIL}`} className="text-blue-600 hover:underline">{CONTROLLER_EMAIL}</a>
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
              ["Fotos enviadas (documentos, reservas, atividades)", "Anexar comprovantes às suas viagens", "Consentimento (art. 7º, I)"],
              ["Dados de assinatura (identificadores de cliente e de assinatura na Stripe, plano contratado)", "Gerenciar o plano Premium", "Execução de contrato (art. 7º, V)"],
              ["Endereço IP (ações admin)", "Segurança e auditoria", "Legítimo interesse (art. 7º, IX)"],
              ["Cookies de sessão (JWT)", "Manter sessão autenticada", "Execução de contrato (art. 7º, V)"],
            ]}
          />
          <p className="mt-3 text-xs text-gray-500">
            Não coletamos dados sensíveis (saúde, biometria, origem racial, etc.) nem realizamos perfilamento para publicidade.
            <strong> Os dados do seu cartão são processados diretamente pela Stripe e nunca passam pelos nossos servidores</strong> — recebemos apenas identificadores de pagamento e o status da assinatura.
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
          <p className="mt-3"><strong>Não vendemos, alugamos ou compartilhamos seus dados com terceiros para fins comerciais.</strong></p>
        </Section>

        <Section title="4. Compartilhamento de dados">
          <p>Para operar o serviço, contamos com operadores (processadores) de dados selecionados. Cada um acessa apenas o mínimo necessário:</p>
          <ul className="space-y-2 list-disc list-inside mt-2">
            <li><strong>Neon (banco de dados):</strong> hospeda seus dados de conta e viagens, com criptografia em trânsito (TLS) e em repouso. Servidores nos EUA.</li>
            <li><strong>Railway (hospedagem):</strong> executa a aplicação web.</li>
            <li><strong>Stripe (pagamentos):</strong> processa a assinatura Premium. Os dados do cartão são tratados diretamente pela Stripe (certificada PCI-DSS); não os armazenamos. <a href="https://stripe.com/br/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Privacidade da Stripe</a>.</li>
            <li><strong>Cloudinary (mídia):</strong> armazena as fotos que você anexa às viagens.</li>
            <li><strong>Resend (e-mail):</strong> envia o código de login (OTP), a verificação de conta e a redefinição de senha. Não usamos para marketing sem consentimento.</li>
            <li><strong>Google Analytics 4:</strong> dados anônimos de uso (páginas, sessões, eventos), sem dados identificáveis, com base no legítimo interesse (LGPD art. 7º, IX). <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Política do Google</a>.</li>
            <li><strong>Sentry (monitoramento):</strong> registra erros técnicos para manter a estabilidade do app.</li>
            <li><strong>Administradores do RoteiroApp:</strong> acesso restrito ao painel para moderação, suporte e conformidade.</li>
          </ul>
          <p className="mt-3"><strong>Transferência internacional (LGPD art. 33):</strong> alguns desses provedores processam dados fora do Brasil (ex.: EUA). A transferência ocorre com salvaguardas contratuais e técnicas adequadas, exclusivamente para viabilizar o serviço que você contratou.</p>
          <p className="mt-3 text-xs text-gray-500">Não vendemos, alugamos nem compartilhamos seus dados com anunciantes ou terceiros para fins comerciais.</p>
        </Section>

        <Section title="5. Cookies e rastreamento">
          <p>Utilizamos os seguintes tipos de cookies e tecnologias de rastreamento:</p>
          <Table
            headers={["Tipo", "Duração", "Finalidade"]}
            rows={[
              ["Cookie de sessão autenticada", "30 dias", "Mantém você conectado à sua conta"],
              ["Cookie de segurança (CSRF)", "Sessão", "Proteção contra ataques de falsificação de requisição"],
              ["Preferências (LocalStorage)", "1 ano", "Registro do consentimento e preferências de idioma"],
              ["Cookies de análise (_ga, _ga_*)", "2 anos", "Google Analytics 4 — dados de uso anônimos"],
            ]}
          />
          <p className="mt-3">
            <strong>Consentimento (LGPD arts. 7º/8º):</strong> os cookies de análise (Google Analytics 4) e o
            diagnóstico de erros com gravação de sessão (Sentry) <strong>só são ativados após o seu aceite</strong> no
            aviso de cookies. Sem o seu consentimento, carregamos apenas os cookies estritamente necessários ao
            funcionamento e à autenticação. Você pode escolher "Aceitar todos" ou "Só essenciais" no aviso; para
            rever a escolha, limpe os dados de navegação deste site e recarregue a página.
          </p>
          <p className="mt-3 text-sm text-gray-600">
            Você também pode recusar o Google Analytics instalando o{" "}
            <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              complemento de recusa do Google Analytics
            </a>.
          </p>
        </Section>

        <Section title="6. Segurança">
          <ul className="space-y-2 list-disc list-inside">
            <li>Senhas armazenadas com hash criptográfico seguro — nunca em texto puro</li>
            <li>Comunicação exclusiva via HTTPS com certificado TLS válido</li>
            <li>Cabeçalhos de segurança HTTP configurados (proteção contra XSS, clickjacking e injeção de conteúdo)</li>
            <li>Mecanismos de limitação de taxa nas rotas de autenticação para prevenir ataques de força bruta</li>
            <li>Log de auditoria de ações administrativas sensíveis</li>
            <li>Banco de dados gerenciado com criptografia em repouso, acesso restrito por credenciais e conexão exclusivamente por TLS</li>
            <li>Backups automáticos com restauração a um ponto no tempo (proteção contra perda de dados)</li>
          </ul>
        </Section>

        <Section title="7. Incidentes de segurança">
          <p>
            Caso ocorra um incidente de segurança que possa acarretar risco ou dano relevante aos titulares,
            comunicaremos a <strong>Autoridade Nacional de Proteção de Dados (ANPD)</strong> e os titulares afetados
            em prazo razoável, informando a natureza dos dados envolvidos, os riscos e as medidas adotadas para
            mitigar os efeitos, nos termos do <strong>art. 48 da LGPD</strong>.
          </p>
        </Section>

        <Section title="8. Seus direitos (LGPD — arts. 17 a 22)">
          <Table
            headers={["Direito", "Como exercer"]}
            rows={[
              ["Confirmação e acesso aos dados", "Perfil → Exportar meus dados"],
              ["Correção de dados incompletos", "Perfil → Editar perfil"],
              ["Anonimização ou eliminação", "Perfil → Excluir minha conta"],
              ["Portabilidade (exportação)", "Perfil → Baixar dados (JSON)"],
              ["Revogação do consentimento", "Exclua sua conta ou entre em contato"],
              ["Informação sobre compartilhamento", "Veja a seção 4 desta Política"],
            ]}
          />
          <p className="mt-3">
            Para exercer qualquer direito, entre em contato:{" "}
            <a href={`mailto:${CONTROLLER_EMAIL}`} className="text-blue-600 hover:underline">{CONTROLLER_EMAIL}</a>.
            Respondemos em até <strong>15 dias úteis</strong>.
          </p>
        </Section>

        <Section title="9. Retenção e eliminação de dados">
          <p>
            Mantemos seus dados enquanto sua conta estiver ativa. <strong>Ao excluir sua conta</strong>, seus dados
            pessoais e o conteúdo das suas viagens são apagados do nosso banco de dados em cascata, e a sua
            <strong> assinatura na Stripe é cancelada automaticamente</strong> — nenhuma nova cobrança é feita.
          </p>
          <p className="mt-3">Após o encerramento, alguns registros podem ser retidos pelos prazos legais aplicáveis:</p>
          <ul className="space-y-1.5 list-disc list-inside mt-2">
            <li>Logs de auditoria de segurança: até <strong>90 dias</strong>.</li>
            <li>Registros de pagamento (mantidos por nós e pela Stripe): pelo prazo da legislação fiscal, em regra <strong>5 anos</strong>.</li>
          </ul>
          <p className="mt-3 text-xs text-gray-500">
            As fotos que você anexou às viagens ficam armazenadas no provedor de mídia (Cloudinary). Se desejar a
            remoção definitiva dessas imagens após excluir a conta, solicite pelo e-mail de contato e atenderemos
            no prazo legal.
          </p>
        </Section>

        <Section title="10. Menores de idade">
          <p>
            O RoteiroApp destina-se a maiores de <strong>13 anos</strong>. O tratamento de dados de menores de 18 anos
            ocorre sempre em seu melhor interesse; para menores de 13 anos, é exigido o consentimento específico de ao
            menos um dos pais ou responsável legal, nos termos do <strong>art. 14 da LGPD</strong>. Ao criar a conta,
            você declara ter no mínimo 13 anos de idade.
          </p>
        </Section>

        <Section title="11. Alterações nesta Política">
          <p>
            Podemos atualizar esta Política periodicamente. Em caso de alterações relevantes, notificaremos
            por e-mail ou aviso em destaque no app. O uso continuado implica aceite da nova versão.
          </p>
        </Section>

        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 flex items-start gap-4">
          <div className="w-9 h-9 rounded-xl bg-gray-200 flex items-center justify-center shrink-0">
            <Mail className="h-4 w-4 text-gray-600" />
          </div>
          <div>
            <p className="font-semibold text-gray-800">Dúvidas sobre privacidade?</p>
            <p className="text-gray-500 text-xs mt-0.5">
              Entre em contato:{" "}
              <a href={`mailto:${CONTROLLER_EMAIL}`} className="text-blue-600 hover:underline">{CONTROLLER_EMAIL}</a>.
              Respondemos em até 15 dias úteis.
            </p>
          </div>
        </div>
      </div>
    </>
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
          <tr>{headers.map(h => <th key={h} className="text-left px-3 py-2 font-semibold text-gray-700 border-b border-gray-100">{h}</th>)}</tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {rows.map((row, i) => (
            <tr key={i} className="bg-white hover:bg-gray-50/50">
              {row.map((cell, j) => <td key={j} className="px-3 py-2 text-gray-600">{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
