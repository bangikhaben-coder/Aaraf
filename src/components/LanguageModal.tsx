import React, { useState } from 'react';
import { Check, Plus, Trash2, RotateCcw, Download, Upload, Search, Globe, Edit3 } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { TranslationKey, BUILTIN_TRANSLATIONS } from '../i18n/translations';

interface LanguageModalProps {
  onClose: () => void;
}

export const LanguageModal: React.FC<LanguageModalProps> = ({ onClose }) => {
  const {
    currentLanguage,
    setLanguage,
    availableLanguages,
    updateTranslation,
    addCustomLanguage,
    deleteCustomLanguage,
    resetLanguageOverrides,
    customOverrides,
    exportTranslations,
    importTranslations,
  } = useLanguage();

  const [activeTab, setActiveTab] = useState<'select' | 'new' | 'edit'>('select');
  const [searchFilter, setSearchFilter] = useState<string>('');

  // Form for new custom language
  const [newCode, setNewCode] = useState<string>('');
  const [newName, setNewName] = useState<string>('');
  const [newNativeName, setNewNativeName] = useState<string>('');
  const [baseLanguage, setBaseLanguage] = useState<string>('en');

  // Import JSON string
  const [importJsonText, setImportJsonText] = useState<string>('');
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const handleCreateLanguage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim() || !newName.trim()) return;

    addCustomLanguage(newCode, newName, newNativeName || newName, baseLanguage);
    setNewCode('');
    setNewName('');
    setNewNativeName('');
    setActiveTab('edit');
  };

  const handleExport = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(exportTranslations());
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'chronos-custom-languages.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportSubmit = () => {
    if (!importJsonText.trim()) return;
    const ok = importTranslations(importJsonText);
    if (ok) {
      setImportStatus('Successfully imported translations!');
      setImportJsonText('');
      setTimeout(() => setImportStatus(null), 3000);
    } else {
      setImportStatus('Failed to import: Invalid JSON format.');
    }
  };

  // Keys available for editing
  const baseDictionary = BUILTIN_TRANSLATIONS['en'];
  const allKeys = Object.keys(baseDictionary) as TranslationKey[];

  const filteredKeys = allKeys.filter(key => {
    const original = baseDictionary[key] || '';
    const currentVal = customOverrides[currentLanguage]?.[key] || (BUILTIN_TRANSLATIONS[currentLanguage]?.[key]) || original;
    const query = searchFilter.toLowerCase();
    return key.toLowerCase().includes(query) || original.toLowerCase().includes(query) || currentVal.toLowerCase().includes(query);
  });

  const activeMeta = availableLanguages.find(l => l.code === currentLanguage) || availableLanguages[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-2xl border border-neutral-800 bg-neutral-900 shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-neutral-800 border border-neutral-700/60 text-white">
              <Globe className="w-4 h-4 text-sky-400" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Language System</h3>
              <p className="text-xs text-neutral-400">
                Current: <strong className="text-white">{activeMeta.name} ({activeMeta.nativeName})</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-xs text-neutral-400 hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-6 pt-3 border-b border-neutral-800 bg-neutral-950/40 text-xs">
          <button
            onClick={() => setActiveTab('select')}
            className={`px-3 py-2 font-medium border-b-2 transition-colors cursor-pointer ${
              activeTab === 'select'
                ? 'border-white text-white'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Languages ({availableLanguages.length})
          </button>
          <button
            onClick={() => setActiveTab('edit')}
            className={`px-3 py-2 font-medium border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'edit'
                ? 'border-white text-white'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Customize Translations</span>
          </button>
          <button
            onClick={() => setActiveTab('new')}
            className={`px-3 py-2 font-medium border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'new'
                ? 'border-white text-white'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Custom Language</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* TAB 1: SELECT LANGUAGE */}
          {activeTab === 'select' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {availableLanguages.map(lang => {
                  const isSelected = currentLanguage === lang.code;
                  return (
                    <div
                      key={lang.code}
                      onClick={() => setLanguage(lang.code)}
                      className={`group flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-neutral-600 bg-neutral-800/90 text-white shadow-sm'
                          : 'border-neutral-800 bg-neutral-950/70 hover:border-neutral-700 text-neutral-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                            isSelected
                              ? 'border-sky-400 bg-sky-400/20 text-sky-400'
                              : 'border-neutral-700 group-hover:border-neutral-500'
                          }`}
                        >
                          {isSelected && <div className="w-2 h-2 rounded-full bg-sky-400" />}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-white">{lang.nativeName}</span>
                            <span className="text-[10px] text-neutral-400">· {lang.name}</span>
                          </div>
                          <span className="text-[10px] text-neutral-500 uppercase">{lang.code}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {lang.isCustom && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteCustomLanguage(lang.code);
                            }}
                            className="p-1 text-neutral-500 hover:text-rose-400 transition-colors"
                            title="Delete custom language"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {isSelected && <Check className="w-4 h-4 text-sky-400" />}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Quick info */}
              <div className="pt-4 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-400">
                <span>Want to modify translations or add a custom dialect?</span>
                <button
                  onClick={() => setActiveTab('edit')}
                  className="text-white hover:underline font-medium"
                >
                  Edit Translations &rarr;
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: ADD CUSTOM LANGUAGE */}
          {activeTab === 'new' && (
            <form onSubmit={handleCreateLanguage} className="space-y-5">
              <div>
                <h4 className="text-sm font-semibold text-white">Create a Custom Language Pack</h4>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Add any language, dialect, or custom theme pack. Translations can be customized on the next step.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-neutral-400 mb-1">Language Code (e.g. &apos;eo&apos;, &apos;tl&apos;, &apos;pirate&apos;)</label>
                  <input
                    type="text"
                    required
                    value={newCode}
                    onChange={e => setNewCode(e.target.value)}
                    placeholder="e.g. nl, eo, custom"
                    className="w-full rounded-lg border border-neutral-800 bg-neutral-950 p-2.5 text-white placeholder-neutral-600 focus:border-neutral-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1">English Name (e.g. &apos;Esperanto&apos;)</label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                    placeholder="e.g. Dutch, Esperanto"
                    className="w-full rounded-lg border border-neutral-800 bg-neutral-950 p-2.5 text-white placeholder-neutral-600 focus:border-neutral-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1">Native Name (e.g. &apos;Nederlands&apos;)</label>
                  <input
                    type="text"
                    value={newNativeName}
                    onChange={e => setNewNativeName(e.target.value)}
                    placeholder="e.g. Nederlands"
                    className="w-full rounded-lg border border-neutral-800 bg-neutral-950 p-2.5 text-white placeholder-neutral-600 focus:border-neutral-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1">Clone Base Template From</label>
                  <select
                    value={baseLanguage}
                    onChange={e => setBaseLanguage(e.target.value)}
                    className="w-full rounded-lg border border-neutral-800 bg-neutral-950 p-2.5 text-white focus:border-neutral-600 focus:outline-none"
                  >
                    {availableLanguages.map(l => (
                      <option key={l.code} value={l.code}>
                        {l.name} ({l.code})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl text-xs font-semibold text-neutral-950 bg-white hover:bg-neutral-200 transition-colors shadow-sm cursor-pointer"
                >
                  Create &amp; Switch to Language
                </button>
              </div>

              {/* Import / Export Section */}
              <div className="pt-6 border-t border-neutral-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-neutral-300">Backup &amp; Share Language Packs</span>
                  <button
                    type="button"
                    onClick={handleExport}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export JSON</span>
                  </button>
                </div>

                <div className="space-y-2">
                  <textarea
                    rows={2}
                    value={importJsonText}
                    onChange={e => setImportJsonText(e.target.value)}
                    placeholder="Paste exported language JSON here to import..."
                    className="w-full rounded-lg border border-neutral-800 bg-neutral-950 p-2.5 text-xs text-white placeholder-neutral-600 focus:border-neutral-600 focus:outline-none font-mono"
                  />
                  {importStatus && (
                    <p className="text-xs text-amber-400">{importStatus}</p>
                  )}
                  <button
                    type="button"
                    onClick={handleImportSubmit}
                    disabled={!importJsonText.trim()}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-200 bg-neutral-800 hover:bg-neutral-700 disabled:opacity-40 rounded-lg transition-colors cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Import Translations</span>
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* TAB 3: CUSTOMIZE TRANSLATIONS */}
          {activeTab === 'edit' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h4 className="text-sm font-semibold text-white">
                    Customize Phrases for &ldquo;{activeMeta.name}&rdquo;
                  </h4>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Changes update the application in real time and persist automatically.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => resetLanguageOverrides(currentLanguage)}
                  className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-neutral-400 hover:text-white bg-neutral-800/80 hover:bg-neutral-800 rounded-lg transition-colors"
                  title="Reset custom overrides for this language"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Overrides</span>
                </button>
              </div>

              {/* Search filter input */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none" />
                <input
                  type="text"
                  value={searchFilter}
                  onChange={e => setSearchFilter(e.target.value)}
                  placeholder="Filter phrases (e.g. World Clock, Start, Pomodoro)..."
                  className="w-full rounded-lg border border-neutral-800 bg-neutral-950 pl-9 pr-3.5 py-2 text-xs text-white placeholder-neutral-500 focus:border-neutral-700 focus:outline-none"
                />
              </div>

              {/* Translation entries */}
              <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                {filteredKeys.length === 0 ? (
                  <p className="text-xs text-neutral-500 py-4 text-center">
                    No matching phrase keys found.
                  </p>
                ) : (
                  filteredKeys.map(key => {
                    const defaultVal = BUILTIN_TRANSLATIONS[currentLanguage]?.[key] || BUILTIN_TRANSLATIONS['en'][key] || '';
                    const customVal = customOverrides[currentLanguage]?.[key] || '';
                    const displayVal = customVal !== '' ? customVal : defaultVal;

                    return (
                      <div
                        key={key}
                        className="p-3 rounded-xl border border-neutral-800/90 bg-neutral-950/60 space-y-1.5"
                      >
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-mono text-neutral-500">{key}</span>
                          <span className="text-neutral-500">Default: &ldquo;{defaultVal}&rdquo;</span>
                        </div>

                        <input
                          type="text"
                          value={displayVal}
                          onChange={e => updateTranslation(currentLanguage, key, e.target.value)}
                          className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-xs text-white focus:border-neutral-600 focus:outline-none"
                        />
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-800 bg-neutral-950 flex items-center justify-between text-xs text-neutral-400">
          <span>Active Language: <strong className="text-white">{activeMeta.name}</strong></span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 font-semibold text-neutral-950 bg-white hover:bg-neutral-200 transition-colors rounded-lg shadow-sm cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
