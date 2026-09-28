import React, { useState } from 'react';
import { X, Calendar, Clock, MapPin, CheckCircle, Video, User, Phone, Mail, MessageSquare } from 'lucide-react';
import { Property } from '../types/property';
import { StorageService } from '../services/storageService';

interface ScheduleVisitModalProps {
  property?: Property | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ScheduleVisitModal: React.FC<ScheduleVisitModalProps> = ({
  property,
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('10:00');
  const [type, setType] = useState<'presencial' | 'video'>('presencial');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !date) return;

    StorageService.saveLead({
      name,
      phone,
      email,
      propertyId: property?.id,
      propertyTitle: property?.title,
      scheduledDate: date,
      scheduledTime: time,
      preferredContact: 'whatsapp',
      type: 'visita',
      message: `${type === 'video' ? '[Tour Virtual em Vídeo]' : '[Visita Presencial]'} ${message}`
    });

    setSubmitted(true);

    // Open WhatsApp after a brief delay
    const msg = encodeURIComponent(
      `Olá Maria Júlia, solicitei o agendamento de uma visita através do portal:\n` +
      `• Nome: ${name}\n` +
      `• Telefone: ${phone}\n` +
      `• Tipo: ${type === 'presencial' ? 'Visita Presencial' : 'Vídeochamada ao Vivo'}\n` +
      `• Data: ${date} às ${time}\n` +
      (property ? `• Imóvel: ${property.code} - ${property.title}\n` : '') +
      (message ? `• Observação: ${message}` : '')
    );
    setTimeout(() => {
      window.open(`https://wa.me/5548991827701?text=${msg}`, '_blank');
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative bg-white border border-neutral-200 rounded-2xl max-w-lg w-full max-h-[92vh] overflow-y-auto shadow-2xl p-6 sm:p-8 text-neutral-900">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-600 hover:text-neutral-950 transition-colors cursor-pointer"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-neutral-950">
              Solicitação Enviada!
            </h3>
            <p className="text-xs text-neutral-600 max-w-sm mx-auto leading-relaxed">
              Obrigado, {name}. A Maria Júlia Gamba entrará em contato em instantes no seu WhatsApp ({phone}) para confirmar o agendamento.
            </p>
            <div className="pt-4">
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-lg bg-neutral-950 text-white font-semibold text-xs hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                Concluir
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-semibold bg-amber-50 border border-amber-300 text-amber-900 mb-2">
                <Calendar className="w-3.5 h-3.5 text-amber-700" />
                <span>Atendimento Exclusivo</span>
              </div>
              <h3 className="font-serif text-2xl font-bold text-neutral-950">
                Agende sua Visita
              </h3>
              <p className="text-xs text-neutral-600 mt-1">
                Escolha a data ideal para conhecer o imóvel acompanhado(a) de Maria Júlia Gamba.
              </p>
            </div>

            {/* Targeted property quick banner if present */}
            {property && (
              <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 flex items-center gap-3">
                <img
                  src={property.images[0]}
                  alt={property.title}
                  className="w-14 h-14 rounded-lg object-cover"
                />
                <div className="truncate">
                  <span className="text-[10px] font-mono text-amber-700 font-bold block">{property.code}</span>
                  <span className="text-xs font-bold text-neutral-950 truncate block">{property.title}</span>
                  <span className="text-[11px] text-neutral-500 block">{property.neighborhood}, {property.city}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Type: Presencial or Video Tour */}
              <div>
                <label className="text-xs font-semibold text-neutral-700 block mb-1.5">
                  Modalidade de Visita
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setType('presencial')}
                    className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      type === 'presencial'
                        ? 'bg-neutral-950 text-amber-300 border border-neutral-800 shadow-sm'
                        : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 border border-neutral-300'
                    }`}
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Presencial no Imóvel</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setType('video')}
                    className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      type === 'video'
                        ? 'bg-neutral-950 text-amber-300 border border-neutral-800 shadow-sm'
                        : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 border border-neutral-300'
                    }`}
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Vídeo Tour ao Vivo</span>
                  </button>
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="text-xs font-semibold text-neutral-700 block mb-1">Seu Nome Completo *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Roberto Silva"
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-lg pl-9 pr-3 py-2.5 text-sm text-neutral-900 focus:bg-white focus:outline-none focus:border-amber-500 shadow-2xs"
                  />
                </div>
              </div>

              {/* Phone / WhatsApp */}
              <div>
                <label className="text-xs font-semibold text-neutral-700 block mb-1">WhatsApp para Contato *</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(48) 99999-9999"
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-lg pl-9 pr-3 py-2.5 text-sm text-neutral-900 focus:bg-white focus:outline-none focus:border-amber-500 shadow-2xs"
                  />
                </div>
              </div>

              {/* Date & Time Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-neutral-700 block mb-1">Data Desejada *</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-lg px-3 py-2 text-sm text-neutral-900 focus:bg-white focus:outline-none focus:border-amber-500 shadow-2xs cursor-pointer"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-700 block mb-1">Horário Sugerido</label>
                  <select
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-lg px-3 py-2 text-sm text-neutral-900 focus:bg-white focus:outline-none focus:border-amber-500 shadow-2xs cursor-pointer"
                  >
                    <option value="09:00">09:00</option>
                    <option value="10:00">10:00</option>
                    <option value="11:30">11:30</option>
                    <option value="14:00">14:00</option>
                    <option value="15:30">15:30</option>
                    <option value="17:00">17:00</option>
                    <option value="18:30">18:30 (Pôr do Sol)</option>
                  </select>
                </div>
              </div>

              {/* Optional message */}
              <div>
                <label className="text-xs font-semibold text-neutral-700 block mb-1">Mensagem ou Dúvida (opcional)</label>
                <textarea
                  rows={2}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Gostaria de saber se aceita permuta ou carro no negócio..."
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-lg px-3 py-2 text-xs text-neutral-900 focus:bg-white focus:outline-none focus:border-amber-500 shadow-2xs"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3.5 rounded-xl font-bold uppercase tracking-wider text-xs text-neutral-950 bg-amber-400 hover:bg-amber-500 transition-all cursor-pointer shadow-sm"
              >
                Confirmar e Enviar via WhatsApp
              </button>

              <p className="text-[11px] text-neutral-500 text-center">
                Seus dados estão protegidos de acordo com a LGPD e o sigilo profissional do CRECI.
              </p>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};
