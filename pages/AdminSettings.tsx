import React, { useState, useEffect } from 'react';
import { getConfig, saveConfig } from '../services/mockBackend';
import { CertificateConfig } from '../types';
import { Save, Upload } from 'lucide-react';

const AdminSettings = () => {
  const [config, setConfig] = useState<CertificateConfig | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getConfig().then(setConfig);
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!config) return;
    setSaving(true);
    await saveConfig(config);
    setSaving(false);
    alert('تم حفظ الإعدادات بنجاح!');
  };

  const handleFileChange = (field: keyof CertificateConfig, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && config) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setConfig({ ...config, [field]: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  if (!config) return <div className="p-8 text-center text-slate-500">جاري تحميل الإعدادات...</div>;

  return (
    <div className="max-w-4xl mx-auto" dir="rtl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">إعدادات الشهادة</h1>
        <p className="text-slate-500">تخصيص بيانات وتوقيعات المعهد.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* General Info */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
           <h2 className="font-bold text-lg text-slate-800 mb-4 pb-2 border-b border-slate-50">بيانات المعهد</h2>
           <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">اسم المعهد (عربي)</label>
                <input required type="text" className="w-full px-3 py-2 border border-slate-200 rounded-lg" value={config.schoolName} onChange={e => setConfig({...config, schoolName: e.target.value})} />
              </div>
               <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">اسم المعهد (إنجليزي)</label>
                <input required type="text" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-left" dir="ltr" value={config.schoolNameEn} onChange={e => setConfig({...config, schoolNameEn: e.target.value})} />
              </div>
           </div>
        </div>

        {/* Signatures & Images */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
           <h2 className="font-bold text-lg text-slate-800 mb-4 pb-2 border-b border-slate-50">الصور والتوقيعات</h2>
           <div className="grid md:grid-cols-3 gap-8">
              
              {/* Logo Upload */}
              <div className="space-y-3">
                 <label className="text-sm font-medium text-slate-700">شعار المعهد</label>
                 <div className="flex flex-col items-center gap-3 border p-4 rounded-lg bg-slate-50">
                    <div className="w-24 h-24 bg-white border border-slate-200 rounded-lg flex items-center justify-center overflow-hidden">
                       {config.logoUrl ? <img src={config.logoUrl} className="w-full h-full object-contain" /> : <span className="text-xs text-slate-400">لا يوجد شعار</span>}
                    </div>
                    <label className="cursor-pointer bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
                      <Upload size={16} /> رفع صورة
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange('logoUrl', e)} />
                    </label>
                 </div>
              </div>

               {/* Stamp Upload */}
              <div className="space-y-3">
                 <label className="text-sm font-medium text-slate-700">الختم الذهبي</label>
                 <div className="flex flex-col items-center gap-3 border p-4 rounded-lg bg-slate-50">
                    <div className="w-24 h-24 bg-white border border-slate-200 rounded-lg flex items-center justify-center overflow-hidden">
                       {config.stampUrl ? <img src={config.stampUrl} className="w-full h-full object-contain" /> : <span className="text-xs text-slate-400">لا يوجد ختم</span>}
                    </div>
                    <label className="cursor-pointer bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
                      <Upload size={16} /> رفع صورة
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange('stampUrl', e)} />
                    </label>
                 </div>
              </div>

               {/* Signature Upload */}
              <div className="space-y-3">
                 <label className="text-sm font-medium text-slate-700">توقيع المدير</label>
                 <div className="flex flex-col items-center gap-3 border p-4 rounded-lg bg-slate-50">
                    <div className="w-32 h-16 bg-white border border-slate-200 rounded-lg flex items-center justify-center overflow-hidden">
                       {config.managerSignatureUrl ? <img src={config.managerSignatureUrl} className="w-full h-full object-contain" /> : <span className="text-xs text-slate-400">لا يوجد توقيع</span>}
                    </div>
                    <label className="cursor-pointer bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
                      <Upload size={16} /> رفع صورة
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange('managerSignatureUrl', e)} />
                    </label>
                 </div>
              </div>

           </div>
        </div>

        <div className="flex justify-end pt-4">
          <button 
            type="submit" 
            disabled={saving}
            className="bg-royal-900 hover:bg-royal-800 text-white px-8 py-3 rounded-lg font-bold shadow-lg flex items-center gap-2 transition-all"
          >
            <Save size={20} />
            {saving ? 'جاري الحفظ...' : 'حفظ الإعدادات'}
          </button>
        </div>

      </form>
    </div>
  );
};

export default AdminSettings;