// apps/web/app/form/[id]/page.tsx

"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useParams } from "next/navigation";
import { CheckCircle2, Send } from "lucide-react";

import { useGetFormWithFields } from "~/hooks/api/form";
import { useCreateSubmission } from "~/hooks/api/form-submission";

import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";

export default function PublicFormPage() {
    const params = useParams();
    const formId = params?.id as string | undefined;

    const { form, isLoading } = useGetFormWithFields(formId ?? "");
    const { createSubmissionAsync, status, error } = useCreateSubmission();

    const [values, setValues] = useState<Record<string, string>>({});
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        if (!form?.fields) return;
        const initial: Record<string, string> = {};
        for (const f of form.fields) initial[f.id] = "";
        setValues(initial);
    }, [form?.fields]);

    const handleChange = (fieldId: string, value: string) => {
        setValues((state) => ({ ...state, [fieldId]: value }));
    };

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        if (!formId) return;

        const payload = {
            formId,
            values: Object.entries(values).map(([fieldId, value]) => ({ fieldId, value })),
        };

        await createSubmissionAsync(payload);
        setSubmitted(true);
        setValues((state) => Object.fromEntries(Object.keys(state).map((key) => [key, ""])));
    };

    if (isLoading) {
        return (
            <main className="city-shell flex min-h-screen items-center justify-center p-6 text-white">
                <div className="city-panel animate-city-in rounded-lg p-6 text-sm text-sky-50/75">
                    Loading form...
                </div>
            </main>
        );
    }

    if (!form) {
        return (
            <main className="city-shell flex min-h-screen items-center justify-center p-6 text-white">
                <div className="city-panel animate-city-in rounded-lg p-6 text-sm text-sky-50/75">
                    Form not found.
                </div>
            </main>
        );
    }

    return (
        <main className="city-shell min-h-screen px-6 py-10 text-white">
            <div className="mx-auto max-w-2xl">
                <section className="animate-city-in mb-6">
                    <p className="text-sm font-medium uppercase tracking-[0.18em] text-sky-100/80">
                        Public form
                    </p>
                    <h1 className="mt-2 text-3xl font-semibold tracking-tight">{form.title}</h1>
                    {form.description ? (
                        <p className="mt-3 text-sm leading-6 text-sky-50/75">
                            {form.description}
                        </p>
                    ) : null}
                </section>

                {submitted ? (
                    <div className="city-card animate-city-rise mb-6 flex items-center gap-3 rounded-lg p-4 text-sky-50">
                        <CheckCircle2 className="size-5 text-emerald-300" aria-hidden="true" />
                        Thanks, your submission was received.
                    </div>
                ) : null}

                <form
                    onSubmit={handleSubmit}
                    className="city-panel animate-city-rise space-y-5 rounded-lg p-6"
                >
                    {form.fields.map((field) => (
                        <div key={field.id} className="space-y-1">
                            <label className="block text-sm font-medium text-sky-50">
                                {field.label}
                                {field.isRequired ? (
                                    <span className="ml-1 text-sky-100" aria-label="required">
                                        *
                                    </span>
                                ) : null}
                            </label>

                            {field.type === "TEXT" && (
                                <Input
                                    value={values[field.id] ?? ""}
                                    onChange={(event) =>
                                        handleChange(field.id, event.target.value)
                                    }
                                    placeholder={field.placeholder ?? ""}
                                    required={Boolean(field.isRequired)}
                                    className="city-input"
                                />
                            )}

                            {field.type === "NUMBER" && (
                                <Input
                                    type="number"
                                    value={values[field.id] ?? ""}
                                    onChange={(event) =>
                                        handleChange(field.id, event.target.value)
                                    }
                                    placeholder={field.placeholder ?? ""}
                                    required={Boolean(field.isRequired)}
                                    className="city-input"
                                />
                            )}

                            {field.type === "EMAIL" && (
                                <Input
                                    type="email"
                                    value={values[field.id] ?? ""}
                                    onChange={(event) =>
                                        handleChange(field.id, event.target.value)
                                    }
                                    placeholder={field.placeholder ?? ""}
                                    required={Boolean(field.isRequired)}
                                    className="city-input"
                                />
                            )}

                            {field.type === "PASSWORD" && (
                                <Input
                                    type="password"
                                    value={values[field.id] ?? ""}
                                    onChange={(event) =>
                                        handleChange(field.id, event.target.value)
                                    }
                                    placeholder={field.placeholder ?? ""}
                                    required={Boolean(field.isRequired)}
                                    className="city-input"
                                />
                            )}

                            {field.type === "YES_NO" && (
                                <select
                                    value={values[field.id] ?? ""}
                                    onChange={(event) =>
                                        handleChange(field.id, event.target.value)
                                    }
                                    required={Boolean(field.isRequired)}
                                    className="city-input w-full rounded-md border px-3 py-2 text-sm"
                                >
                                    <option value="">Select...</option>
                                    <option value="true">Yes</option>
                                    <option value="false">No</option>
                                </select>
                            )}

                            {field.description ? (
                                <div className="text-sm text-sky-50/70">{field.description}</div>
                            ) : null}
                        </div>
                    ))}

                    {error ? <div className="text-sm text-red-300">{error.message}</div> : null}

                    <div className="pt-1">
                        <Button
                            type="submit"
                            disabled={status === "pending"}
                            className="city-button w-full sm:w-auto"
                        >
                            <Send className="size-4" aria-hidden="true" />
                            {status === "pending" ? "Submitting..." : "Submit"}
                        </Button>
                    </div>
                </form>
            </div>
        </main>
    );
}
