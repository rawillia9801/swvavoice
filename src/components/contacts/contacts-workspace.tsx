"use client";

import { FormEvent, KeyboardEvent, useMemo, useState } from "react";
import {
  CalendarClock,
  ChevronDown,
  Clock3,
  Mail,
  MapPin,
  MessageSquare,
  MoreHorizontal,
  Phone,
  Plus,
  Search,
  Star,
  StickyNote,
  User,
  UserPlus,
  X,
} from "lucide-react";
import { CallControlBar } from "@/components/calls/call-control-bar";
import { CallsTopHeader } from "@/components/calls/calls-top-header";
import { Sidebar } from "@/components/layout/sidebar";
import type { Contact, ContactGroup } from "@/lib/contacts/types";

type ContactsWorkspaceProps = {
  initialContacts: Contact[];
};

type ContactFormProps = {
  mode: "add" | "edit";
  contact?: Contact;
  onClose: () => void;
  onSave: (contact: Contact) => void;
};

const groupOptions = ["All Groups", "Customer", "Lead", "Supplier"];
const tagOptions = [
  "All Tags",
  "VIP",
  "Repeat Buyer",
  "New",
  "Pickup",
  "Follow Up",
  "Breeder",
];

const statCards = [
  {
    label: "Total Contacts",
    value: "238",
    caption: "All contacts",
    icon: User,
    className: "border-violet-200 bg-violet-50 text-violet-700",
  },
  {
    label: "Customers",
    value: "142",
    caption: "Active customers",
    icon: UserPlus,
    className: "border-green-200 bg-green-50 text-green-700",
  },
  {
    label: "Favorites",
    value: "32",
    caption: "Starred contacts",
    icon: Star,
    className: "border-amber-200 bg-amber-50 text-amber-600",
  },
  {
    label: "Added This Month",
    value: "18",
    caption: "New contacts",
    icon: Clock3,
    className: "border-blue-200 bg-blue-50 text-blue-700",
  },
];

const contactQuickActions = [
  { label: "Call Contact", icon: Phone, color: "text-green-700" },
  { label: "Send Message", icon: MessageSquare, color: "text-blue-700" },
  { label: "Send Email", icon: Mail, color: "text-violet-700" },
  { label: "Add Note", icon: StickyNote, color: "text-amber-700" },
];

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function badgeClass(value: string) {
  if (value === "VIP" || value === "Repeat Buyer" || value === "Breeder") {
    return "border-amber-200 bg-amber-50 text-amber-700";
  }

  if (value === "Customer") {
    return "border-blue-200 bg-blue-50 text-blue-700";
  }

  if (value === "Lead" || value === "Follow Up" || value === "New") {
    return "border-green-200 bg-green-50 text-green-700";
  }

  return "border-sky-200 bg-sky-50 text-sky-700";
}

function ContactForm({ mode, contact, onClose, onSave }: ContactFormProps) {
  const [name, setName] = useState(contact?.name || "");
  const [phone, setPhone] = useState(contact?.phone || "");
  const [email, setEmail] = useState(contact?.email || "");
  const [group, setGroup] = useState<ContactGroup>(contact?.group || "Customer");
  const [tags, setTags] = useState(contact?.tags.join(", ") || "");
  const [location, setLocation] = useState(contact?.location || "");
  const [notes, setNotes] = useState(contact?.notes || "");

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const now = new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date());

    onSave({
      id: contact?.id || `${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`,
      name,
      phone,
      phoneType: contact?.phoneType || "Mobile",
      email,
      group,
      tags: tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      added: contact?.added || now,
      favorite: contact?.favorite || false,
      location,
      lastInteraction: contact?.lastInteraction || now,
      notes,
    });
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/35 p-4">
      <form
        onSubmit={submit}
        className="w-full max-w-lg rounded-xl border border-slate-200 bg-white p-5 shadow-2xl"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-950">
            {mode === "add" ? "Add Contact" : "Edit Contact"}
          </h2>
          <button type="button" onClick={onClose} className="grid size-9 place-items-center rounded-full hover:bg-slate-100">
            <X className="size-5" aria-hidden="true" />
            <span className="sr-only">Close</span>
          </button>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2">
          <label className="space-y-1">
            <span className="text-sm font-semibold text-slate-700">Name</span>
            <input value={name} onChange={(event) => setName(event.target.value)} required className="h-10 w-full rounded-md border border-slate-200 px-3" />
          </label>
          <label className="space-y-1">
            <span className="text-sm font-semibold text-slate-700">Phone</span>
            <input value={phone} onChange={(event) => setPhone(event.target.value)} required className="h-10 w-full rounded-md border border-slate-200 px-3" />
          </label>
          <label className="space-y-1">
            <span className="text-sm font-semibold text-slate-700">Email</span>
            <input value={email} onChange={(event) => setEmail(event.target.value)} className="h-10 w-full rounded-md border border-slate-200 px-3" />
          </label>
          <label className="space-y-1">
            <span className="text-sm font-semibold text-slate-700">Group</span>
            <select value={group} onChange={(event) => setGroup(event.target.value as ContactGroup)} className="h-10 w-full rounded-md border border-slate-200 px-3">
              <option>Customer</option>
              <option>Lead</option>
              <option>Supplier</option>
            </select>
          </label>
          <label className="space-y-1 md:col-span-2">
            <span className="text-sm font-semibold text-slate-700">Tags</span>
            <input value={tags} onChange={(event) => setTags(event.target.value)} className="h-10 w-full rounded-md border border-slate-200 px-3" placeholder="VIP, Repeat Buyer" />
          </label>
          <label className="space-y-1 md:col-span-2">
            <span className="text-sm font-semibold text-slate-700">Location</span>
            <input value={location} onChange={(event) => setLocation(event.target.value)} className="h-10 w-full rounded-md border border-slate-200 px-3" />
          </label>
          <label className="space-y-1 md:col-span-2">
            <span className="text-sm font-semibold text-slate-700">Notes</span>
            <textarea value={notes} onChange={(event) => setNotes(event.target.value)} className="min-h-24 w-full rounded-md border border-slate-200 p-3" />
          </label>
        </div>

        <div className="mt-5 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="rounded-md border border-slate-200 px-4 py-2 text-sm font-semibold">
            Cancel
          </button>
          <button type="submit" className="rounded-md bg-violet-600 px-4 py-2 text-sm font-semibold text-white">
            Save
          </button>
        </div>
      </form>
    </div>
  );
}

export function ContactsWorkspace({ initialContacts }: ContactsWorkspaceProps) {
  const [contacts, setContacts] = useState(initialContacts);
  const [selectedId, setSelectedId] = useState(initialContacts[0]?.id || "");
  const [search, setSearch] = useState("");
  const [contactSearch, setContactSearch] = useState("");
  const [groupFilter, setGroupFilter] = useState("All Groups");
  const [tagFilter, setTagFilter] = useState("All Tags");
  const [filterOpen, setFilterOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit" | null>(null);
  const [quickNotice, setQuickNotice] = useState<string | null>(null);

  const selected = contacts.find((contact) => contact.id === selectedId) || contacts[0];
  const filtered = useMemo(() => {
    const query = contactSearch.trim().toLowerCase();
    return contacts.filter((contact) => {
      const matchesSearch =
        !query ||
        contact.name.toLowerCase().includes(query) ||
        contact.phone.toLowerCase().includes(query) ||
        contact.email.toLowerCase().includes(query);
      const matchesGroup = groupFilter === "All Groups" || contact.group === groupFilter;
      const matchesTag = tagFilter === "All Tags" || contact.tags.includes(tagFilter);

      return matchesSearch && matchesGroup && matchesTag;
    });
  }, [contactSearch, contacts, groupFilter, tagFilter]);

  const saveContact = (contact: Contact) => {
    setContacts((current) => {
      const exists = current.some((item) => item.id === contact.id);
      return exists
        ? current.map((item) => (item.id === contact.id ? contact : item))
        : [contact, ...current];
    });
    setSelectedId(contact.id);
    setModalMode(null);
  };

  const toggleFavorite = (id: string) => {
    setContacts((current) =>
      current.map((contact) =>
        contact.id === id ? { ...contact, favorite: !contact.favorite } : contact,
      ),
    );
  };

  const selectContactFromKeyboard = (event: KeyboardEvent<HTMLDivElement>, id: string) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setSelectedId(id);
    }
  };

  return (
    <main className="min-h-screen bg-[#f7f8fc] text-slate-950">
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <CallsTopHeader searchValue={search} onSearchChange={setSearch} />
          <div className="flex-1 px-7 py-7 pb-6">
            <div className="mx-auto grid max-w-[1280px] gap-6 xl:grid-cols-[1fr_286px]">
              <section className="min-w-0">
                <h1 className="text-3xl font-bold tracking-tight">Contacts</h1>
                <p className="mt-2 text-sm text-slate-600">View and manage all your saved contacts.</p>

                <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  {statCards.map((card) => {
                    const Icon = card.icon;
                    return (
                      <article key={card.label} className={`rounded-lg border p-5 shadow-sm ${card.className}`}>
                        <div className="flex items-center gap-4">
                          <Icon className="size-8 shrink-0" aria-hidden="true" />
                          <div>
                            <p className="text-sm font-medium text-slate-700">{card.label}</p>
                            <p className="mt-1 text-2xl font-bold text-slate-950">{card.value}</p>
                            <p className="mt-1 text-sm text-slate-600">{card.caption}</p>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <label className="relative min-w-[320px] flex-1">
                    <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
                    <input
                      value={contactSearch}
                      onChange={(event) => setContactSearch(event.target.value)}
                      className="h-11 w-full rounded-md border border-slate-200 bg-white pl-11 pr-4 text-sm shadow-sm outline-none focus:border-violet-300"
                      placeholder="Search contacts by name, phone, or email..."
                    />
                  </label>
                  <select value={groupFilter} onChange={(event) => setGroupFilter(event.target.value)} className="h-11 rounded-md border border-slate-200 bg-white px-4 text-sm font-semibold shadow-sm">
                    {groupOptions.map((option) => <option key={option}>{option}</option>)}
                  </select>
                  <select value={tagFilter} onChange={(event) => setTagFilter(event.target.value)} className="h-11 rounded-md border border-slate-200 bg-white px-4 text-sm font-semibold shadow-sm">
                    {tagOptions.map((option) => <option key={option}>{option}</option>)}
                  </select>
                  <button type="button" onClick={() => setFilterOpen((value) => !value)} className="inline-flex h-11 items-center gap-2 rounded-md border border-slate-200 bg-white px-4 text-sm font-semibold shadow-sm">
                    <ChevronDown className="size-4" aria-hidden="true" />
                    Filters
                  </button>
                  <button type="button" onClick={() => setModalMode("add")} className="inline-flex h-11 items-center gap-2 rounded-md bg-violet-600 px-5 text-sm font-semibold text-white shadow-sm">
                    <Plus className="size-4" aria-hidden="true" />
                    Add Contact
                  </button>
                </div>

                {filterOpen ? (
                  <div className="mt-3 rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-600 shadow-sm">
                    Filters are available through the All Groups and All Tags dropdowns.
                  </div>
                ) : null}

                <section className="mt-5 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
                  <div className="grid grid-cols-[52px_1.35fr_1.25fr_1.5fr_0.8fr_1fr_0.9fr_64px] px-5 py-4 text-xs font-semibold text-slate-500">
                    {["Favorite", "Name", "Phone", "Email", "Group", "Tags", "Added", "Actions"].map((column) => <span key={column}>{column}</span>)}
                  </div>
                  {filtered.map((contact) => (
                    <div
                      key={contact.id}
                      onClick={() => setSelectedId(contact.id)}
                      onKeyDown={(event) => selectContactFromKeyboard(event, contact.id)}
                      role="button"
                      tabIndex={0}
                      className={`grid min-h-16 w-full grid-cols-[52px_1.35fr_1.25fr_1.5fr_0.8fr_1fr_0.9fr_64px] items-center border-t border-slate-100 px-5 text-left text-sm outline-none hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-violet-300 ${selected?.id === contact.id ? "bg-violet-50/35" : "bg-white"}`}
                    >
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          toggleFavorite(contact.id);
                        }}
                        className="grid size-8 place-items-center rounded-full text-slate-400 transition hover:bg-amber-50 hover:text-amber-500"
                        aria-label={`${contact.favorite ? "Remove" : "Add"} ${contact.name} as favorite`}
                      >
                        <Star className={`size-4 ${contact.favorite ? "fill-amber-400 text-amber-400" : ""}`} aria-hidden="true" />
                      </button>
                      <span className="flex items-center gap-3 font-semibold">
                        <span className="grid size-9 place-items-center rounded-full bg-blue-50 text-blue-700">{initials(contact.name)}</span>
                        {contact.name}
                      </span>
                      <span>
                        <span className="flex items-center gap-2"><Phone className="size-4 text-green-600" aria-hidden="true" />{contact.phone}</span>
                        <span className="ml-6 text-xs text-slate-500">{contact.phoneType}</span>
                      </span>
                      <span className="truncate text-slate-600">{contact.email}</span>
                      <span><span className={`rounded-full border px-2 py-1 text-xs font-semibold ${badgeClass(contact.group)}`}>{contact.group}</span></span>
                      <span className="flex flex-wrap gap-1">
                        {contact.tags.map((tag) => <span key={tag} className={`rounded-full border px-2 py-1 text-xs font-semibold ${badgeClass(tag)}`}>{tag}</span>)}
                      </span>
                      <span className="text-slate-600">{contact.added}</span>
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          setQuickNotice("Contact row actions are ready for future CRM integration.");
                        }}
                        className="grid size-9 place-items-center rounded-md border border-slate-200 text-slate-600 transition hover:bg-slate-50"
                        aria-label={`Open actions for ${contact.name}`}
                      >
                        <MoreHorizontal className="size-4" aria-hidden="true" />
                      </button>
                    </div>
                  ))}
                  <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-5 py-4 text-sm text-slate-600">
                    <span>Showing 1 to 6 of 238 contacts</span>
                    <div className="flex items-center gap-2">
                      {["Previous", "1", "2", "3", "4", "5", "...", "40", "Next"].map((item) => (
                        <button key={item} type="button" className={`rounded-md px-3 py-2 ${item === "1" ? "bg-violet-600 text-white" : "text-slate-700"}`}>{item}</button>
                      ))}
                    </div>
                    <select className="h-10 rounded-md border border-slate-200 bg-white px-3">
                      <option>10 per page</option>
                    </select>
                  </footer>
                </section>
              </section>

              {selected ? (
                <aside className="space-y-5">
                  <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                      <h2 className="text-base font-semibold">Contact Details</h2>
                      <button type="button" onClick={() => setModalMode("edit")} className="rounded-md bg-slate-100 px-3 py-1.5 text-sm font-semibold">Edit</button>
                    </div>
                    <div className="mt-5 flex items-center gap-4">
                      <div className="grid size-16 place-items-center rounded-full bg-violet-100 text-xl font-bold text-violet-700">{initials(selected.name)}</div>
                      <div>
                        <h3 className="text-xl font-bold">{selected.name}</h3>
                        <div className="mt-2 flex gap-2">
                          {["VIP", selected.group].filter((tag) => selected.tags.includes(tag) || tag === selected.group).map((tag) => (
                            <span key={tag} className={`rounded-full border px-2 py-1 text-xs font-semibold ${badgeClass(tag)}`}>{tag}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <dl className="mt-5 space-y-4 text-sm">
                      <div className="flex gap-3"><Phone className="size-5 text-green-600" /><div><dt>{selected.phone}</dt><dd className="text-slate-500">{selected.phoneType}</dd></div></div>
                      <div className="flex gap-3"><Mail className="size-5 text-green-600" /><dd>{selected.email}</dd></div>
                      <div className="flex gap-3"><MapPin className="size-5 text-green-600" /><dd>{selected.location}</dd></div>
                      <div className="flex gap-3"><CalendarClock className="size-5 text-green-600" /><dd>Added: {selected.added}</dd></div>
                      <div className="flex gap-3"><Clock3 className="size-5 text-green-600" /><dd>{selected.lastInteraction}</dd></div>
                      <div className="flex gap-3"><StickyNote className="size-5 text-green-600" /><dd>{selected.notes}</dd></div>
                    </dl>
                  </section>
                  <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                    <h2 className="text-base font-semibold">Quick Actions</h2>
                    <div className="mt-4 space-y-2">
                      {contactQuickActions.map(({ label, icon: Icon, color }) => (
                        <button key={label} type="button" onClick={() => setQuickNotice(`${label} is ready for future Twilio/message/email integration.`)} className="flex h-10 w-full items-center gap-3 rounded-md border border-slate-200 px-3 text-sm font-semibold shadow-sm">
                          <Icon className={`size-4 ${color}`} aria-hidden="true" />
                          {label}
                        </button>
                      ))}
                    </div>
                  </section>
                </aside>
              ) : null}
            </div>
          </div>
          <CallControlBar />
        </div>
      </div>
      {modalMode ? (
        <ContactForm
          mode={modalMode}
          contact={modalMode === "edit" ? selected : undefined}
          onClose={() => setModalMode(null)}
          onSave={saveContact}
        />
      ) : null}
      {quickNotice ? (
        <div className="fixed bottom-24 right-6 z-50 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800 shadow-lg">
          {quickNotice}
          <button type="button" onClick={() => setQuickNotice(null)} className="ml-4 font-bold">Close</button>
        </div>
      ) : null}
    </main>
  );
}
