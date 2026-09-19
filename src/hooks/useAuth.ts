import { useCallback, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from 'firebase/auth';
import { auth } from '../firebase';

function translateAuthError(code: string): string {
  switch (code) {
    case 'auth/invalid-email':
      return 'E-mail inválido.';
    case 'auth/user-disabled':
      return 'Este usuário foi desativado.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'E-mail ou senha incorretos.';
    case 'auth/too-many-requests':
      return 'Muitas tentativas. Tente novamente em alguns minutos.';
    case 'auth/network-request-failed':
      return 'Sem conexão. Verifique sua internet e tente novamente.';
    default:
      return 'Não foi possível entrar. Verifique seus dados e tente novamente.';
  }
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      return { ok: true as const };
    } catch (err) {
      const code = (err as { code?: string })?.code ?? '';
      return { ok: false as const, error: translateAuthError(code) };
    }
  }, []);

  const logout = useCallback(async () => {
    await signOut(auth);
  }, []);

  return { user, loading, login, logout };
}
