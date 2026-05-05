import { supabase } from "./supabase";

export type Message = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  read: boolean;
};

type Row = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
  read: boolean;
};

function rowToMessage(row: Row): Message {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    subject: row.subject,
    message: row.message,
    createdAt: row.created_at,
    read: row.read,
  };
}

export async function listMessages(): Promise<Message[]> {
  const { data, error } = await supabase()
    .from("messages")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error("Mesajlar okunamadı: " + error.message);
  return ((data as Row[]) || []).map(rowToMessage);
}

export async function addMessage(
  input: Omit<Message, "id" | "createdAt" | "read">
): Promise<Message> {
  const id =
    Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  const { data, error } = await supabase()
    .from("messages")
    .insert({
      id,
      name: input.name,
      email: input.email,
      subject: input.subject,
      message: input.message,
      read: false,
    })
    .select()
    .single();
  if (error) throw new Error("Mesaj kaydedilemedi: " + error.message);
  return rowToMessage(data as Row);
}

export async function markAsRead(id: string, read: boolean): Promise<void> {
  const { error } = await supabase()
    .from("messages")
    .update({ read })
    .eq("id", id);
  if (error) throw new Error("Güncellenemedi: " + error.message);
}

export async function deleteMessage(id: string): Promise<void> {
  const { error } = await supabase().from("messages").delete().eq("id", id);
  if (error) throw new Error("Silinemedi: " + error.message);
}
