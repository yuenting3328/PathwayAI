import { ArrowLeft, Award, Share2, CheckCircle, Clock, Copy, Building2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';
import { credentials as credApi, type Credential } from '../lib/api';
import { useSSE } from '../lib/useSSE';

export default function CredentialsWalletScreen() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [credList, setCredList] = useState<Credential[]>([]);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedCredential, setSelectedCredential] = useState<string | null>(null);
  const [shareExpiry, setShareExpiry] = useState<number | null>(7);
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    credApi.list().then(setCredList).catch(console.error);
  }, []);

  // Real-time: refresh wallet when institution issues a new credential
  useSSE<{ credentialId: string }>('/events/stream', (event) => {
    if (event.type === 'CREDENTIAL_ISSUED') {
      credApi.list().then(setCredList).catch(console.error);
    }
  });

  const openShareModal = (id: string) => {
    setSelectedCredential(id);
    setGeneratedLink(null);
    setCopied(false);
    setShareExpiry(7);
    setShowShareModal(true);
  };

  const handleGenerateLink = async () => {
    if (!selectedCredential) return;
    setGenerating(true);
    try {
      const { url } = await credApi.shareLink(selectedCredential, shareExpiry);
      setGeneratedLink(url);
    } catch {
      setGeneratedLink(`${window.location.origin}/verify/${selectedCredential}`);
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = async () => {
    if (!generatedLink) return;
    await navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'VERIFIED':
        return <CheckCircle className="w-4 h-4 text-[#34D399]" />;
      case 'PENDING':
        return <Clock className="w-4 h-4 text-[#FBBF24]" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'VERIFIED':
        return 'text-[#34D399] bg-[#34D399]/20';
      case 'PENDING':
        return 'text-[#FBBF24] bg-[#FBBF24]/20';
      default:
        return 'text-slate-400 bg-slate-400/20';
    }
  };

  const categories = ['Degree & Transcript', 'HEAR', 'Certificates', 'Badges'];

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-900/95 backdrop-blur-xl border-b border-slate-800/50 px-6 py-4 flex items-center gap-3 z-10 shadow-2xl">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate(-1)}
          className="w-10 h-10 bg-slate-800/60 rounded-xl flex items-center justify-center border border-slate-700/50 hover:border-slate-600"
        >
          <ArrowLeft className="w-5 h-5 text-slate-400" />
        </motion.button>
        <div className="flex-1">
          <h1 className="text-white text-xl font-bold">{t('Credentials Wallet', '證書錢包')}</h1>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Categories */}
        {categories.map(category => (
          <div key={category}>
            <h3 className="text-white mb-3">{t(category, category)}</h3>
            <div className="space-y-3">
              {credList
                .filter(cred => cred.category === category)
                .map(credential => (
                  <div
                    key={credential.id}
                    className="bg-[#1e293b] rounded-xl p-4 border border-[#334155]"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#6366F1]/20 to-[#8b5cf6]/10 rounded-lg flex items-center justify-center flex-shrink-0 border border-[#6366F1]/30">
                        <Award className="w-6 h-6 text-[#6366F1]" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-1">
                          <h4 className="text-white text-sm">{credential.name}</h4>
                          {getStatusIcon(credential.status)}
                        </div>
                        <p className="text-slate-400 text-xs mb-1">{credential.issuer}</p>
                        {'issuedByInstitution' in credential && credential.issuedByInstitution && (
                          <div className="flex items-center gap-1 mb-1">
                            <Building2 className="w-3 h-3 text-indigo-400" />
                            <span className="text-indigo-400 text-xs">{t('Issued by your university', '由大學頒發')}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-2 py-1 rounded ${getStatusColor(credential.status)}`}>
                            {t(credential.status, credential.status)}
                          </span>
                          {credential.issuedDate && (
                            <span className="text-slate-500 text-xs">
                              {new Date(credential.issuedDate).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    {credential.status === 'VERIFIED' && (
                      <button
                        onClick={() => openShareModal(credential.id)}
                        className="w-full mt-3 bg-[#334155] text-slate-300 py-2 rounded-lg text-sm flex items-center justify-center gap-2 hover:bg-[#6366F1] hover:text-white transition-colors"
                      >
                        <Share2 className="w-4 h-4" />
                        <span>{t('Share', '分享')}</span>
                      </button>
                    )}
                  </div>
                ))}

              {credList.filter(cred => cred.category === category).length === 0 && (
                <div className="bg-[#1e293b] rounded-xl p-6 border border-[#334155] text-center">
                  <p className="text-slate-400 text-sm">
                    {category === 'HEAR'
                      ? t(
                          'Ask your university to connect your digital HEAR so we can store it securely here.',
                          '聯絡你嘅大學將數碼 HEAR 連接到此帳戶，我哋會安全保存。'
                        )
                      : t(`No ${category} yet`, `暫無${category}`)}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}

        <div className="h-4"></div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
          <div className="bg-[#1e293b] rounded-xl p-6 w-full max-w-sm border border-[#334155]">
            <h3 className="text-white mb-2">{t('Share with employer', '分享畀僱主')}</h3>
            <p className="text-slate-400 text-sm mb-4">
              {t(
                "We'll generate a secure link employers can use to verify this record. You can turn it off anytime.",
                '我哋會產生一條安全連結，畀僱主核實呢份紀錄，你可隨時停止使用。'
              )}
            </p>

            {!generatedLink ? (
              <>
                <div className="mb-4">
                  <label className="text-slate-300 text-sm mb-1 block">{t('Link expiry', '連結有效期')}</label>
                  <select
                    value={shareExpiry ?? ''}
                    onChange={e => setShareExpiry(e.target.value === '' ? null : Number(e.target.value))}
                    className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-white text-sm"
                  >
                    <option value={7}>7 {t('days', '天')}</option>
                    <option value={30}>30 {t('days', '天')}</option>
                    <option value="">{ t('No expiry', '永久')}</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowShareModal(false)}
                    className="flex-1 bg-[#334155] text-slate-300 py-2 rounded-lg text-sm"
                  >
                    {t('Cancel', '取消')}
                  </button>
                  <button
                    onClick={handleGenerateLink}
                    disabled={generating}
                    className="flex-1 bg-gradient-to-r from-[#6366F1] to-[#8b5cf6] text-white py-2 rounded-lg text-sm disabled:opacity-50"
                  >
                    {generating ? t('Generating…', '生成中…') : t('Generate Link', '產生連結')}
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 mb-3 flex items-center gap-2">
                  <span className="text-slate-300 text-xs truncate flex-1">{generatedLink}</span>
                  <button onClick={handleCopy} className="flex-shrink-0">
                    <Copy className="w-4 h-4 text-slate-400 hover:text-white transition-colors" />
                  </button>
                </div>
                {copied && (
                  <p className="text-[#34D399] text-xs mb-3 text-center">{t('Copied to clipboard!', '已複製！')}</p>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowShareModal(false)}
                    className="flex-1 bg-[#334155] text-slate-300 py-2 rounded-lg text-sm"
                  >
                    {t('Done', '完成')}
                  </button>
                  <button
                    onClick={handleCopy}
                    className="flex-1 bg-gradient-to-r from-[#6366F1] to-[#8b5cf6] text-white py-2 rounded-lg text-sm flex items-center justify-center gap-2"
                  >
                    <Copy className="w-4 h-4" />
                    {copied ? t('Copied!', '已複製！') : t('Copy Link', '複製連結')}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
