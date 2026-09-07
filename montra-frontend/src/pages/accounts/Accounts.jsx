import React, { useEffect, useState } from 'react';
import { accountsApi } from '../../services/accounts.api';

export const Accounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAccounts = async () => {
      try {
        const data = await accountsApi.getAccounts();

        console.log('Accounts API Response:', data);

        setAccounts(data);
      } catch (error) {
        console.error('Failed to load accounts:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAccounts();
  }, []);

  if (loading) {
    return <div>Loading accounts...</div>;
  }

  return (
    <div>
      <h1>Accounts</h1>

      {accounts.map((account) => (
        <div key={account.id}>
          {account.name}
        </div>
      ))}
    </div>
  );
};