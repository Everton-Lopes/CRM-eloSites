import { useEffect, useState } from 'react';

export type SyncKind = 'online' | 'offline' | 'syncing';

export interface SyncStatus {
  kind: SyncKind;
  label: string;
}

const LABELS: Record<SyncKind, string> = {
  online: 'Online — sincronizado',
  offline: 'Offline — salvando localmente',
  syncing: 'Sincronizando…',
};

export function useSyncStatus(pendingWrites: boolean, fromCache: boolean): SyncStatus {
  const [online, setOnline] = useState(
    typeof navigator === 'undefined' ? true : navigator.onLine,
  );
  const [everSynced, setEverSynced] = useState(false);

  useEffect(() => {
    const goOnline = () => setOnline(true);
    const goOffline = () => setOnline(false);
    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);
    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  useEffect(() => {
    if (!fromCache) setEverSynced(true);
  }, [fromCache]);

  let kind: SyncKind;
  if (!online) {
    kind = 'offline';
  } else if (pendingWrites || !everSynced) {
    kind = 'syncing';
  } else {
    kind = 'online';
  }

  return { kind, label: LABELS[kind] };
}
