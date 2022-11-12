import type { Transaction } from "../types/transaction.types";
import { supabase } from "../utils/supabase.utils";
import { checkUser } from "../utils/request.utils";

export const getTransactions = async (): Promise<Transaction[]> => {
  const user = checkUser();

  let { data, error, status } = await supabase
    .from("transactions")
    .select("id, transaction_type, amount, description, notes, posted_at")
    .eq("user_id", user.id)
    .order("posted_at", { ascending: false });

  if (error && status !== 406) throw error;

  return data as Transaction[];
};

export const getTransaction = async (id: string): Promise<Transaction> => {
  checkUser();

  let { data, error, status } = await supabase
    .from("transactions")
    .select("transaction_type, amount, description, notes, posted_at")
    .eq("id", id)
    .single();

  if (error && status !== 406) throw error;

  return data as Transaction;
};

export const createTransaction = async (transaction: Transaction) => {
  const user = checkUser();

  let { error, status } = await supabase.from("transactions").insert([
    {
      user_id: user.id,
      transaction_type: transaction.transaction_type,
      amount: transaction.amount,
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
  checkUser();

  let { error, status } = await supabase
    .from("transactions")
    .update({
      transaction_type: transaction.transaction_type,
      amount: transaction.amount,
      description: transaction.description,
      notes: transaction.notes,
    })
    .eq("id", id);

  if (error && status !== 406) throw error;
};
