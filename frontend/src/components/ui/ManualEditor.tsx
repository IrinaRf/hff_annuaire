import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import {
    Bold,
    FileDown,
    Heading1,
    Heading2,
    Heading3,
    Italic,
    Link as LinkIcon,
    List,
    ListOrdered,
    PenLine,
    Save,
    Table as TableIcon,
    X,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import type { Paragraph as DocxParagraph, Table as DocxTableType, TextRun as DocxTextRun } from "docx";

interface ManualEditorProps {
    onClose: () => void;
    /** clé de stockage localStorage — passer un id unique par document */
    storageKey?: string;
}

const STORAGE_KEY_DEFAULT = "manual_editor_draft";

const ManualEditor = ({ onClose, storageKey = STORAGE_KEY_DEFAULT }: ManualEditorProps) => {
    const [title, setTitle] = useState("");
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const [saveIndicator, setSaveIndicator] = useState(false);
    const [linkMode, setLinkMode] = useState(false);
    const [linkUrl, setLinkUrl] = useState("");

    // ── Charger le brouillon sauvegardé ─────────────────────────────────────
    const loadDraft = useCallback(() => {
        try {
            const raw = localStorage.getItem(storageKey);
            if (!raw) return null;
            return JSON.parse(raw) as { title: string; content: string; savedAt: string };
        } catch {
            return null;
        }
    }, [storageKey]);

    const draft = loadDraft();

    // ── TipTap ───────────────────────────────────────────────────────────────
    const editor = useEditor({
        extensions: [
            StarterKit,
            Link.configure({
                openOnClick: false,
                autolink: true,
                linkOnPaste: true,
                HTMLAttributes: { class: "text-blue-600 underline cursor-pointer" },
            }),
            Table.configure({ resizable: true }),
            TableRow,
            TableHeader,
            TableCell,
        ],
        content: draft?.content ?? "<p>Commencez à rédiger votre manuel ici...</p>",
        editorProps: {
            attributes: {
                class: "outline-none min-h-[250px] prose prose-sm max-w-none focus:outline-none",
            },
        },
    });

    // ── Titre initial depuis le brouillon ────────────────────────────────────
    useEffect(() => {
        if (draft?.title) setTitle(draft.title);
        if (draft?.savedAt) setLastSaved(new Date(draft.savedAt));
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // ── Sauvegarde auto toutes les 30 s ──────────────────────────────────────
    const saveDraft = useCallback(() => {
        if (!editor) return;
        localStorage.setItem(
            storageKey,
            JSON.stringify({
                title,
                content: editor.getHTML(),
                savedAt: new Date().toISOString(),
            })
        );
        setLastSaved(new Date());
        setSaveIndicator(true);
        setTimeout(() => setSaveIndicator(false), 1500);
    }, [editor, title, storageKey]);

    useEffect(() => {
        const interval = setInterval(saveDraft, 30_000);
        return () => clearInterval(interval);
    }, [saveDraft]);

    // Sauvegarde aussi à chaque frappe (debounce 2 s)
    useEffect(() => {
        if (!editor) return;
        const timeout = setTimeout(saveDraft, 2000);
        // re-déclenche à chaque update
        const handler = () => {
            clearTimeout(timeout);
            setTimeout(saveDraft, 2000);
        };
        editor.on("update", handler);
        return () => {
            editor.off("update", handler);
            clearTimeout(timeout);
        };
    }, [editor, saveDraft]);

    // ── Insérer un lien ──────────────────────────────────────────────────────
    const handleLink = () => {
        if (!editor) return;
        if (linkMode) {
            // Mode lien actif → confirmer
            confirmLink();
        } else if (editor.isActive("link")) {
            // Curseur sur un lien existant → supprimer le lien
            editor.chain().focus().extendMarkRange("link").unsetLink().run();
        } else {
            // Activer le mode saisie
            setLinkUrl("");
            setLinkMode(true);
            setTimeout(() => editor.chain().focus().run(), 50);
        }
    };

    const confirmLink = () => {
        if (!editor) return;
        const url = linkUrl.trim();
        if (url) {
            const fullUrl = url.startsWith("http") ? url : `https://${url}`;
            editor.chain().focus().extendMarkRange("link").setLink({ href: fullUrl }).run();
        }
        setLinkMode(false);
        setLinkUrl("");
    };

    const cancelLink = () => {
        setLinkMode(false);
        setLinkUrl("");
        editor?.chain().focus().run();
    };

    // ── Insérer un tableau ───────────────────────────────────────────────────
    const handleTable = () => {
        editor
            ?.chain()
            .focus()
            .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
            .run();
    };

    // ── Export PDF ───────────────────────────────────────────────────────────
    const handleExportPDF = async () => {
        if (!editor) return;
        const element = document.createElement("div");
        element.innerHTML = `
            <div style="font-family:'Helvetica','Arial',sans-serif;padding:40px;color:#1f2937;background:white;">
                <div style="border-bottom:4px solid #fbbb01;padding-bottom:15px;margin-bottom:30px;">
                    <h1 style="font-size:28px;font-weight:800;margin:0;color:#1f2937;text-transform:uppercase;letter-spacing:-0.5px;">
                        ${title || "Manuel Utilisateur"}
                    </h1>
                    <p style="font-size:10px;color:#9ca3af;margin-top:5px;font-weight:bold;text-transform:uppercase;letter-spacing:1px;">
                        Document Interne — HENRI FRAISE &amp; Cie
                    </p>
                </div>
                <div style="font-size:14px;line-height:1.8;color:#374151;">
                    ${editor.getHTML()}
                </div>
                <div style="margin-top:60px;border-top:1px solid #f3f4f6;font-size:9px;color:#d1d5db;text-align:center;">
                    Généré numériquement le ${new Date().toLocaleDateString("fr-FR")}
                </div>
            </div>`;
        try {
            const html2pdf = (await import("html2pdf.js")).default;
            await html2pdf()
                .set({
                    margin: [15, 15, 15, 15],
                    filename: `${title || "Manuel_utilisateur"}.pdf`,
                    image: { type: "jpeg", quality: 0.98 },
                    html2canvas: { scale: 2, useCORS: true },
                    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
                })
                .from(element)
                .save();
        } catch (e) {
            console.error("Erreur PDF:", e);
            alert("Erreur lors de la génération PDF.");
        }
    };

    // ── Export Markdown ──────────────────────────────────────────────────────
    const handleExportMarkdown = () => {
        if (!editor) return;
        // Conversion HTML → Markdown basique mais fiable
        const html = editor.getHTML();
        const tmp = document.createElement("div");
        tmp.innerHTML = html;

        const convert = (node: Node): string => {
            if (node.nodeType === Node.TEXT_NODE) return node.textContent ?? "";
            const el = node as HTMLElement;
            const tag = el.tagName?.toLowerCase();
            const children = Array.from(el.childNodes).map(convert).join("");
            switch (tag) {
                case "h1": return `# ${children}\n\n`;
                case "h2": return `## ${children}\n\n`;
                case "h3": return `### ${children}\n\n`;
                case "strong": case "b": return `**${children}**`;
                case "em": case "i": return `*${children}*`;
                case "a": return `[${children}](${el.getAttribute("href") ?? ""})`;
                case "ul": return `${Array.from(el.children).map(li => `- ${convert(li)}`).join("\n")}\n\n`;
                case "ol": return `${Array.from(el.children).map((li, i) => `${i + 1}. ${convert(li)}`).join("\n")}\n\n`;
                case "li": return children;
                case "p": return `${children}\n\n`;
                case "br": return "\n";
                case "table": {
                    const rows = Array.from(el.querySelectorAll("tr"));
                    return rows.map((row, ri) => {
                        const cells = Array.from(row.querySelectorAll("th,td")).map(c => convert(c).trim()).join(" | ");
                        const sep = ri === 0 ? `\n${Array.from(row.querySelectorAll("th,td")).map(() => "---").join(" | ")}` : "";
                        return `| ${cells} |${sep}`;
                    }).join("\n") + "\n\n";
                }
                default: return children;
            }
        };

        const md = `# ${title || "Manuel Utilisateur"}\n\n${convert(tmp)}`;
        download(`${title || "Manuel_utilisateur"}.md`, md, "text/markdown");
    };

    // ── Export DOCX ──────────────────────────────────────────────────────────
    const handleExportDOCX = async () => {
        if (!editor) return;
        try {
            const { Document, Packer, Paragraph, TextRun, HeadingLevel, Table: DocxTable, TableRow: DocxTableRow, TableCell: DocxTableCell, WidthType } =
                await import("docx");

            const html = editor.getHTML();
            const tmp = document.createElement("div");
            tmp.innerHTML = html;

            const paragraphs: (DocxParagraph | DocxTableType)[] = [];

            // Titre principal
            paragraphs.push(
                new Paragraph({
                    text: title || "Manuel Utilisateur",
                    heading: HeadingLevel.TITLE,
                })
            );

            const parseEl = (el: HTMLElement): (DocxParagraph | DocxTableType)[] => {
                const tag = el.tagName?.toLowerCase();

                if (tag === "h1")
                    return [new Paragraph({ text: el.textContent ?? "", heading: HeadingLevel.HEADING_1 })];
                if (tag === "h2")
                    return [new Paragraph({ text: el.textContent ?? "", heading: HeadingLevel.HEADING_2 })];
                if (tag === "h3")
                    return [new Paragraph({ text: el.textContent ?? "", heading: HeadingLevel.HEADING_3 })];

                if (tag === "ul" || tag === "ol") {
                    return Array.from(el.children).map((li, i) =>
                        new Paragraph({
                            text: `${tag === "ul" ? "•" : `${i + 1}.`} ${li.textContent ?? ""}`,
                            indent: { left: 720 },
                        })
                    );
                }

                if (tag === "table") {
                    const rows = Array.from(el.querySelectorAll("tr")).map(
                        (row) =>
                            new DocxTableRow({
                                children: Array.from(row.querySelectorAll("th,td")).map(
                                    (cell) =>
                                        new DocxTableCell({
                                            children: [new Paragraph({ text: cell.textContent ?? "" })],
                                        })
                                ),
                            })
                    );
                    return [new DocxTable({ rows, width: { size: 100, type: WidthType.PERCENTAGE } })];
                }

                // Paragraphe générique avec gras/italique inline
                const runs: DocxTextRun[] = [];
                el.childNodes.forEach((node) => {
                    if (node.nodeType === Node.TEXT_NODE) {
                        runs.push(new TextRun({ text: node.textContent ?? "" }));
                    } else {
                        const child = node as HTMLElement;
                        const bold = child.tagName === "STRONG" || child.tagName === "B";
                        const italic = child.tagName === "EM" || child.tagName === "I";
                        runs.push(new TextRun({ text: child.textContent ?? "", bold, italics: italic }));
                    }
                });
                return [new Paragraph({ children: runs.length ? runs : [new TextRun(el.textContent ?? "")] })];
            };

            Array.from(tmp.children).forEach((child) => {
                paragraphs.push(...parseEl(child as HTMLElement));
            });

            const doc = new Document({ sections: [{ children: paragraphs }] });
            const blob = await Packer.toBlob(doc);
            downloadBlob(`${title || "Manuel_utilisateur"}.docx`, blob);
        } catch (e) {
            console.error("Erreur DOCX:", e);
            alert("Erreur lors de la génération DOCX. Vérifiez que la dépendance 'docx' est installée.");
        }
    };

    // ── Helpers download ─────────────────────────────────────────────────────
    const download = (filename: string, text: string, mime: string) => {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(new Blob([text], { type: mime }));
        a.download = filename;
        a.click();
    };

    const downloadBlob = (filename: string, blob: Blob) => {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = filename;
        a.click();
    };

    // ── Toolbar config ───────────────────────────────────────────────────────
    const tools = [
        {
            icon: <Bold size={15} />, label: "Gras",
            action: () => editor?.chain().focus().toggleBold().run(),
            active: () => editor?.isActive("bold"),
        },
        {
            icon: <Italic size={15} />, label: "Italique",
            action: () => editor?.chain().focus().toggleItalic().run(),
            active: () => editor?.isActive("italic"),
        },
        { separator: true },
        {
            icon: <Heading1 size={15} />, label: "Titre 1",
            action: () => editor?.chain().focus().toggleHeading({ level: 1 }).run(),
            active: () => editor?.isActive("heading", { level: 1 }),
        },
        {
            icon: <Heading2 size={15} />, label: "Titre 2",
            action: () => editor?.chain().focus().toggleHeading({ level: 2 }).run(),
            active: () => editor?.isActive("heading", { level: 2 }),
        },
        {
            icon: <Heading3 size={15} />, label: "Titre 3",
            action: () => editor?.chain().focus().toggleHeading({ level: 3 }).run(),
            active: () => editor?.isActive("heading", { level: 3 }),
        },
        { separator: true },
        {
            icon: <List size={15} />, label: "Liste à puces",
            action: () => editor?.chain().focus().toggleBulletList().run(),
            active: () => editor?.isActive("bulletList"),
        },
        {
            icon: <ListOrdered size={15} />, label: "Liste numérotée",
            action: () => editor?.chain().focus().toggleOrderedList().run(),
            active: () => editor?.isActive("orderedList"),
        },
        { separator: true },
        {
            icon: <TableIcon size={15} />, label: "Insérer un tableau 3×3",
            action: handleTable,
            active: () => false,
        },
        {
            icon: <LinkIcon size={15} />, label: linkMode ? "Confirmer le lien" : "Insérer un lien",
            action: handleLink,
            active: () => linkMode || editor?.isActive("link"),
        },

    ];

    return (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-0 sm:p-4">
            <div className="bg-white w-full sm:max-w-4xl rounded-t-xl sm:rounded-sm shadow-2xl flex flex-col h-[95dvh] sm:h-[90vh] border border-gray-300 overflow-hidden">

                {/* ── Header ── */}
                <div className="flex items-center justify-between px-4 sm:px-6 py-4 bg-[#1f2937] border-b-4 border-[#fbbb01]">
                    <div className="flex items-center gap-3">
                        <div className="bg-[#fbbb01] p-1.5 rounded-sm">
                            <PenLine size={18} className="text-[#1f2937]" />
                        </div>
                        <h2 className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-white">
                            Éditeur de manuel
                        </h2>
                        {/* Indicateur de sauvegarde */}
                        {lastSaved && (
                            <span className={`text-[9px] font-bold uppercase tracking-widest transition-all duration-300 ${saveIndicator ? "text-[#fbbb01]" : "text-gray-500"}`}>
                                {saveIndicator ? "✓ Sauvegardé" : `Dernière sauvegarde : ${lastSaved.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}`}
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={saveDraft}
                            title="Sauvegarder maintenant"
                            className="text-gray-400 hover:text-[#fbbb01] hover:bg-white/10 p-2 rounded-full transition-all"
                        >
                            <Save size={16} />
                        </button>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-white hover:bg-white/10 p-2 rounded-full transition-all"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* ── Bannière brouillon récupéré ── */}
                {draft && (
                    <div className="px-6 py-2 bg-amber-50 border-b border-amber-200 flex items-center justify-between">
                        <p className="text-[10px] font-bold text-amber-700 uppercase tracking-widest">
                            📄 Brouillon récupéré — sauvegardé le {new Date(draft.savedAt).toLocaleDateString("fr-FR")} à {new Date(draft.savedAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                        </p>
                        <button
                            onClick={() => {
                                localStorage.removeItem(storageKey);
                                editor?.commands.setContent("<p>Commencez à rédiger votre manuel ici...</p>");
                                setTitle("");
                                setLastSaved(null);
                            }}
                            className="text-[10px] font-black uppercase tracking-widest text-amber-500 hover:text-red-500 transition-colors"
                        >
                            Effacer
                        </button>
                    </div>
                )}

                {/* ── Titre ── */}
                <div className="px-6 sm:px-8 pt-5 pb-3 bg-gray-50/50">
                    <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-[#fbbb01] mb-1.5">
                        Titre du document
                    </p>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Ex : Procédure d'accès..."
                        className="w-full bg-white border-b-2 border-gray-200 focus:border-[#fbbb01] px-0 py-2 sm:py-3 text-base sm:text-lg font-bold outline-none transition-all placeholder:text-gray-300"
                    />
                </div>

                {/* ── Toolbar ── */}
                <div className="flex items-center gap-0.5 px-4 sm:px-6 py-2 border-b border-gray-100 bg-white overflow-x-auto">
                    {tools.map((btn, i) =>
                        "separator" in btn ? (
                            <div key={i} className="w-px h-5 bg-gray-200 mx-1 shrink-0" />
                        ) : (
                            <button
                                key={i}
                                type="button"
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    btn.action();
                                }}
                                title={btn.label}
                                className={`p-2 rounded-sm shrink-0 transition-all ${
                                    "danger" in btn && btn.danger
                                        ? "text-red-400 hover:bg-red-50 hover:text-red-600"
                                        : btn.active()
                                            ? "bg-[#fbbb01] text-[#1f2937] shadow-sm"
                                            : "text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                                }`}
                            >
                                {btn.icon}
                            </button>
                        )
                    )}
                </div>

                {/* ── Barre URL lien ── */}
                {linkMode && (
                    <div className="flex items-center gap-2 px-4 sm:px-6 py-2.5 bg-blue-50 border-b border-blue-200 animate-in slide-in-from-top-1">
                        <LinkIcon size={13} className="text-blue-500 shrink-0" />
                        <input
                            autoFocus
                            type="text"
                            value={linkUrl}
                            onChange={(e) => setLinkUrl(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") confirmLink();
                                if (e.key === "Escape") cancelLink();
                            }}
                            placeholder="https://example.com"
                            className="flex-1 bg-transparent text-sm text-blue-800 placeholder:text-blue-300 outline-none font-mono"
                        />
                        <button
                            onMouseDown={(e) => { e.preventDefault(); confirmLink(); }}
                            className="text-[10px] font-black uppercase tracking-widest text-blue-600 hover:text-blue-800 px-2 py-1 rounded hover:bg-blue-100 transition-all"
                        >
                            OK
                        </button>
                        <button
                            onMouseDown={(e) => { e.preventDefault(); cancelLink(); }}
                            className="text-[10px] font-black uppercase tracking-widest text-blue-400 hover:text-blue-600 px-2 py-1 rounded hover:bg-blue-100 transition-all"
                        >
                            Annuler
                        </button>
                    </div>
                )}

                {/* ── Bouton suppression tableau contextuel ── */}
                {editor?.isActive("table") && (
                    <div className="flex items-center justify-end px-4 sm:px-6 py-1.5 bg-red-50 border-b border-red-100">
                        <button
                            onMouseDown={(e) => {
                                e.preventDefault();
                                editor.chain().focus().deleteTable().run();
                            }}
                            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-red-400 hover:text-red-600 transition-colors"
                        >
                            <span>✕</span>
                            <span>Supprimer le tableau</span>
                        </button>
                    </div>
                )}

                {/* ── Éditeur ── */}
                <div className="flex-1 overflow-y-auto bg-white px-6 sm:px-8 py-4 sm:py-6
                    [&_.ProseMirror]:outline-none
                    [&_.ProseMirror_h1]:text-2xl [&_.ProseMirror_h1]:font-black [&_.ProseMirror_h1]:mt-4 [&_.ProseMirror_h1]:mb-2
                    [&_.ProseMirror_h2]:text-xl [&_.ProseMirror_h2]:font-bold [&_.ProseMirror_h2]:mt-3 [&_.ProseMirror_h2]:mb-1.5
                    [&_.ProseMirror_h3]:text-base [&_.ProseMirror_h3]:font-semibold [&_.ProseMirror_h3]:mt-2 [&_.ProseMirror_h3]:mb-1
                    [&_.ProseMirror_ul]:list-disc [&_.ProseMirror_ul]:pl-6 [&_.ProseMirror_ul]:my-2
                    [&_.ProseMirror_ol]:list-decimal [&_.ProseMirror_ol]:pl-6 [&_.ProseMirror_ol]:my-2
                    [&_.ProseMirror_li]:my-0.5
                    [&_.ProseMirror_table]:border-collapse [&_.ProseMirror_table]:w-full [&_.ProseMirror_table]:my-3
                    [&_.ProseMirror_td]:border [&_.ProseMirror_td]:border-gray-300 [&_.ProseMirror_td]:px-3 [&_.ProseMirror_td]:py-1.5 [&_.ProseMirror_td]:text-sm
                    [&_.ProseMirror_th]:border [&_.ProseMirror_th]:border-gray-300 [&_.ProseMirror_th]:px-3 [&_.ProseMirror_th]:py-1.5 [&_.ProseMirror_th]:bg-gray-100 [&_.ProseMirror_th]:font-bold [&_.ProseMirror_th]:text-sm
                ">
                    <EditorContent editor={editor} />
                </div>

                {/* ── Footer ── */}
                <div className="px-6 sm:px-8 py-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-3">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest text-center sm:text-left">
                        Déposer dans{" "}
                        <code className="bg-gray-200 px-1.5 py-0.5 rounded text-gray-600 font-mono lowercase">
                            public/docs/
                        </code>
                    </p>
                    <div className="flex flex-wrap justify-end gap-2 w-full sm:w-auto">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-[11px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-600"
                        >
                            Annuler
                        </button>
                        <button
                            onClick={handleExportMarkdown}
                            className="flex items-center gap-2 bg-white border border-gray-300 text-gray-600 px-4 py-2 rounded-sm text-[11px] font-black uppercase tracking-widest hover:border-gray-400 transition-all"
                        >
                            <FileDown size={14} />
                            <span>.MD</span>
                        </button>
                        <button
                            onClick={handleExportDOCX}
                            className="flex items-center gap-2 bg-white border border-gray-300 text-gray-600 px-4 py-2 rounded-sm text-[11px] font-black uppercase tracking-widest hover:border-gray-400 transition-all"
                        >
                            <FileDown size={14} />
                            <span>.DOCX</span>
                        </button>
                        <button
                            onClick={handleExportPDF}
                            className="flex items-center gap-2 bg-[#1f2937] text-[#fbbb01] px-5 py-2 rounded-sm text-[11px] font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all"
                        >
                            <FileDown size={14} />
                            <span>PDF</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManualEditor;