import React, { useState, useEffect } from 'react';
import { ShieldCheck, Upload, CheckCircle, XCircle, AlertCircle, FileText, Camera, UserSquare } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const IdentityVerificationView: React.FC = () => {
  const { userData } = useAuth();
  const isAdmin = userData?.role === 'admin';
  

  const [verificationStatus, setVerificationStatus] = useState<string>('unverified'); // 'unverified', 'pending', 'approved', 'rejected'
  // Mock fields for the stylist to upload
  const [documents, setDocuments] = useState({
    idFront: null as File | null,
    idBack: null as File | null,
    selfie: null as File | null,
    criminalRecord: null as File | null,
  });

  // Mock list of pending stylits for Admin
  const [pendingVerifications, setPendingVerifications] = useState<any[]>([
    { id: '1', name: 'Andrea Molina', email: 'andrea@example.com', submittedAt: 'Hace 2 horas', status: 'pending' },
    { id: '2', name: 'Camila Soto', email: 'camila@example.com', submittedAt: 'Hace 1 día', status: 'pending' }
  ]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    if (e.target.files && e.target.files[0]) {
      setDocuments(prev => ({ ...prev, [field]: e.target.files![0] }));
    }
  };

  const handleSubmit = () => {
    // In a real app, this would upload the files to a secure storage bucket (e.g. Firebase Storage)
    if (!documents.idFront || !documents.idBack || !documents.selfie || !documents.criminalRecord) {
      alert('Por favor sube todos los documentos obligatorios.');
      return;
    }
    
    setVerificationStatus('pending');
    alert('Documentos enviados correctamente. Estamos realizando el background check.');
  };

  const handleReview = (id: string, decision: 'approved' | 'rejected') => {
    setPendingVerifications(prev => prev.map(p => p.id === id ? { ...p, status: decision } : p));
    alert(`Estilista ${decision === 'approved' ? 'aprobado' : 'rechazado'}.`);
  };

  if (isAdmin) {
    return (
      <div className="p-6 max-w-5xl mx-auto">
        <div className="mb-8">
          <h2 className="editorial-title text-3xl mb-2 flex items-center gap-3">
            <ShieldCheck className="text-gold" size={32} /> Center de Verificación
          </h2>
          <p className="text-gray/80">Revisa la documentación y background checks de los nuevos profesionales.</p>
        </div>

        <div className="bg-white rounded-2xl border border-border overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-ivory border-b border-border">
              <tr>
                <th className="p-4 text-[0.65rem] uppercase tracking-widest text-gray">Profesional</th>
                <th className="p-4 text-[0.65rem] uppercase tracking-widest text-gray">Envío</th>
                <th className="p-4 text-[0.65rem] uppercase tracking-widest text-gray">Documentos</th>
                <th className="p-4 text-[0.65rem] uppercase tracking-widest text-gray">Background Check</th>
                <th className="p-4 text-[0.65rem] uppercase tracking-widest text-gray">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {pendingVerifications.map(p => (
                <tr key={p.id} className="hover:bg-cream/50 transition-colors">
                  <td className="p-4">
                    <div className="font-medium text-char">{p.name}</div>
                    <div className="text-xs text-gray">{p.email}</div>
                  </td>
                  <td className="p-4 text-sm text-gray">{p.submittedAt}</td>
                  <td className="p-4 flex gap-2">
                    <span className="bg-green/10 text-green px-2 py-1 rounded text-xs">Cédula ✓</span>
                    <span className="bg-green/10 text-green px-2 py-1 rounded text-xs">Selfie ✓</span>
                  </td>
                  <td className="p-4">
                     <span className="bg-green/10 text-green px-2 py-1 rounded text-xs flex items-center w-fit gap-1"><CheckCircle size={14} /> Sistema OK</span>
                  </td>
                  <td className="p-4">
                    {p.status === 'pending' ? (
                      <div className="flex gap-2">
                         <button onClick={() => handleReview(p.id, 'approved')} className="text-green hover:underline text-sm font-medium">Aprobar</button>
                         <button onClick={() => handleReview(p.id, 'rejected')} className="text-red hover:underline text-sm font-medium">Rechazar</button>
                      </div>
                    ) : (
                      <span className={`text-sm ${p.status === 'approved' ? 'text-green' : 'text-red'}`}>
                        {p.status === 'approved' ? 'Aprobado' : 'Rechazado'}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
              {pendingVerifications.length === 0 && (
                 <tr><td colSpan={5} className="p-8 text-center text-gray">No hay verificaciones pendientes.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // --- STYLIST / PRO VIEW ---
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-10 text-center">
         <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4 text-gold">
            <ShieldCheck size={32} />
         </div>
         <h2 className="editorial-title text-3xl mb-2">Verificación de Identidad</h2>
         <p className="text-gray/80 max-w-md mx-auto">
           Para garantizar la seguridad de nuestros clientes, requerimos validar tu identidad y antecedentes antes de comenzar a recibir reservas. Es un proceso rápido y 100% confidencial.
         </p>
      </div>

      <div className="bg-white border border-border p-8 rounded-2xl shadow-sm mb-6">
         {verificationStatus === 'unverified' && (
           <div className="space-y-8">
             <div className="flex items-start gap-4">
               <div className="w-10 h-10 rounded-full bg-cream text-char flex items-center justify-center shrink-0">1</div>
               <div className="flex-1">
                 <h4 className="font-serif text-xl mb-1 flex items-center gap-2"><UserSquare size={20} className="text-gold" /> Cédula de Identidad</h4>
                 <p className="text-sm text-gray mb-4">Asegúrate de que la foto sea iluminada, sin reflejos y todos los textos sean legibles.</p>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border border-dashed border-border rounded-xl p-6 flex flex-col items-center justify-center bg-ivory/50 cursor-pointer hover:bg-gold/5 transition-colors relative">
                       <input type="file" onChange={(e) => handleFileUpload(e, 'idFront')} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
                       <Upload size={24} className="text-gray mb-2" />
                       <div className="text-sm font-medium">Lado Frontal</div>
                       {documents.idFront && <div className="text-xs text-green mt-1 flex items-center gap-1"><CheckCircle size={12} /> {documents.idFront.name}</div>}
                    </div>
                    <div className="border border-dashed border-border rounded-xl p-6 flex flex-col items-center justify-center bg-ivory/50 cursor-pointer hover:bg-gold/5 transition-colors relative">
                       <input type="file" onChange={(e) => handleFileUpload(e, 'idBack')} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
                       <Upload size={24} className="text-gray mb-2" />
                       <div className="text-sm font-medium">Lado Posterior</div>
                       {documents.idBack && <div className="text-xs text-green mt-1 flex items-center gap-1"><CheckCircle size={12} /> {documents.idBack.name}</div>}
                    </div>
                 </div>
               </div>
             </div>

             <div className="h-[1px] bg-border" />

             <div className="flex items-start gap-4">
               <div className="w-10 h-10 rounded-full bg-cream text-char flex items-center justify-center shrink-0">2</div>
               <div className="flex-1">
                 <h4 className="font-serif text-xl mb-1 flex items-center gap-2"><Camera size={20} className="text-gold" /> Selfie de Verificación</h4>
                 <p className="text-sm text-gray mb-4">Tómate una selfie sosteniendo tu cédula visible al lado de tu rostro.</p>
                 <div className="border border-dashed border-border rounded-xl p-6 flex flex-col items-center justify-center bg-ivory/50 cursor-pointer hover:bg-gold/5 transition-colors relative max-w-sm">
                    <input type="file" onChange={(e) => handleFileUpload(e, 'selfie')} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" capture="user" />
                    <Camera size={24} className="text-gray mb-2" />
                    <div className="text-sm font-medium">Tomar foto ahora</div>
                    {documents.selfie && <div className="text-xs text-green mt-1 flex items-center gap-1"><CheckCircle size={12} /> Guardada</div>}
                 </div>
               </div>
             </div>

             <div className="h-[1px] bg-border" />

             <div className="flex items-start gap-4">
               <div className="w-10 h-10 rounded-full bg-cream text-char flex items-center justify-center shrink-0">3</div>
               <div className="flex-1">
                 <h4 className="font-serif text-xl mb-1 flex items-center gap-2"><FileText size={20} className="text-gold" /> Certificado de Antecedentes</h4>
                 <p className="text-sm text-gray mb-4">Fines especiales. Máximo 30 días de antigüedad. Este documento inicia el background check automático.</p>
                 <div className="border border-dashed border-border rounded-xl p-6 flex flex-col items-center justify-center bg-ivory/50 cursor-pointer hover:bg-gold/5 transition-colors relative max-w-sm">
                    <input type="file" onChange={(e) => handleFileUpload(e, 'criminalRecord')} className="absolute inset-0 opacity-0 cursor-pointer" accept=".pdf,image/*" />
                    <Upload size={24} className="text-gray mb-2" />
                    <div className="text-sm font-medium">Subir PDF o Imagen</div>
                    {documents.criminalRecord && <div className="text-xs text-green mt-1 flex items-center gap-1"><CheckCircle size={12} /> Subido</div>}
                 </div>
               </div>
             </div>

             <div className="pt-6">
                <button onClick={handleSubmit} className="btn btn-dark w-full py-4 text-sm tracking-[0.1em] rounded-xl flex justify-center gap-2">
                   Enviar para Verificación <ShieldCheck size={18} />
                </button>
             </div>
           </div>
         )}

         {verificationStatus === 'pending' && (
            <div className="text-center py-10">
               <div className="w-24 h-24 rounded-full bg-gold/10 mx-auto flex items-center justify-center text-gold mb-6 relative">
                 <ShieldCheck size={40} />
                 <div className="absolute inset-0 border-2 border-dashed border-gold rounded-full animate-[spin_4s_linear_infinite]" />
               </div>
               <h3 className="font-serif text-3xl mb-2">Verificación en Proceso</h3>
               <p className="text-gray max-w-sm mx-auto mb-6">
                 Estamos analizando tus documentos y ejecutando el background check de seguridad. 
                 Este proceso usualmente toma menos de 24 horas. Te notificaremos por correo electrónico cuando esté listo.
               </p>
               <div className="bg-ivory py-4 px-6 rounded-lg text-sm flex items-center gap-3 justify-center text-char border border-border w-fit mx-auto">
                 <Clock size={16} className="text-gold" />
                 Fase actual: Procesamiento del Background Check 
               </div>
            </div>
         )}
      </div>

      <div className="flex items-center gap-3 text-xs text-gray/60 justify-center">
         <ShieldCheck size={14} /> RM cifra y protege tus documentos PII. No compartimos esta información con terceros.
      </div>
    </div>
  );
};

export default IdentityVerificationView;
