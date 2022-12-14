import type { Transaction } from "../types/transaction.types";
import { supabase } from "../utils/supabase.utils";
import { checkUser } from "../utils/request.utils";

export const getTransactions = async (): Promise<Transaction[]> => {
  const user = await checkUser();

  let { data, error, status } = await supabase
    .from("transactions")
    .select("id, transaction_type, amount, description, notes, posted_at")
    .eq("user_id", user.id)
    .is("deleted_at", null)
    .order("posted_at", { ascending: false });

  if (error && status !== 406) throw error;

  if (!data) return [];

  const transactions: Transaction[] = data.map((transaction) => {
    transaction.posted_at = new Date(transaction.posted_at);
    return transaction;
  });

  return transactions;
};

export const getTransaction = async (id: string): Promise<Transaction> => {
  await checkUser();

  let { data, error, status } = await supabase
    .from("transactions")
    .select("transaction_type, amount, description, notes, posted_at")
    .eq("id", id)
    .single();

  if (error && status !== 406) throw error;

  data!.posted_at = new Date(data!.posted_at);

  return data as Transaction;
};

export const createTransaction = async (transaction: Transaction) => {
  const user = await checkUser();

  let { error, status } = await supabase.from("transactions").insert([
    {
      user_id: user.id,
      amount: transaction.amount,
      transaction_type: transaction.transaction_type,
      posted_at: transaction.posted_at,
      description: transaction.description,
      notes: transaction.notes,
    },
  ]);

  if (error && status !== 406) throw error;
};

export const updateTransaction = async (
  id: string,
  transaction: Transaction
) => {
  await checkUser();

  let { error, status } = await supabase
    .from("transactions")
    .update({
      transaction_type: transaction.transaction_type,
      amount: transaction.amount,
      posted_at: transaction.posted_at,
      description: transaction.description,
      notes: transaction.notes,
    })
    .eq("id", id);

  if (error && status !== 406) throw error;
};

export const deleteTransaction = async (id: string) => {
  await checkUser();

  let { error, status } = await supabase
    .from("transactions")
    .update({
      deleted_at: new Date(),
    })
    .eq("id", id);

  if (error && status !== 406) throw error;
};
