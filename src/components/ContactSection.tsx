import React, { useState } from 'react';
import { HostelSettings } from '../types';
import { Phone, Mail, MessageSquare, Clock, MapPin, Send, CheckCircle2 } from 'lucide-react';

interface ContactSectionProps {
  settings: HostelSettings;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ settings }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [msg, setMsg] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;
    setSent(true);
    setTimeout(() => {
      setName('');
      setPhone('');
      setMsg('');
      setSent(false);
    }, 4000);
  };

  const openWhatsApp = () => {
    const cleanNumber = (settings.whatsapp || '').replace(/[^0-9]/g, '');
    const text = encodeURIComponent('Salam, I am interested in inquiring about room availability at Paradise Boys Hostel Peshawar.');
    window.open(`https://wa.me/${cleanNumber}?text=${text}`, '_blank');
  };

  return (
    <section id="contact-section" className="py-16 md:py-24 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-black uppercase tracking-widest text-[#800d1e] bg-rose-50 px-3.5 py-1 rounded-full border border-rose-200">
            Get In Touch
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-stone-900 tracking-tight font-serif mt-3">
            Contact Paradise Boys Hostel
          </h2>
          <p className="mt-3 text-stone-600 text-sm sm:text-base font-medium">
            Reach out for room inquiries, admission details, or physical tour arrangements.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Contact Details Cards */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Phone & WhatsApp Card */}
            <div className="bg-stone-50 border border-stone-200 rounded-2xl p-5 hover:border-amber-400 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#800d1e] text-white flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <div className="text-xs font-bold text-stone-500 uppercase">Direct Helpline</div>
                  <div className="text-base font-black text-stone-900">{settings.phone}</div>
                </div>
              </div>
            </div>

            {/* WhatsApp Direct Chat Card */}
            <div
              onClick={openWhatsApp}
              className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 hover:border-emerald-400 transition-all cursor-pointer shadow-sm group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-emerald-800 uppercase">Chat on WhatsApp</div>
                    <div className="text-base font-black text-emerald-950">{settings.whatsapp}</div>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-lg group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  Chat Now &rarr;
                </span>
              </div>
            </div>

            {/* Email Card */}
            <div className="bg-stone-50 border border-stone-200 rounded-2xl p-5 hover:border-amber-400 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#800d1e] text-white flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <div className="text-xs font-bold text-stone-500 uppercase">Official Email</div>
                  <div className="text-base font-black text-stone-900">{settings.email}</div>
                </div>
              </div>
            </div>

            {/* Office & Visiting Hours */}
            <div className="bg-stone-50 border border-stone-200 rounded-2xl p-5 space-y-3">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-stone-900">Visiting Hours</div>
                  <div className="text-xs text-stone-600 mt-0.5">{settings.visitingHours}</div>
                </div>
              </div>
              <div className="flex items-start gap-3 pt-2 border-t border-stone-200/60">
                <MapPin className="w-5 h-5 text-[#800d1e] flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-stone-900">Hostel Address</div>
                  <div className="text-xs text-stone-600 mt-0.5">
                    {settings.address}, {settings.city}, {settings.province}
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Quick Message Form */}
          <div className="lg:col-span-7 bg-stone-50 border border-stone-200 rounded-3xl p-6 sm:p-8">
            <h3 className="text-xl font-bold font-serif text-stone-900 mb-1">
              Send a Quick Inquiry
            </h3>
            <p className="text-xs text-stone-500 mb-6">
              Have a question regarding security, meals, or semester room allocation? Leave a message.
            </p>

            {sent ? (
              <div className="bg-emerald-100 border border-emerald-300 text-emerald-900 p-6 rounded-2xl text-center">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
                <h4 className="font-bold text-base">Inquiry Dispatched!</h4>
                <p className="text-xs text-emerald-800 mt-1">
                  Our front desk warden will contact you shortly on your provided phone number.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Your Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Farooq Shah"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#800d1e]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="0300-1234567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#800d1e]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Your Message</label>
                  <textarea
                    rows={4}
                    placeholder="Inquire about seat availability, move-in requirements, or visiting..."
                    value={msg}
                    onChange={(e) => setMsg(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#800d1e]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#800d1e] hover:bg-[#991b1b] text-white font-black py-3 px-6 rounded-xl shadow text-xs uppercase tracking-wider flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4 text-amber-300" />
                  <span>Send Inquiry to Reception</span>
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};
