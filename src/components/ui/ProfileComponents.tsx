import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

export const ToggleSwitch = ({ checked, onChange, label, ...props }: { checked: boolean; onChange: () => void; label: string } & any) => (
  <div className="flex items-center justify-between py-3" {...props}>
    <span className="text-sm text-zinc-400">{label}</span>
    <button
      onClick={onChange}
      className={`w-11 h-6 rounded-full transition-colors ${checked ? 'bg-emerald-500' : 'bg-zinc-700'}`}
    >
      <motion.div
        className="w-4 h-4 bg-white rounded-full shadow-sm ml-1"
        animate={{ x: checked ? 20 : 0 }}
      />
    </button>
  </div>
);

export const ListItem = ({ label, value, onClick, icon: Icon }: { label: string; value?: string; onClick?: () => void; icon?: any }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center justify-between py-4 border-b border-zinc-800 last:border-0"
  >
    <div className="flex items-center gap-3">
      {Icon && <Icon className="w-5 h-5 text-zinc-400" />}
      <span className="text-sm font-medium text-zinc-200">{label}</span>
    </div>
    {value && <span className="text-sm text-zinc-500">{value}</span>}
  </button>
);

export const Modal = ({ isOpen, onClose, title, children }: { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }) => (
  <AnimatePresence>
    {isOpen && (
      <>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="fixed inset-x-4 bottom-4 bg-zinc-900 rounded-2xl p-6 z-50 max-h-[80vh] overflow-y-auto"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-white">{title}</h2>
            <button onClick={onClose}><X className="w-6 h-6 text-zinc-400" /></button>
          </div>
          {children}
        </motion.div>
      </>
    )}
  </AnimatePresence>
);
