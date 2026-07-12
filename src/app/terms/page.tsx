"use client";

import Link from "next/link";
import { FileText, ArrowLeft, Plane } from "lucide-react";

const LAST_UPDATED = "11 de julho de 2026";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-base font-bold text-gray-900 mb-3 pb-1 border-b border-gray-100">{title}</h2>
      <div className="space-y-2">{children}</div>
    </section>
  );
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-4 py-10">

        {/* Minimal header */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #1A5FCC, #2570E8)" }}>
              <Plane className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-gray-900">RoteiroApp</span>
          </Link>
          <Link href="/login" className="text-sm text-blue-600 hover:underline font-medium">
            Entrar na conta
          </Link>
        </div>

        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-6 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
            <h1 className="text-2xl font-black text-gray-900">Termos de Uso</h1>
          </div>
          <p className="text-sm text-gray-500">Última atualização: {LAST_UPDATED} · Versão 2.1</p>
        </div>

        <div className="space-y-8 text-sm text-gray-700 leading-relaxed">

          <section className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
            <p>
              Ao criar uma conta ou usar o <strong>RoteiroApp</strong> (disponível em <strong>roteiroapp.com</strong>),
              você concorda com estes Termos de Uso. Leia com atenção antes de utilizar o serviço.
              Se você não concordar com algum item, não utilize o app.
            </p>
          </section>

          <Section title="1. O serviço">
            <p>
              O RoteiroApp é uma plataforma de planejamento de viagens que permite criar roteiros, gerenciar
              orçamentos, organizar documentos, registrar experiências e compartilhar viagens com outros usuários.
            </p>
            <p>
              O serviço é fornecido <strong>no estado em que se encontra</strong>, sem garantia de disponibilidade
              ininterrupta. Podemos alterar, suspender ou encerrar funcionalidades a qualquer momento, com aviso
              prévio sempre que possível.
            </p>
          </Section>

          <Section title="2. Elegibilidade e conta">
            <p>Para usar o RoteiroApp você deve:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Ter pelo menos <strong>13 anos de idade</strong></li>
              <li>Fornecer informações verdadeiras no cadastro</li>
              <li>Manter a segurança da sua senha e não compartilhar o acesso</li>
              <li>Usar o serviço apenas para fins pessoais e não comerciais, salvo acordo expresso</li>
            </ul>
            <p className="mt-2">
              Você é responsável por todas as atividades realizadas na sua conta. Notifique-nos imediatamente
              em caso de uso não autorizado.
            </p>
          </Section>

          <Section title="3. Uso aceitável">
            <p>É <strong>proibido</strong> usar o RoteiroApp para:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Violar leis brasileiras ou internacionais aplicáveis</li>
              <li>Publicar conteúdo falso, ofensivo, discriminatório ou que viole direitos de terceiros</li>
              <li>Tentar acessar contas ou dados de outros usuários sem autorização</li>
              <li>Realizar engenharia reversa, scraping automatizado ou sobrecarregar os servidores</li>
              <li>Usar o app para fins comerciais sem autorização prévia por escrito</li>
            </ul>
            <p className="mt-2">
              Nos reservamos o direito de suspender ou encerrar contas que violem estas regras, sem aviso prévio
              em casos graves.
            </p>
          </Section>

          <Section title="4. Conteúdo do usuário">
            <p>
              Você retém a propriedade de todo o conteúdo que cria no app (roteiros, experiências, diário, etc.).
              Ao publicar conteúdo na área comunitária (Roteiros da Comunidade, Dicas), você nos concede uma
              licença não exclusiva, mundial e gratuita para exibir esse conteúdo a outros usuários da plataforma.
            </p>
            <p className="mt-2">
              Você declara que tem os direitos necessários sobre o conteúdo que publica e que ele não viola
              direitos de terceiros.
            </p>
          </Section>

          <Section title="5. Planos, assinatura e pagamentos">
            <p>
              O RoteiroApp oferece um <strong>plano gratuito</strong> com funcionalidades básicas e um plano{" "}
              <strong>Premium</strong> pago. Os preços e limites vigentes estão na{" "}
              <Link href="/pricing" className="text-blue-600 hover:underline">página de planos</Link>.
            </p>
            <ul className="list-disc pl-5 space-y-1.5 mt-2">
              <li><strong>Cobrança:</strong> o Premium é uma assinatura recorrente (mensal ou anual), processada com segurança pela <strong>Stripe</strong>. A renovação é automática ao fim de cada período, no mesmo valor, até que você cancele.</li>
              <li><strong>Cancelamento:</strong> você pode cancelar a qualquer momento pelo próprio app. O acesso Premium permanece ativo até o fim do período já pago; não há novas cobranças após o cancelamento.</li>
              <li><strong>Direito de arrependimento (CDC, art. 49):</strong> por ser contratação pela internet, você pode desistir em até <strong>7 dias</strong> a partir da contratação e solicitar o reembolso integral, bastando entrar em contato conosco.</li>
              <li><strong>Reembolsos:</strong> fora do prazo de arrependimento, não realizamos reembolsos parciais de períodos já faturados, salvo exigência legal.</li>
              <li><strong>Alteração de preços:</strong> mudanças de preço são comunicadas com antecedência e valem apenas para períodos futuros — você pode cancelar antes da renovação.</li>
            </ul>
          </Section>

          <Section title="6. Links de afiliados">
            <p>
              O RoteiroApp pode exibir links de afiliados para serviços de terceiros (seguros, câmbio, produtos de viagem, etc.).
              Quando você compra por esses links, podemos receber uma comissão sem custo adicional para você.
              Essas recomendações são editoriais e não interferem na neutralidade do conteúdo.
            </p>
          </Section>

          <Section title="7. Propriedade intelectual">
            <p>
              O nome <strong>RoteiroApp</strong>, logotipos, design, código-fonte e demais elementos do serviço
              são propriedade exclusiva do RoteiroApp ou de seus licenciadores. É proibida a reprodução,
              distribuição ou criação de obras derivadas sem autorização prévia por escrito.
            </p>
          </Section>

          <Section title="8. Limitação de responsabilidade">
            <p>
              O RoteiroApp não se responsabiliza por decisões de viagem tomadas com base nas informações do app,
              por erros em preços de terceiros exibidos na plataforma, por perda de dados causada por falha de
              terceiros (provedores de nuvem), nem por danos indiretos decorrentes do uso do serviço.
            </p>
            <p className="mt-2">
              Nossa responsabilidade máxima, em qualquer hipótese, fica limitada ao valor pago pelo usuário
              nos últimos 12 meses (ou R$0 para usuários do plano gratuito).
            </p>
            <p className="mt-2">
              As limitações acima <strong>não afastam</strong> a responsabilidade do RoteiroApp por dolo ou culpa grave,
              nem restringem os direitos indisponíveis assegurados ao consumidor pelo Código de Defesa do Consumidor.
            </p>
          </Section>

          <Section title="9. Alterações nos termos">
            <p>
              Podemos atualizar estes termos periodicamente. Alterações relevantes serão comunicadas por email
              ou aviso no app com pelo menos <strong>15 dias de antecedência</strong>. O uso continuado após
              essa data implica aceitação dos novos termos.
            </p>
          </Section>

          <Section title="10. Lei aplicável e foro">
            <p>
              Estes Termos são regidos pelas leis brasileiras. Eventuais litígios serão submetidos ao foro da
              Comarca de domicílio do usuário, nos termos do Código de Defesa do Consumidor.
            </p>
          </Section>

          <Section title="11. Contato">
            <p>
              Dúvidas sobre estes Termos de Uso? Entre em contato:{" "}
              <a href="mailto:contato@roteiroapp.com" className="text-blue-600 hover:underline font-medium">
                contato@roteiroapp.com
              </a>
            </p>
          </Section>

        </div>

        {/* Footer links */}
        <div className="mt-12 pt-6 border-t border-gray-100 flex flex-wrap gap-4 text-xs text-gray-400">
          <Link href="/privacy" className="hover:text-gray-600 transition-colors">Política de Privacidade</Link>
          <Link href="/" className="hover:text-gray-600 transition-colors">Página inicial</Link>
          <Link href="/login" className="hover:text-gray-600 transition-colors">Login</Link>
        </div>

      </div>
    </div>
  );
}
