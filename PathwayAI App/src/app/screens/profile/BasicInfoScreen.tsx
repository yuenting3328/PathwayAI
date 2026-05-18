import { User, Mail, Phone, Linkedin, AtSign } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { useLanguage } from '../../contexts/LanguageContext';

export default function BasicInfoScreen() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [form, setForm] = useState({
    fullName: 'Alex Chen',
    preferredName: 'Alex',
    email: 'alex.chen@connect.hku.hk',
    phone: '+852 9123 4567',
    linkedin: 'linkedin.com/in/alexchen',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.fullName.trim()) e.fullName = t('Full name is required.', '請輸入全名。');
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = t('Please enter a valid email address.', '請輸入有效的電郵地址。');
    if (!form.phone.trim() || !/^[+\d\s()-]{7,}$/.test(form.phone))
      e.phone = t('Please enter a valid phone number.', '請輸入有效的電話號碼。');
    return e;
  };

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    navigate('/profile/education');
  };

  const field = (
    key: keyof typeof form,
    label: string,
    labelzh: string,
    Icon: React.ElementType,
    placeholder: string,
    placeholderzh: string,
    required = true,
  ) => (
    <div>
      <label className="text-slate-400 text-xs font-medium mb-1.5 flex items-center gap-1.5">
        {t(label, labelzh)}
        {!required && <span className="text-slate-600">{t('(optional)', '（選填）')}</span>}
      </label>
      <div className={`flex items-center gap-3 bg-slate-800/60 border rounded-xl px-4 py-3 transition-colors ${errors[key] ? 'border-rose-500/60' : 'border-slate-700/50 focus-within:border-indigo-500/60'}`}>
        <Icon className="w-4 h-4 text-slate-400 flex-shrink-0" />
        <input
          value={form[key]}
          onChange={e => { setForm(f => ({ ...f, [key]: e.target.value })); setErrors(er => ({ ...er, [key]: '' })); }}
          placeholder={t(placeholder, placeholderzh)}
          className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-slate-600"
        />
      </div>
      {errors[key] && <p className="text-rose-400 text-xs mt-1">{errors[key]}</p>}
    </div>
  );

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Sub-app bar */}
      <div className="flex-shrink-0 flex items-center gap-3 px-6 pt-14 pb-4 border-b border-slate-800/50 bg-slate-900/80 backdrop-blur-xl">
        <div className="flex-1">
          <p className="text-white font-semibold text-base">{t('Basic info', '基本資料')}</p>
          <p className="text-slate-500 text-xs">{t('Step 1 of 6', '第 1 步，共 6 步')}</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
        <p className="text-slate-400 text-sm leading-relaxed">
          {t(
            'Tell us who you are so we can personalise your profile and applications.',
            '告訴我們你是誰，讓我們能個人化你的個人資料及申請。'
          )}
        </p>

        {field('fullName',      'Full name',       '全名',     User,    'e.g. Alex Chen',            'e.g. 陳大文')}
        {field('preferredName', 'Preferred name',  '慣用名稱', AtSign,  'e.g. Alex',                 'e.g. 阿文', false)}
        {field('email',         'Email',           '電郵',     Mail,    'e.g. alex@connect.hku.hk',  'e.g. alex@connect.hku.hk')}
        {field('phone',         'Phone number',    '電話號碼', Phone,   'e.g. +852 9123 4567',       'e.g. +852 9123 4567')}
        {field('linkedin',      'LinkedIn URL',    'LinkedIn', Linkedin,'linkedin.com/in/yourname',  'linkedin.com/in/yourname', false)}

        <div className="h-24" />
      </div>

      {/* Fixed Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 max-w-[393px] mx-auto px-6 py-4 border-t border-slate-800/50 bg-slate-900 backdrop-blur-xl z-10">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSave}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-semibold text-base shadow-lg shadow-indigo-500/30"
        >
          {t('Save & Continue', '儲存並繼續')}
        </motion.button>
      </div>
    </div>
  );
}
