import { useEffect } from 'react';
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import { doc, onSnapshot, collection, query, where, orderBy } from 'firebase/firestore';
import { auth, db } from './firebase';
import { useStore, User, Goal, Transaction, Account } from './store/useStore';

export function useFirebaseSync() {
  const { setUser, setGoals, setTransactions, setAccounts, setScreen } = useStore();

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in
        console.log('User signed in:', firebaseUser.uid);
        
        // Sync User Profile
        const unsubscribeUser = onSnapshot(doc(db, 'users', firebaseUser.uid), (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            setUser({
              id: firebaseUser.uid,
              name: data.name || 'Utilisateur',
              phone: data.phone || '',
              email: firebaseUser.email || data.email || '',
              operator: data.operator || 'Orange',
              savingsMode: data.savingsMode || 'roundup',
              savingsValue: data.savingsValue || 0,
              balance: {
                total: data.balance?.total || 0,
                savings: data.balance?.savings || 0,
                available: data.balance?.available || 0
              },
              memberSince: data.createdAt?.toDate?.()?.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }) || 'Récemment',
              isPremium: data.isPremium || false
            });
            // If user has a profile, go to main
            setScreen('main');
          }
        }, (error) => {
          console.error('Error syncing user:', error);
        });

        // Sync Goals
        const goalsQuery = query(collection(db, 'goals'), where('userId', '==', firebaseUser.uid));
        const unsubscribeGoals = onSnapshot(goalsQuery, (querySnap) => {
          const goals: Goal[] = [];
          querySnap.forEach((doc) => {
            const data = doc.data();
            goals.push({
              id: doc.id,
              title: data.title,
              targetAmount: data.targetAmount,
              currentAmount: data.currentAmount,
              deadline: data.deadline?.toDate?.()?.toISOString() || data.deadline,
              icon: data.category || 'target'
            });
          });
          setGoals(goals);
        });

        // Sync Transactions
        const txQuery = query(
          collection(db, 'transactions'), 
          where('userId', '==', firebaseUser.uid),
          orderBy('timestamp', 'desc')
        );
        const unsubscribeTx = onSnapshot(txQuery, (querySnap) => {
          const txs: Transaction[] = [];
          querySnap.forEach((doc) => {
            const data = doc.data();
            txs.push({
              id: doc.id,
              amount: data.amount,
              type: data.type as any,
              date: data.timestamp?.toDate?.()?.toISOString() || data.timestamp,
              description: `${data.type === 'deposit' ? 'Épargne' : 'Retrait'} - ${data.operator || 'Système'}`
            });
          });
          setTransactions(txs);
        });

        return () => {
          unsubscribeUser();
          unsubscribeGoals();
          unsubscribeTx();
        };
      } else {
        // User is signed out
        setUser(null);
        setGoals([]);
        setTransactions([]);
        setAccounts([]);
      }
    });

    return () => unsubscribeAuth();
  }, [setUser, setGoals, setTransactions, setAccounts, setScreen]);
}
