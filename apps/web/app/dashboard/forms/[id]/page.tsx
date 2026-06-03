// apps/web/app/dashboard/forms/[id]/page.tsx

"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Eye, Plus, Rows3 } from "lucide-react";

import { useCreateField, useGetFields } from "~/hooks/api/form-field";

import { Button } from "~/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Checkbox } from "~/components/ui/checkbox";

export default function FormBuilder() {
    const params = useParams();
    const formId = params?.id as string | undefined;

    const [open, setOpen] = useState(false);
    const [label, setLabel] = useState("");
    const [type, setType] = useState<"TEXT" | "NUMBER" | "EMAIL" | "YES_NO" | "PASSWORD">("TEXT");
    const [description, setDescription] = useState("");
    const [placeholder, setPlaceholder] = useState("");
    const [isRequired, setIsRequired] = useState(false);

    const { createFieldAsync, status, error } = useCreateField(formId ?? "");
    const { fields, isLoading: fieldsLoading } = useGetFields(formId ?? "");

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!formId) return;

        await createFieldAsync({
            label: label.trim(),
            type,
            formId,
            description: description.trim() ? description.trim() : undefined,
            placeholder: placeholder.trim() ? placeholder.trim() : undefined,
            isRequired,
        });

        setOpen(false);
        setLabel("");
        setType("TEXT");
        setDescription("");
        setPlaceholder("");
        setIsRequired(false);
    };

    return (
        <main className="city-shell min-h-screen px-6 py-8 text-white">
            <div className="mx-auto max-w-4xl">
                <div className="animate-city-in mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm font-medium uppercase tracking-[0.18em] text-sky-100/80">
                            Builder
                        </p>
                        <h1 className="text-3xl font-semibold tracking-tight">Form Builder</h1>
                        <p className="mt-2 text-sm leading-6 text-sky-50/75">
                            Arrange the fields your responders will see on the public form.
                        </p>
                    </div>

                    <div className="flex flex-col gap-2 sm:flex-row">
                        {formId ? (
                            <Button asChild variant="outline" className="city-outline-button">
                                <Link href={`/form/${formId}`}>
                                    <Eye className="size-4" aria-hidden="true" />
                                    Open form
                                </Link>
                            </Button>
                        ) : null}

                        <Dialog open={open} onOpenChange={setOpen}>
                            <DialogTrigger asChild>
                                <Button className="city-button">
                                    <Plus className="size-4" aria-hidden="true" />
                                    Create Field
                                </Button>
                            </DialogTrigger>

                        <DialogContent className="city-panel text-white sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>Create Field</DialogTitle>
                                <DialogDescription className="text-sky-50/70">
                                    Add a field to this form.
                                </DialogDescription>
                            </DialogHeader>

                            <form className="space-y-4" onSubmit={handleSubmit}>
                                <div>
                                    <label className="mb-1 block text-sm text-sky-50">
                                        Label
                                    </label>
                                    <Input
                                        value={label}
                                        onChange={(e) => setLabel(e.target.value)}
                                        placeholder="Field label"
                                        className="city-input"
                                    />
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm text-sky-50">Type</label>
                                    <select
                                        value={type}
                                        onChange={(e) =>
                                            setType(
                                                e.target.value as
                                                    | "TEXT"
                                                    | "NUMBER"
                                                    | "EMAIL"
                                                    | "YES_NO"
                                                    | "PASSWORD",
                                            )
                                        }
                                        className="city-input w-full rounded-md border px-3 py-2 text-sm"
                                    >
                                        <option value="TEXT">Text</option>
                                        <option value="NUMBER">Number</option>
                                        <option value="EMAIL">Email</option>
                                        <option value="YES_NO">Yes / No</option>
                                        <option value="PASSWORD">Password</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm text-sky-50">
                                        Description
                                    </label>
                                    <Textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="Optional helper text"
                                        className="city-input"
                                    />
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm text-sky-50">
                                        Placeholder
                                    </label>
                                    <Input
                                        value={placeholder}
                                        onChange={(e) => setPlaceholder(e.target.value)}
                                        placeholder="Optional placeholder"
                                        className="city-input"
                                    />
                                </div>

                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        checked={isRequired}
                                        onCheckedChange={(v) => setIsRequired(Boolean(v))}
                                    />
                                    <span className="text-sm text-sky-50/80">Required</span>
                                </div>

                                {error ? (
                                    <p className="text-sm text-red-400">{error.message}</p>
                                ) : null}

                                <DialogFooter>
                                    <Button
                                        type="submit"
                                        disabled={status === "pending" || !label.trim()}
                                        className="city-button"
                                    >
                                        <Plus className="size-4" aria-hidden="true" />
                                        {status === "pending" ? "Creating..." : "Create Field"}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                        </Dialog>
                    </div>
                </div>

                <section className="grid gap-3">
                    <div className="city-panel animate-city-rise rounded-lg p-6 text-sm text-sky-50/75">
                        <div className="flex items-center gap-3">
                            <Rows3 className="size-5 text-sky-100" aria-hidden="true" />
                            Form canvas
                        </div>
                    </div>

                    {fieldsLoading ? (
                        <div className="city-card rounded-lg p-4 text-sm text-sky-50/70">
                            Loading fields...
                        </div>
                    ) : fields && fields.length > 0 ? (
                        fields.map((f) => (
                            <div
                                key={f.id}
                                className="city-card flex items-center justify-between rounded-lg p-4"
                            >
                                <div>
                                    <div className="font-semibold text-white">{f.label}</div>
                                    <div className="text-sm text-sky-50/70">
                                        {f.description || f.placeholder || ""}
                                    </div>
                                </div>

                                <div className="rounded-full border border-sky-100/25 bg-sky-100/10 px-3 py-1 text-xs font-medium text-sky-50">
                                    {f.type}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="city-card rounded-lg p-4 text-sm text-sky-50/75">
                            No fields yet.
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}
