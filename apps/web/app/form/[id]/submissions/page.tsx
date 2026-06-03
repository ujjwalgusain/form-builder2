// apps/web/app/form/[id]/submissions/page.tsx

"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import { ClipboardList, Database } from "lucide-react";

import { useGetSubmissionsByFormId } from "~/hooks/api/form-submission";
import { useGetFields } from "~/hooks/api/form-field";

type Submission = {
    id: string;
    formId?: string | null;
    values?: { fieldId: string; value: string }[] | null;
    createdAt?: string | null;
    updatedAt?: string | null;
};

export default function FormSubmissions() {
    const params = useParams();
    const formId = params?.id as string | undefined;

    const { submissions, isLoading: subsLoading, error } = useGetSubmissionsByFormId(formId ?? "");
    const { fields, isLoading: fieldsLoading } = useGetFields(formId ?? "");

    const rows = useMemo(() => (submissions ?? []) as Submission[], [submissions]);
    const sortedFields = useMemo(
        () => (fields ?? []).slice().sort((a, b) => parseFloat(a.index) - parseFloat(b.index)),
        [fields],
    );

    const loading = subsLoading || fieldsLoading;

    if (loading) {
        return (
            <main className="city-shell flex min-h-screen items-center justify-center p-6 text-white">
                <div className="city-panel animate-city-in rounded-lg p-6 text-sm text-sky-50/75">
                    Loading submissions...
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="city-shell flex min-h-screen items-center justify-center p-6 text-white">
                <div className="city-panel animate-city-in rounded-lg p-6 text-sm text-red-300">
                    Error loading submissions.
                </div>
            </main>
        );
    }

    return (
        <main className="city-shell min-h-screen p-6 text-white">
            <div className="mx-auto max-w-6xl">
                <section className="animate-city-in mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-sm font-medium uppercase tracking-[0.18em] text-sky-100/80">
                            Match report
                        </p>
                        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
                            Submissions
                        </h1>
                        <p className="mt-2 text-sm leading-6 text-sky-50/75">
                            Review responses in field order, with newest database records available
                            at a glance.
                        </p>
                    </div>

                    <div className="city-panel rounded-lg px-4 py-3 text-sm">
                        Total: <span className="font-semibold text-sky-100">{rows.length}</span>
                    </div>
                </section>

                {sortedFields.length > 0 ? (
                    <div className="city-card animate-city-rise mb-4 rounded-lg p-4 text-xs text-sky-50/75">
                        Fields: {sortedFields.map((field) => field.label).join(", ")}
                    </div>
                ) : null}

                {rows.length === 0 ? (
                    <div className="city-card animate-city-rise rounded-lg p-8 text-center text-sm text-sky-50/75">
                        <ClipboardList className="mx-auto mb-3 size-8 text-sky-100" aria-hidden="true" />
                        No submissions yet.
                    </div>
                ) : (
                    <div className="city-panel animate-city-rise overflow-hidden rounded-lg">
                        <div className="overflow-auto">
                            <table className="min-w-full table-fixed text-sm">
                                <thead className="bg-slate-950/80 text-left text-sky-50">
                                    <tr>
                                        <th className="w-52 px-4 py-3 font-semibold">ID</th>
                                        <th className="w-44 px-4 py-3 font-semibold">Submitted</th>
                                        {sortedFields.map((field) => (
                                            <th key={field.id} className="px-4 py-3 font-semibold">
                                                {field.label}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {rows.map((row) => (
                                        <tr
                                            key={row.id}
                                            className="border-t border-sky-100/10 odd:bg-white/5 even:bg-sky-100/10"
                                        >
                                            <td className="px-4 py-3 align-top text-xs text-sky-50/75">
                                                <div className="flex items-start gap-2">
                                                    <Database
                                                        className="mt-0.5 size-3.5 shrink-0 text-sky-100"
                                                        aria-hidden="true"
                                                    />
                                                    <span className="break-all">{row.id}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 align-top text-xs text-sky-50/70">
                                                {row.createdAt
                                                    ? new Date(row.createdAt).toLocaleString()
                                                    : "-"}
                                            </td>

                                            {sortedFields.map((field) => {
                                                const value = row.values?.find(
                                                    (item) => item.fieldId === field.id,
                                                );

                                                return (
                                                    <td
                                                        key={field.id}
                                                        className="px-4 py-3 align-top text-xs text-sky-50/85"
                                                    >
                                                        {value?.value || "-"}
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
