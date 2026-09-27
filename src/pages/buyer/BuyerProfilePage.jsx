import React, { useState, useRef } from 'react';
import { MapPin, Heart, ShoppingBag, CheckCircle2, Camera, Upload } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { LocationInput } from '../../components/common/LocationInput';
import { Avatar } from '../../components/common/Avatar';
import { ProfileImageEditor } from '../../components/common/ProfileImageEditor';
export const BuyerProfilePage = () => {
    const { currentUser, orders, wishlist, updateUserProfile } = useApp();
    const [fullName, setFullName] = useState(currentUser?.full_name || '');
    const [email, setEmail] = useState(currentUser?.email || '');
    const [city, setCity] = useState(currentUser?.city || '');
    const [state, setState] = useState(currentUser?.state || '');
    const [profileImage, setProfileImage] = useState(currentUser?.profile_image || '');
    const [saved, setSaved] = useState(false);
    const handleSave = (e) => {
        e.preventDefault();
        updateUserProfile({
            full_name: fullName,
            email,
            city,
            state,
            profile_image: profileImage,
        });
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };
    return (<div className="min-h-screen bg-heritage-ivory py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-heritage-brown">
            Patron Profile & Preferences
          </h1>
          <p className="text-xs text-heritage-charcoal/70 mt-0.5">
            Manage your delivery address, saved craft collections, and account settings.
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-heritage-terracotta/20 shadow-3d flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
          <ProfileImageEditor value={profileImage} name={fullName} onChange={(image) => { setProfileImage(image); updateUserProfile({ profile_image: image }); }} />

          <div className="text-center sm:text-left space-y-1">
            <h2 className="font-serif font-black text-2xl text-heritage-brown">
              {fullName}
            </h2>
            <p className="text-xs text-heritage-terracotta font-semibold">
              @{currentUser?.username} &bull; Verified Patron
            </p>
            <div className="flex items-center justify-center sm:justify-start space-x-4 text-xs text-heritage-charcoal/70 pt-1">
              <span className="flex items-center">
                <MapPin className="w-3.5 h-3.5 mr-1 text-heritage-terracotta"/>
                {city}, {state}
              </span>
              <span className="flex items-center">
                <ShoppingBag className="w-3.5 h-3.5 mr-1 text-heritage-brown"/>
                {orders.length} Purchases
              </span>
              <span className="flex items-center">
                <Heart className="w-3.5 h-3.5 mr-1 text-heritage-terracotta"/>
                {wishlist.length} Saved Crafts
              </span>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-heritage-sand shadow-3d space-y-4">
          <h3 className="font-serif font-bold text-lg text-heritage-brown pb-3 border-b border-heritage-sand">
            Personal Details
          </h3>

          {saved && (<div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600"/>
              <span>Details saved successfully!</span>
            </div>)}

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-heritage-brown mb-1">
                  Full Name
                </label>
                <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full p-2.5 rounded-xl border border-heritage-sand text-xs font-medium focus:border-heritage-terracotta outline-none"/>
              </div>

              <div>
                <label className="block text-xs font-bold text-heritage-brown mb-1">
                  Email Address
                </label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2.5 rounded-xl border border-heritage-sand text-xs font-medium focus:border-heritage-terracotta outline-none"/>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-heritage-brown mb-1">
                  City
                </label>
                <LocationInput city={city} state={state} onChangeCity={setCity} onChangeState={setState} placeholder="e.g. Bengaluru"/>
              </div>

              <div>
                <label className="block text-xs font-bold text-heritage-brown mb-1">
                  State
                </label>
                <input type="text" value={state} onChange={(e) => setState(e.target.value)} className="w-full p-2.5 rounded-xl border border-heritage-sand text-xs font-medium focus:border-heritage-terracotta outline-none"/>
              </div>
            </div>

            <button type="submit" className="py-2.5 px-5 rounded-xl bg-heritage-terracotta hover:bg-heritage-terracotta-dark text-white font-bold text-xs shadow-md transition">
              Update Preferences
            </button>
          </form>
        </div>
      </div>
    </div>);
};
