import React, { useRef, useState } from 'react';
import { Camera, Trash2, Upload } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getTranslation } from '../../i18n/translations';

export const ProfileImageEditor = ({ value, name = '', onChange, className = '' }) => {
  const inputRef = useRef(null);
  const [error, setError] = useState('');
  const { language } = useApp();
  const t = (key) => getTranslation(language, key);
  const initials = (name || '').trim().charAt(0)?.toUpperCase() || 'U';

  const handleFile = (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError(t('common.invalidImage'));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError(t('common.fileTooLarge'));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setError('');
      onChange(String(reader.result));
    };
    reader.onerror = () => setError(t('common.invalidImage'));
    reader.readAsDataURL(file);
  };

  return (
    <div className={className}>
      <div className="flex flex-col items-center gap-3">
        <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-heritage-gold bg-heritage-sand flex items-center justify-center text-heritage-brown shadow-sm shrink-0">
          {value ? <img src={value} alt={`${name || 'Profile'} photo`} className="w-full h-full object-cover" /> : <span className="text-4xl font-black tracking-wide">{initials}</span>}
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          <button type="button" onClick={() => inputRef.current?.click()} className="px-3 py-1.5 rounded-lg bg-heritage-terracotta text-white text-xs font-bold inline-flex items-center gap-1.5">
            {value ? <Camera className="w-3.5 h-3.5" /> : <Upload className="w-3.5 h-3.5" />}
            {value ? t('profile.changePhoto') : t('profile.uploadCustomPhoto')}
          </button>
          {value && (
            <button type="button" onClick={() => onChange('')} className="px-3 py-1.5 rounded-lg border border-rose-200 text-rose-700 text-xs font-bold inline-flex items-center gap-1.5">
              <Trash2 className="w-3.5 h-3.5" />
              {t('profile.removePhoto')}
            </button>
          )}
        </div>

        <p className="text-[11px] text-heritage-charcoal/60">{t('profile.imageValidation')}</p>
      </div>
      <input ref={inputRef} type="file" accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp" className="hidden" onChange={handleFile} />
      {error && <p className="mt-2 text-[11px] text-rose-700 font-semibold">{error}</p>}
    </div>
  );
};
