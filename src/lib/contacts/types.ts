export type ContactGroup = "Customer" | "Lead" | "Supplier";

export type Contact = {
  id: string;
  name: string;
  phone: string;
  phoneType: string;
  email: string;
  group: ContactGroup;
  tags: string[];
  added: string;
  favorite: boolean;
  location: string;
  lastInteraction: string;
  notes: string;
};
