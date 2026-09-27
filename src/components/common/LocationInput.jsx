import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Navigation, Loader2, Check } from 'lucide-react';
import { searchLocations, reverseGeocodeCoords } from '../../data/indianLocations';
export const LocationInput = ({ city, state, onChangeCity, onChangeState, onLocationDetails, placeholder = 'Enter your city / village / cluster', required = true, }) => {
    const [suggestions, setSuggestions] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isDetecting, setIsDetecting] = useState(false);
    const [detectSuccess, setDetectSuccess] = useState(false);
    const [detectError, setDetectError] = useState('');
    const containerRef = useRef(null);
    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    const handleInputChange = (val) => {
        onChangeCity(val);
        if (val.trim().length >= 2) {
            const results = searchLocations(val);
            setSuggestions(results);
            setIsOpen(results.length > 0);
        }
        else {
            setSuggestions([]);
            setIsOpen(false);
        }
    };
    const handleSelectSuggestion = (item) => {
        onChangeCity(item.city);
        onChangeState(item.state);
        setIsOpen(false);
        setSuggestions([]);
    };
    const handleAutoDetectLocation = () => {
      setDetectError('');
        if (!navigator.geolocation) {
        setDetectError('Location detection is unavailable. Please enter manually.');
            return;
        }
        setIsDetecting(true);
        navigator.geolocation.getCurrentPosition(async (pos) => {
            const { latitude, longitude } = pos.coords;
            const result = await reverseGeocodeCoords(latitude, longitude);
            if (result) {
                if (result.city)
                    onChangeCity(result.city);
                if (result.state)
                    onChangeState(result.state);
              onLocationDetails?.({ ...result, latitude, longitude });
              setDetectSuccess(true);
              setTimeout(() => setDetectSuccess(false), 2500);
            }
            else {
              setDetectError('Unable to detect location. Please enter manually.');
            }
            setIsDetecting(false);
        }, (err) => {
            console.warn('Geolocation permission error or timeout', err);
            setDetectError(err.code === 1 ? 'Location permission denied. Please enter manually.' : 'Unable to detect location. Please enter manually.');
            setIsDetecting(false);
        }, { timeout: 7000, enableHighAccuracy: true });
    };
    return (<div ref={containerRef} className="relative w-full">
      <div className="relative flex items-center">
        <MapPin className="w-4 h-4 text-heritage-charcoal/40 absolute left-3.5 top-3 pointer-events-none"/>
        <input type="text" required={required} value={city} onChange={(e) => handleInputChange(e.target.value)} onFocus={() => {
            if (city.trim().length >= 2) {
                const results = searchLocations(city);
                setSuggestions(results);
                setIsOpen(results.length > 0);
            }
        }} placeholder={placeholder} className="w-full pl-10 pr-28 py-2.5 rounded-xl border border-heritage-sand bg-heritage-ivory/40 text-xs font-medium focus:border-heritage-terracotta outline-none"/>

        {/* Auto Detect Button */}
        <button type="button" onClick={handleAutoDetectLocation} disabled={isDetecting} title="Auto-detect your location using GPS" className={`absolute right-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-bold flex items-center space-x-1 transition shadow-xs ${detectSuccess
            ? 'bg-emerald-600 text-white'
            : 'bg-heritage-sand/80 hover:bg-heritage-sand text-heritage-brown border border-heritage-sand'}`}>
          {isDetecting ? (<>
              <Loader2 className="w-3 h-3 animate-spin text-heritage-terracotta"/>
              <span>Detecting location...</span>
            </>) : detectSuccess ? (<>
              <Check className="w-3 h-3"/>
              <span>Location detected</span>
            </>) : (<>
              <Navigation className="w-3 h-3 text-heritage-terracotta"/>
              <span>Auto-detect</span>
            </>)}
        </button>
      </div>
      {detectError && <p className="mt-1 text-[11px] font-medium text-rose-700">{detectError}</p>}

      {/* Autocomplete Dropdown */}
      {isOpen && suggestions.length > 0 && (<div className="absolute left-0 right-0 top-full mt-1 bg-white rounded-2xl border border-heritage-terracotta/25 shadow-3d-lg z-50 max-h-60 overflow-y-auto divide-y divide-heritage-sand/60">
          <div className="p-2 bg-heritage-sand/30 text-[10px] font-bold text-heritage-brown uppercase tracking-wider flex items-center justify-between">
            <span>Select Craft Cluster / City</span>
            <span className="text-[9px] text-heritage-charcoal/50 font-normal">Click to auto-fill state</span>
          </div>

          {suggestions.map((item, idx) => (<div key={idx} onMouseDown={() => handleSelectSuggestion(item)} className="p-2.5 hover:bg-heritage-sand/40 cursor-pointer transition text-left flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="font-bold text-xs text-heritage-brown">
                    {item.city}
                  </span>
                  <span className="text-[10px] text-heritage-charcoal/60">
                    &bull; {item.state}
                  </span>
                </div>
                {item.craftContext && (<p className="text-[10px] text-heritage-terracotta font-medium mt-0.5 line-clamp-1">
                    Tradition: {item.craftContext}
                  </p>)}
              </div>

              <span className="text-[10px] font-semibold text-heritage-charcoal/40 mt-1">
                Select
              </span>
            </div>))}
        </div>)}
    </div>);
};
