"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { ClipboardList, Eye, FilePlus, PencilLine, Plus } from "lucide-react";

import { useCreateForm, useListForms } from "~/hooks/api/form";

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

export default function DashboardForms() {
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const { createFormAsync, error, status } = useCreateForm();
    const { forms, isLoading } = useListForms();

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        await createFormAsync({
            title: title.trim(),
            description: description.trim() ? description.trim() : undefined,
        });

        setOpen(false);
        setTitle("");
        setDescription("");
    };

    return (
        <main className="city-shell min-h-screen px-6 py-8 text-white">
            <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
                <div className="animate-city-in flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm font-medium uppercase tracking-[0.18em] text-sky-100/80">
                            Forms
                        </p>
                        <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
                        <p className="mt-2 max-w-xl text-sm leading-6 text-sky-50/75">
                            Manage your form lineup, inspect submissions, and edit fields from one
                            clean workspace.
                        </p>
                    </div>

                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button className="city-button w-full sm:w-auto">
                                <Plus className="size-4" aria-hidden="true" />
                                Create Form
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="city-panel text-white sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>Create Form</DialogTitle>
                                <DialogDescription className="text-sky-50/70">
                                    Add a title and optional description.
                                </DialogDescription>
                            </DialogHeader>

                            <form className="space-y-4" onSubmit={handleSubmit}>
                                <div className="space-y-2">
                                    <label htmlFor="title" className="text-sm text-sky-50">
                                        Title
                                    </label>
                                    <Input
                                        id="title"
                                        value={title}
                                        onChange={(event) => setTitle(event.target.value)}
                                        placeholder="Form title"
                                        className="city-input"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="description" className="text-sm text-sky-50">
                                        Description
                                    </label>
                                    <Textarea
                                        id="description"
                                        value={description}
                                        onChange={(event) => setDescription(event.target.value)}
                                        placeholder="Optional description"
                                        className="city-input min-h-24"
                                    />
                                </div>

                                {error ? (
                                    <p className="text-sm text-red-400">{error.message}</p>
                                ) : null}

                                <DialogFooter>
                                    <Button
                                        type="submit"
                                        disabled={status === "pending" || title.trim().length === 0}
                                        className="city-button"
                                    >
                                        <FilePlus className="size-4" aria-hidden="true" />
                                        {status === "pending" ? "Creating..." : "Create"}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <section className="grid gap-3">
                    {isLoading ? (
                        <div className="city-card animate-city-rise rounded-lg p-6 text-sm text-sky-50/70">
                            Loading forms...
                        </div>
                    ) : forms && forms.length > 0 ? (
                        forms.map((form) => (
                            <article
                                key={form.id}
                                className="city-card animate-city-rise rounded-lg p-5"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="space-y-1">
                                        <h2 className="text-base font-semibold text-white">
                                            {form.title}
                                        </h2>
                                        <p className="text-sm leading-6 text-sky-50/70">
                                            {form.description || "No description"}
                                        </p>
                                        <span className="block text-xs text-sky-100/55">
                                            {form.createdAt
                                                ? new Date(form.createdAt).toLocaleDateString()
                                                : ""}
                                        </span>
                                    </div>

                                    <div className="flex shrink-0 items-center gap-2">
                                        <Button
                                            asChild
                                            variant="outline"
                                            size="icon"
                                            className="city-outline-button"
                                        >
                                            <Link
                                                href={`/form/${form.id}/submissions`}
                                                aria-label="View submissions"
                                            >
                                                <Eye className="size-4" />
                                            </Link>
                                        </Button>

                                        <Button
                                            asChild
                                            variant="outline"
                                            size="icon"
                                            className="city-outline-button"
                                        >
                                            <Link
                                                href={`/dashboard/forms/${form.id}`}
                                                aria-label="Edit form"
                                            >
                                                <PencilLine className="size-4" />
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            </article>
                        ))
                    ) : (
                        <div className="city-card animate-city-rise rounded-lg p-8 text-center text-sm text-sky-50/75">
                            <ClipboardList className="mx-auto mb-3 size-8 text-sky-100" aria-hidden="true" />
                            No forms yet.
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}
