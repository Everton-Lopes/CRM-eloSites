export type TabId = 'dashboard' | 'clientes' | 'financeiro' | 'pipeline';

const TABS: { id: TabId; label: string }[] = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'clientes', label: 'Clientes' },
  { id: 'financeiro', label: 'Financeiro' },
  { id: 'pipeline', label: 'Pipeline' },
];

export function Tabs({
  current,
  onChange,
}: {
  current: TabId;
  onChange: (tab: TabId) => void;
}) {
  return (
    <nav className="mb-5 flex gap-1.5 overflow-x-auto border-b border-edge">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={`whitespace-nowrap border-b-2 bg-transparent px-3.5 py-2.5 text-[13px] font-semibold transition-colors ${
            current === tab.id
              ? 'border-brand text-text'
              : 'border-transparent text-muted hover:text-text'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
}
