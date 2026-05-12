import { Check, ExternalLink, Loader2, Plus, ShieldCheck, X } from 'lucide-react';
import { INTEGRATIONS, type Integration } from '../data/integrations';
import { useState } from 'react';
import { useApp } from '../store';

type DialogStep = 'consent' | 'authorizing' | 'success';

export function IntegrationsPanel() {
  const { integrationStatus, setIntegrationStatus } = useApp();
  const [active, setActive] = useState<Integration | null>(null);
  const [step, setStep] = useState<DialogStep>('consent');

  const openConnect = (it: Integration) => {
    setActive(it);
    setStep('consent');
  };

  const authorize = () => {
    if (!active) return;
    setStep('authorizing');
    // Simulate redirect → token exchange
    setTimeout(() => {
      setStep('success');
      setIntegrationStatus(active.id, 'connected');
    }, 1200);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3">
      <div className="text-xs text-slate-500 leading-relaxed mb-1">
        Connect your stack to enrich LP records and surface warm intros automatically.
        OAuth flows are stubbed — no live API calls yet.
      </div>
      {INTEGRATIONS.map((it) => {
        const status = integrationStatus[it.id] ?? it.status;
        const isConnected = status === 'connected';
        return (
          <div key={it.id} className="panel p-3">
            <div className="flex items-start gap-3">
              <div className={`w-9 h-9 rounded-md grid place-items-center font-bold text-sm ${it.bg} ${it.color}`}>
                {it.name.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <div className="font-medium text-slate-900 text-sm truncate">{it.name}</div>
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">
                    {it.category}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">{it.description}</p>
                <div className="mt-2.5 flex items-center justify-between">
                  {isConnected ? (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700">
                      <Check size={12} /> Connected
                    </span>
                  ) : (
                    <span className="text-xs text-slate-500">Not connected</span>
                  )}
                  {isConnected ? (
                    <button
                      onClick={() => setIntegrationStatus(it.id, 'available')}
                      className="text-xs px-2.5 h-7 rounded-md text-slate-700 border border-slate-200 hover:bg-slate-50 font-medium"
                    >
                      Disconnect
                    </button>
                  ) : (
                    <button
                      onClick={() => openConnect(it)}
                      className="text-xs px-2.5 h-7 rounded-md bg-brand-600 text-white hover:bg-brand-700 font-medium inline-flex items-center gap-1"
                    >
                      <Plus size={12} /> Connect
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {active && (
        <OAuthDialog
          integration={active}
          step={step}
          onAuthorize={authorize}
          onClose={() => setActive(null)}
        />
      )}
    </div>
  );
}

function OAuthDialog({
  integration,
  step,
  onAuthorize,
  onClose,
}: {
  integration: Integration;
  step: DialogStep;
  onAuthorize: () => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-40 bg-slate-900/30 grid place-items-center" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-lg shadow-xl border border-slate-200 w-[460px]"
      >
        <div className="flex items-center justify-between px-5 h-12 border-b border-slate-100">
          <div className="text-sm font-semibold text-slate-900">
            Connect {integration.name}
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-slate-100 text-slate-500">
            <X size={14} />
          </button>
        </div>
        <div className="p-5">
          {step === 'consent' && (
            <>
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-md grid place-items-center font-bold ${integration.bg} ${integration.color}`}>
                  {integration.name.charAt(0)}
                </div>
                <ExternalLink size={14} className="text-slate-400" />
                <div className="w-10 h-10 rounded-md bg-brand-50 text-brand-700 grid place-items-center font-bold">IR</div>
              </div>
              <div className="text-sm text-slate-700 mb-3">
                <span className="font-medium">{integration.name}</span> will share the following with IR Prospect:
              </div>
              <ul className="space-y-2 text-sm text-slate-600 mb-5">
                {(integration.id === 'outlook'
                  ? ['Read calendar history for warm-intro detection', 'Read sent/received email metadata (no body content)', 'Read contact list']
                  : integration.id === 'salesforce'
                  ? ['Read Account & Contact records', 'Read Opportunity history', 'Read Activity timeline']
                  : integration.id === 'iconnections'
                  ? ['Read your registered events', 'Read meeting requests and acceptances', 'Read attendee directory']
                  : ['Read private wealth records (FINTRX dataset)', 'Read firm AUM and allocation history']
                ).map((s) => (
                  <li key={s} className="flex items-start gap-2">
                    <Check size={14} className="text-emerald-600 mt-0.5 shrink-0" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
              <div className="flex items-center gap-2 text-[11px] text-slate-500 bg-slate-50 border border-slate-200 rounded-md px-3 py-2 mb-4">
                <ShieldCheck size={14} className="text-slate-400 shrink-0" />
                <span>
                  This is a stub. No live OAuth handshake or API calls are made — the integration will be marked as connected for demo purposes only.
                </span>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={onClose}
                  className="text-sm text-slate-600 px-3 h-9 rounded-md hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  onClick={onAuthorize}
                  className="text-sm bg-brand-600 text-white hover:bg-brand-700 px-3 h-9 rounded-md font-medium"
                >
                  Authorize
                </button>
              </div>
            </>
          )}
          {step === 'authorizing' && (
            <div className="py-8 flex flex-col items-center text-center">
              <Loader2 size={28} className="text-brand-600 animate-spin mb-3" />
              <div className="text-sm text-slate-700 font-medium">Redirecting to {integration.name}…</div>
              <div className="text-xs text-slate-500 mt-1">Exchanging authorization code…</div>
            </div>
          )}
          {step === 'success' && (
            <div className="py-6 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 grid place-items-center mb-3">
                <Check size={22} />
              </div>
              <div className="text-sm text-slate-900 font-semibold">{integration.name} connected</div>
              <div className="text-xs text-slate-500 mt-1 max-w-[320px]">
                Sync will run nightly. You can disconnect at any time from this panel.
              </div>
              <button
                onClick={onClose}
                className="mt-5 text-sm bg-brand-600 text-white hover:bg-brand-700 px-4 h-9 rounded-md font-medium"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
