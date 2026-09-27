import React, { useState } from 'react';
const sizeClasses = {
    xs: { container: 'w-6 h-6', text: 'text-[9px]', icon: 'w-3 h-3' },
    sm: { container: 'w-8 h-8', text: 'text-xs', icon: 'w-4 h-4' },
    md: { container: 'w-10 h-10', text: 'text-sm', icon: 'w-5 h-5' },
    lg: { container: 'w-12 h-12', text: 'text-base', icon: 'w-6 h-6' },
    xl: { container: 'w-16 h-16', text: 'text-xl', icon: 'w-8 h-8' },
    '2xl': { container: 'w-24 h-24', text: 'text-3xl', icon: 'w-12 h-12' },
};
function getInitials(name) {
    if (!name || !name.trim())
        return 'KS';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) {
        return parts[0].substring(0, 2).toUpperCase();
    }
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
// Deterministic color palette for avatars based on name
function getAvatarGradient(name) {
    if (!name)
        return 'from-amber-700 via-stone-800 to-amber-900';
    const charSum = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const gradients = [
        'from-amber-700 via-amber-800 to-stone-900', // Terracotta artisan
        'from-amber-600 via-stone-700 to-amber-900', // Warm ochre
        'from-stone-800 via-amber-900 to-stone-950', // Deep teak
        'from-emerald-800 via-stone-800 to-emerald-950', // Forest jade
        'from-indigo-900 via-stone-800 to-indigo-950', // Indigo dye
        'from-rose-900 via-amber-900 to-stone-900', // Madder red
    ];
    return gradients[charSum % gradients.length];
}
/**
 * Robust, Fail-Safe Avatar Component for KarigarSetu AI.
 * Priority:
 * 1. Image URL (with error boundary)
 * 2. Deterministic Indian artisan SVG illustration
 * 3. Heritage monogram initials badge
 * NEVER shows broken image icon.
 */
export const Avatar = ({ src, name = 'Artisan', size = 'md', className = '', role, showBadge = false, }) => {
    const [hasError, setHasError] = useState(false);
    const { container, text } = sizeClasses[size] || sizeClasses.md;
    const initials = getInitials(name);
    const gradient = getAvatarGradient(name);
    // Use only the image supplied by the authenticated profile.
    const [srcIndex, setSrcIndex] = useState(0);
    const candidateSources = [src].filter((s) => !!s && s.trim().length > 0);
    const activeSrc = candidateSources[srcIndex] || null;
    const handleImgError = () => {
        if (srcIndex < candidateSources.length - 1) {
            setSrcIndex((prev) => prev + 1);
        }
        else {
            setHasError(true);
        }
    };
    const renderFallbackSvg = () => {
        // Default: Crisp Heritage Monogram Badge
        return (<div className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center text-heritage-gold-light font-black tracking-wider ${text}`}>
        {initials}
      </div>);
    };
    return (<div className={`relative inline-flex items-center justify-center rounded-full overflow-hidden shrink-0 border-2 border-heritage-gold/50 shadow-sm bg-heritage-ivory ${container} ${className}`} title={name}>
      {activeSrc && !hasError ? (<img src={activeSrc} alt={name} onError={handleImgError} className="w-full h-full object-cover"/>) : (renderFallbackSvg())}

      {/* Role badge indicator if requested */}
      {showBadge && role && (<span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border border-white ${role === 'seller' ? 'bg-amber-500' : 'bg-emerald-500'}`} title={role}/>)}
    </div>);
};
